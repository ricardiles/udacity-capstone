import * as uuid from 'uuid'

import { Transaction } from '../../models/TransactionItem'
import { TransactionAccess } from '../dataLayer/transactionAccess'
import { getUserId } from '../auth/utils'
import { CreateTransactionRequest } from '../../requests/CreateTransactionRequest'
import { UpdateTransactionRequest } from '../../requests/UpdateTransactionRequest'


const transactionAccess = new TransactionAccess()

export async function getTransactions(jwtToken: string): Promise<Transaction[]> {
  const userId = getUserId(jwtToken)
  return transactionAccess.getTransactions(userId)
}

export async function createTransaction(
  createTodoRequest: CreateTransactionRequest,
  jwtToken: string
): Promise<Transaction> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  const creation = await transactionAccess.createTransaction({
    transactionId: itemId,
    userId: userId,
    description: createTodoRequest.description,
    status: createTodoRequest.status,
    amount: createTodoRequest.amount,
    createdAt: new Date().toISOString()
  });
  return creation;
}

export async function updateTransaction(
  updateTodoRequest: UpdateTransactionRequest,
  itemId: string,
  jwtToken: string
): Promise<Transaction> {

  const userId = getUserId(jwtToken)
  const updateItem = {
    transactionId: itemId,
    userId: userId,
    status: updateTodoRequest.status
  }
  return await transactionAccess.updateTransaction(updateItem)
}

export async function deleteTransaction(
  transactionId: string,
  jwtToken: string
): Promise<String> {

  const userId = getUserId(jwtToken)

  return await transactionAccess.deleteTransaction(transactionId, userId)
}

export async function generateUploadUrl(
  todoId: string,
  jwtToken: string
): Promise<String> {
  const userId = getUserId(jwtToken)
  return await transactionAccess.generateUploadUrl(todoId, userId)
}
