export interface Transaction {
    transactionId: string
    userId: string
    createdAt?: string
    description?: string
    amount: number
    status: string
    attachmentUrl?: string
  }
  