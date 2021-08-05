import * as uuid from 'uuid'

import { Transaction } from '../../models/TransactionItem'
import { TodoAccess } from '../dataLayer/transactionAccess'
import { getUserId } from '../auth/utils'

interface CreateTransactionRequest {
    amount: string
    status: string
    description: string
    attachmentUrl: string
  }

  interface UpdateTodoRequest {
    name: string
    dueDate: string
    done: boolean
  }

const todoAccess = new TodoAccess()

export async function getTransactions(jwtToken: string): Promise<Transaction[]> {
  const userId = getUserId(jwtToken)
  return todoAccess.getTransactions(userId)
}

export async function createTransaction(
  createTodoRequest: CreateTransactionRequest,
  jwtToken: string
): Promise<Transaction> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  const creation = await todoAccess.createTodo({
    transactionId: itemId,
    userId: userId,
    description: createTodoRequest.description,
    status: createTodoRequest.status,
    amount: createTodoRequest.amount,
    createdAt: new Date().toISOString()
  });
  return creation;
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  itemId: string,
  jwtToken: string
): Promise<Transaction> {

  const userId = getUserId(jwtToken)

  return await todoAccess.updateTodo({
    todoId: itemId,
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
    createdAt: new Date().toISOString()
  })
}

export async function deleteTodo(
  todoId: string,
  jwtToken: string
): Promise<String> {

  const userId = getUserId(jwtToken)

  return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(
  todoId: string,
  jwtToken: string
): Promise<String> {
  const userId = getUserId(jwtToken)
  return await todoAccess.generateUploadUrl(todoId, userId)
}
