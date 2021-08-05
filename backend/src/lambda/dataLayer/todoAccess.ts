import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

import { TodoItem } from '../../models/TodoItem'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting todos from user')
    var params = {
        TableName : this.todosTable,
        KeyConditionExpression: "#idUser = :user",
        ExpressionAttributeNames:{
            "#idUser": "userId"
        },
        ExpressionAttributeValues: {
            ":user": userId
        }
    };
    let result: TodoItem[] | PromiseLike<TodoItem[]>
    await this.docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } else {
            console.log("Query succeeded.");
            result = <TodoItem[]>data.Items
        }
    }).promise()


    return result
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    todo = {
      ...todo,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todo.todoId}`
    }
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todo: TodoItem): Promise<TodoItem> {
    
    var params = {
        TableName : this.todosTable,
        Key: {
          "userId": todo.userId,
          "todoId": todo.todoId
        },
        UpdateExpression: "SET #name = :name, #done = :done, #dueDate = :due",
        ExpressionAttributeNames:{
          "#name": "name",
          "#done": "done",
          "#dueDate": "dueDate"
        },
        ExpressionAttributeValues:{
            ":name": todo.name,
            ":done": todo.done,
            ":due": todo.dueDate
        },
        ReturnValues:"UPDATED_NEW"
    };
    await this.docClient.update(params, function(err) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } 
    }).promise()

    return todo
  }

  async deleteTodo(todoId: string, userId:string): Promise<string> {

    var params = {
        TableName : this.todosTable,
        Key:{
          "todoId": todoId,
          "userId": userId
        },
        ConditionExpression: "#idUser = :user and #idTodo = :todo",
        ExpressionAttributeNames:{
            "#idUser": "userId",
            "#idTodo": "todoId"
        },
        ExpressionAttributeValues: {
            ":user": userId,
            ":todo": todoId
        }
    };

    await this.docClient.delete(params, function(err) {
        if (err) {
            console.error("Unable to query. Error:", err);
        } 
    }).promise()

    return todoId
  }

  async generateUploadUrl(todoId: string, userId:string): Promise<string> {
    let validated: boolean

    var params = {
        TableName : this.todosTable,
        KeyConditionExpression: "#idUser = :user and #idTodo = :todo",
        ExpressionAttributeNames:{
            "#idUser": "userId",
            "#idTodo": "todoId"
        },
        ExpressionAttributeValues: {
            ":user": userId,
            ":todo": todoId
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
        Key: todoId,
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
