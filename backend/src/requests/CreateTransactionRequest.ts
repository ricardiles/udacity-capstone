/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTransactionRequest {
  amount: string
  status: string
  description: string
  attachmentUrl: string
}
