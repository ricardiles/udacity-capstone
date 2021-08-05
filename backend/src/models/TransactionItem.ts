export interface Transaction {
  transactionId: string
  userId: string
  createdAt: number
  description: string
  amount: string
  status: boolean
  attachmentUrl?: string
}
