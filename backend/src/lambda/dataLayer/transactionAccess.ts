import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.VOUCHER_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

import { Transaction } from '../../models/TransactionItem'
import { TransactionUpdateItem } from '../../models/TransactionUpdateItem'

export class TransactionAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly transactionsTable = process.env.TRANSACTIONS_TABLE) {
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    console.log('Getting todos from user')
    var params = {
        TableName : this.transactionsTable,
        KeyConditionExpression: "#idUser = :user",
        ExpressionAttributeNames:{
            "#idUser": "userId"
        },
        ExpressionAttributeValues: {
            ":user": userId
        }
    };
    let result: Transaction[] | PromiseLike<Transaction[]>
    await this.docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } else {
            console.log("Query succeeded.");
            result = <Transaction[]>data.Items
        }
    }).promise()


    return result
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    transaction = {
      ...transaction,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${transaction.transactionId}`
    }
    await this.docClient.put({
      TableName: this.transactionsTable,
      Item: transaction
    }).promise()

    return transaction
  }

  async updateTransaction(transactionUpdate: TransactionUpdateItem): Promise<TransactionUpdateItem> {
    
    var params = {
        TableName : this.transactionsTable,
        Key: {
          "userId": transactionUpdate.userId,
          "transactionId": transactionUpdate.transactionId
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames:{
          "#status": "status"
        },
        ExpressionAttributeValues:{
            ":status": transactionUpdate.status,
        },
        ReturnValues:"UPDATED_NEW"
    };
    await this.docClient.update(params, function(err) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } 
    }).promise()

    return transactionUpdate
  }

  async deleteTransaction(transactionId: string, userId:string): Promise<string> {

    var params = {
        TableName : this.transactionsTable,
        Key:{
          "transactionId": transactionId,
          "userId": userId
        },
        ConditionExpression: "#idUser = :user and #transactionId = :transactionId",
        ExpressionAttributeNames:{
            "#idUser": "userId",
            "#transactionId": "transactionId"
        },
        ExpressionAttributeValues: {
            ":user": userId,
            ":transactionId": transactionId
        }
    };

    await this.docClient.delete(params, function(err) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } 
    }).promise()

    return transactionId
  }

  async generateUploadUrl(transactionId: string, userId:string): Promise<string> {
    let validated: boolean

    var params = {
        TableName : this.transactionsTable,
        KeyConditionExpression: "#idUser = :user and #transactionId = :transactionId",
        ExpressionAttributeNames:{
            "#idUser": "userId",
            "#transactionId": "transactionId"
        },
        ExpressionAttributeValues: {
            ":user": userId,
            ":todo": transactionId
        }
    };

    await this.docClient.query(params, function(err) {
        if (err) {
            console.error("Unable to query. Error:", err);
            validated = false
        } else {
            console.log("Query succeeded.");
            validated = true
        }
    }).promise()

    if (validated){
      return await s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: transactionId,
        Expires: urlExpiration
      })
    }
    return ''
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
