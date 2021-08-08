import { apiEndpoint } from '../config'
import { Transaction } from '../types/Transaction';
import { CreateTransactionRequest } from '../types/CreateTransactionRequest';
import Axios from 'axios'
import { UpdateTransactionRequest } from '../types/UpdateTransactionRequest';

export async function getTransaction(idToken: string): Promise<Transaction[]> {
  console.log('Fetching transactions')

  const response = await Axios.get(`${apiEndpoint}/transactions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Transactions:', response.data)
  return response.data.items
}

export async function createTransaction(
  idToken: string,
  newTransaction: CreateTransactionRequest
): Promise<Transaction> {
  const response = await Axios.post(`${apiEndpoint}/transactions`,  JSON.stringify(newTransaction), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTransaction(
  idToken: string,
  transactionId: string,
  updatedTransaction: UpdateTransactionRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/transactions/${transactionId}`, JSON.stringify(updatedTransaction), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTransaction(
  idToken: string,
  transactionId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/transactions/${transactionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  transactionId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/transactions/${transactionId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
