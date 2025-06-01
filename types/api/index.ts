export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  name: string
  email: string
  accountBalance: number
  createdAt: string
  updatedAt: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment'
  amount: number
  description?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionRequest {
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment'
  amount: number
  description?: string
  date: string
}

export interface UpdateTransactionRequest {
  type?: 'deposit' | 'withdrawal' | 'transfer' | 'payment'
  amount?: number
  description?: string
  date?: string
}

export interface Investment {
  id: string
  userId: string
  name: string
  type: 'stocks' | 'bonds' | 'funds' | 'crypto'
  symbol: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercentage: number
  purchaseDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvestmentRequest {
  name: string
  type: 'stocks' | 'bonds' | 'funds' | 'crypto'
  symbol: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
}

export interface UpdateInvestmentRequest {
  name?: string
  type?: 'stocks' | 'bonds' | 'funds' | 'crypto'
  symbol?: string
  quantity?: number
  purchasePrice?: number
  purchaseDate?: string
} 