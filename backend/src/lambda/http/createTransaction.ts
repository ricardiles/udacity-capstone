import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTransactionRequest } from '../../requests/CreateTransactionRequest'
import { createTransaction } from '../businessLogic/transactions'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTransaction: CreateTransactionRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createTransaction(newTransaction, jwtToken)
  

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      "item":{
        "transactionId": item.transactionId,
        "createdAt": item.createdAt,
        "status": item.status,
        "description": item.description,
        "attachmentUrl": item.attachmentUrl
      }
    })
  }

}
