/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTransactionRequest {
  status: string,
  amount?: string,
  description?: string
}