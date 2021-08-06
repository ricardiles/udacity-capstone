export interface Transaction {
  transactionId: string
  userId: string
  createdAt?: string
  description?: string
  amount?: string
  status: string
  attachmentUrl?: string
}
