import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { getUserId } from '../auth/utils'

interface CreateTodoRequest {
    createdAt: string
    name: string
    dueDate: string
    done: boolean
    attachmentUrl: string
  }

  interface UpdateTodoRequest {
    name: string
    dueDate: string
    done: boolean
  }

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken)
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  itemId: string,
  jwtToken: string
): Promise<TodoItem> {

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
