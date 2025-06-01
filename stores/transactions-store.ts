import { create } from 'zustand'
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest, ApiResponse } from '@/types/api'
import useAuthStore from './auth-store'

interface TransactionsState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  totalBalance: number
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>
  createTransaction: (transaction: CreateTransactionRequest) => Promise<boolean>
  updateTransaction: (id: string, transaction: UpdateTransactionRequest) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
  clearError: () => void
  setLoading: (loading: boolean) => void
  calculateBalance: () => void
}

type TransactionsStore = TransactionsState & TransactionsActions

const useTransactionsStore = create<TransactionsStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  totalBalance: 0,

  fetchTransactions: async () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result: ApiResponse<Transaction[]> = await response.json()

      if (result.success && result.data) {
        set({ 
          transactions: result.data,
          isLoading: false,
          error: null,
        })
        get().calculateBalance()
      } else {
        set({
          error: result.error || 'Failed to fetch transactions',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: 'Network error while fetching transactions',
        isLoading: false,
      })
    }
  },

  createTransaction: async (transactionData: CreateTransactionRequest) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      const result: ApiResponse<Transaction> = await response.json()

      if (result.success && result.data) {
        const newTransaction = result.data
        set(state => {
          const updatedTransactions = [...state.transactions]
          const insertIndex = updatedTransactions.findIndex(
            t => new Date(t.date).getTime() < new Date(newTransaction.date).getTime()
          )
          
          if (insertIndex === -1) {
            updatedTransactions.push(newTransaction)
          } else {
            updatedTransactions.splice(insertIndex, 0, newTransaction)
          }
          
          return {
            transactions: updatedTransactions,
            isLoading: false,
            error: null,
          }
        })
        get().calculateBalance()
        
        const authStore = useAuthStore.getState()
        if (authStore.user && authStore.isAuthenticated) {
          const balanceChange = newTransaction.type === 'deposit' 
            ? newTransaction.amount 
            : -newTransaction.amount
          
          const updatedUser = {
            ...authStore.user,
            accountBalance: authStore.user.accountBalance + balanceChange
          }
          
          useAuthStore.setState({ user: updatedUser })
        }
        
        return true
      } else {
        set({
          error: result.error || 'Failed to create transaction',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while creating transaction',
        isLoading: false,
      })
      return false
    }
  },

  updateTransaction: async (id: string, transactionData: UpdateTransactionRequest) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      const result: ApiResponse<Transaction> = await response.json()

      if (result.success && result.data) {
        const updatedTransaction = result.data
        set(state => ({
          transactions: state.transactions.map(t => 
            t.id === id ? updatedTransaction : t
          ),
          isLoading: false,
          error: null,
        }))
        get().calculateBalance()
        return true
      } else {
        set({
          error: result.error || 'Failed to update transaction',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while updating transaction',
        isLoading: false,
      })
      return false
    }
  },

  deleteTransaction: async (id: string) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result: ApiResponse<null> = await response.json()

      if (result.success) {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id),
          isLoading: false,
          error: null,
        }))
        get().calculateBalance()
        return true
      } else {
        set({
          error: result.error || 'Failed to delete transaction',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while deleting transaction',
        isLoading: false,
      })
      return false
    }
  },

  clearError: () => {
    set({ error: null })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  calculateBalance: () => {
    const { transactions } = get()
    const balance = transactions.reduce((total, transaction) => {
      if (transaction.type === 'deposit') {
        return total + transaction.amount
      } else {
        return total - transaction.amount
      }
    }, 0)
    
    set({ totalBalance: balance })
  },
}))

export default useTransactionsStore 