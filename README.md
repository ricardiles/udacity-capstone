# Ricardo Ardiles Capstone

# Getting Started

This project uses the TODO list from project 4 and transforms it into a list of transactions or payments for a store. 

The idea is to create transactions to have a record of the income with the possibility of having 3 statuses: 
* Pending.
* Canceled.
* Completed.

Once the transaction is created there are 3 buttons:
* Pencil: Update amount, description and status.
* File: Upload voucher photo.
* Cross: Delete transaction.

At the bottom are the totals for the 3 states and the final total.

As we learned in class, this project is divided in 2 parts:
* [backend](backend)
* [client](client)

## Backend

Backend folder contains the serveless application that run in AWS CloudFormation. The latest version is deployed in:
```
https://9aghsuepzh.execute-api.us-west-2.amazonaws.com/dev/
```
```
Endpoints:
  GET - https://9aghsuepzh.execute-api.us-east-2.amazonaws.com/dev/transactions
  POST - https://9aghsuepzh.execute-api.us-east-2.amazonaws.com/dev/transactions
  PATCH - https://9aghsuepzh.execute-api.us-east-2.amazonaws.com/dev/transactions/{transactionid}
  DELETE - https://9aghsuepzh.execute-api.us-east-2.amazonaws.com/dev/transactions/{transactionsid}
  POST - https://9aghsuepzh.execute-api.us-east-2.amazonaws.com/dev/todos/{transactions}/attachment
```

```
Functions:
  Auth: capstone-udacity-dev-Auth
  GetTodos: capstone-udacity-dev-GetTransactions
  CreateTodo: capstone-udacity-dev-CreateTransaction
  UpdateTodo: capstone-udacity-dev-UpdateTransaction
  DeleteTodo: capstone-udacity-dev-DeleteTransaction
  GenerateUploadUrl: capstone-udacity-dev-GenerateUploadUrl
```

* region: us-east-2
* apiId: 9aghsuepzh

### serveless.yml

backend/serveless.yml contains all structure to deploy in AWS (Resources, Environment, IamRole, Functions)

## Client

Client folder contains Web App deployed to connect with the backend with Auth0 Security. 

Client run with Elastic Beanstalk and the url is: 
```
http://client-dev.us-west-2.elasticbeanstalk.com/
```

client/src/config.ts contains the configuration to connect:

```typescript
const apiId = '9aghsuepzh'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-viwwox7z.us.auth0.com',            // Auth0 domain
  clientId: 'eUDp5Frob9HdYuedNyyzIdU0cfOcj948',          // Auth0 client id
  callbackUrl: 'http://client-dev.us-west-2.elasticbeanstalk.com/callback'
}
```

## Folder Structure 

I used folder structure learned in class:

    .
    ├── backend  # Serveless application
    │   ├── models  
    │   │   ├── create-transaction-request.json  # Used to validate create request
    │   │   └── update-transaction-request.json  # Used to validate update request
    │   ├── src 
    │   │   ├── auth
    │   │   │   ├── Jwt.ts  # Interface of Jwt
    │   │   │   ├── JwtPayload.ts # Interface of Jwt payload
    │   │   │   └── utils.ts
    │   │   ├── lambda
    │   │   │   ├── auth
    |   │   │   │   ├── auth0Authorizer.ts  # auth0 functions with jwksUrl validation
    |   │   │   │   └── utils.ts
    │   │   │   ├── businessLogic
    |   │   │   │   └── transaction.ts # Logic layer that connects Data layer with Endpoints layer
    │   │   │   ├── dataLayer
    |   │   │   │   └── transactionAccess.ts  # Data layer handles connections to DynamoDB and S3
    │   │   │   ├── http
    |   │   │   │   ├── createTransaction.ts
    |   │   │   │   ├── deleteTransaction.ts
    |   │   │   │   ├── generateUploadUrl.ts
    |   │   │   │   ├── getTransaction.ts
    |   │   │   │   └── updateTransaction.ts
    │   │   │   └── utils.ts
    │   │   ├── models
    │   │   │   ├── TransactionItem.ts  # Model of Item
    │   │   │   └── TransactionUpdate.ts  # Model of update data
    │   │   ├── requests
    │   │   │   ├── CreateTransactionRequest.ts
    │   │   │   └── UpdateTransactionRequest.ts
    │   │   └── utils
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── serveless.yml
    │   ├── tsconfig.json
    │   └── webpack.config.js
    ├── client
    │   └── ...  
    ├── images
    ├── Final Project.postman_collection.json
    └── ...


## Postman Collection

In the top of the repository there is a postman collection
```
Udacity Capstone.postman_collection.json
```
That contains examples of the use of the endpoints and examples generated.

## Images

Images folder contains evidence of the operation and deployment of the application.

* Auth0 - Configuration.png
* Auth0 - Login

* AWS - ApiGateway.png
* AWS - X Ray analytics.png
* AWS - X Ray map.png
* AWS - X Ray traces.png

* Client - Login.png
* Client - New user.png
* Client - New transaction.png
* Client - Update transaction.png
* Client - Delete transaction.png
* Client - Voucher transaction.png
* Client - Voucher transaction2.png

* CloudFormation - Backend.png
* Elastic Beanstalk - Client.png
