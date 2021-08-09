import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { generateUploadUrl } from '../businessLogic/transactions'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const transactionId = event.pathParameters.transactionid

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log("transactionId");
  console.log(transactionId);
  const url = await generateUploadUrl(transactionId, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      'uploadUrl':url
    })
  }

}
