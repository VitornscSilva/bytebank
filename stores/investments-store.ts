import { create } from 'zustand'
import { Investment, CreateInvestmentRequest, UpdateInvestmentRequest, ApiResponse } from '@/types/api'
import useAuthStore from './auth-store'

interface InvestmentsState {
  investments: Investment[]
  isLoading: boolean
  error: string | null
  totalPortfolioValue: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
}

interface InvestmentsActions {
  fetchInvestments: () => Promise<void>
  createInvestment: (investment: CreateInvestmentRequest) => Promise<boolean>
  updateInvestment: (id: string, investment: UpdateInvestmentRequest) => Promise<boolean>
  deleteInvestment: (id: string) => Promise<boolean>
  clearError: () => void
  setLoading: (loading: boolean) => void
  calculatePortfolioStats: () => void
  refreshPrices: () => Promise<void>
}

type InvestmentsStore = InvestmentsState & InvestmentsActions

const useInvestmentsStore = create<InvestmentsStore>((set, get) => ({
  investments: [],
  isLoading: false,
  error: null,
  totalPortfolioValue: 0,
  totalProfitLoss: 0,
  totalProfitLossPercentage: 0,

  fetchInvestments: async () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/investments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result: ApiResponse<Investment[]> = await response.json()

      if (result.success && result.data) {
        set({ 
          investments: result.data,
          isLoading: false,
          error: null,
        })
        get().calculatePortfolioStats()
      } else {
        set({
          error: result.error || 'Failed to fetch investments',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: 'Network error while fetching investments',
        isLoading: false,
      })
    }
  },

  createInvestment: async (investmentData: CreateInvestmentRequest) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      })

      const result: ApiResponse<Investment> = await response.json()

      if (result.success && result.data) {
        const newInvestment = result.data
        set(state => ({
          investments: [newInvestment, ...state.investments],
          isLoading: false,
          error: null,
        }))
        get().calculatePortfolioStats()
        return true
      } else {
        set({
          error: result.error || 'Failed to create investment',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while creating investment',
        isLoading: false,
      })
      return false
    }
  },

  updateInvestment: async (id: string, investmentData: UpdateInvestmentRequest) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      })

      const result: ApiResponse<Investment> = await response.json()

      if (result.success && result.data) {
        const updatedInvestment = result.data
        set(state => ({
          investments: state.investments.map(inv => 
            inv.id === id ? updatedInvestment : inv
          ),
          isLoading: false,
          error: null,
        }))
        get().calculatePortfolioStats()
        return true
      } else {
        set({
          error: result.error || 'Failed to update investment',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while updating investment',
        isLoading: false,
      })
      return false
    }
  },

  deleteInvestment: async (id: string) => {
    const { token } = useAuthStore.getState()
    if (!token) {
      set({ error: 'No authentication token' })
      return false
    }

    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result: ApiResponse<null> = await response.json()

      if (result.success) {
        set(state => ({
          investments: state.investments.filter(inv => inv.id !== id),
          isLoading: false,
          error: null,
        }))
        get().calculatePortfolioStats()
        return true
      } else {
        set({
          error: result.error || 'Failed to delete investment',
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      set({
        error: 'Network error while deleting investment',
        isLoading: false,
      })
      return false
    }
  },

  refreshPrices: async () => {
    const { token } = useAuthStore.getState()
    if (!token) return

    try {
      const response = await fetch('/api/investments/refresh-prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result: ApiResponse<Investment[]> = await response.json()

      if (result.success && result.data) {
        set({ investments: result.data })
        get().calculatePortfolioStats()
      }
    } catch (error) {
      console.error('Failed to refresh prices:', error)
    }
  },

  clearError: () => {
    set({ error: null })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  calculatePortfolioStats: () => {
    const { investments } = get()
    
    const totalValue = investments.reduce((total, investment) => {
      return total + investment.totalValue
    }, 0)

    const totalCost = investments.reduce((total, investment) => {
      return total + (investment.purchasePrice * investment.quantity)
    }, 0)

    const totalProfitLoss = totalValue - totalCost
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0
    
    set({ 
      totalPortfolioValue: totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
    })
  },
}))

export default useInvestmentsStore 