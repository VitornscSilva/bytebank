import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse, LoginRequest, RegisterRequest, ApiResponse } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  refreshUser: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          const result: ApiResponse<AuthResponse> = await response.json()

          if (result.success && result.data) {
            const { user, token } = result.data
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              error: result.error || 'Login failed',
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: 'Network error during login',
            isLoading: false,
          })
          return false
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          const result: ApiResponse<AuthResponse> = await response.json()

          if (result.success && result.data) {
            const { user, token } = result.data
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              error: result.error || 'Registration failed',
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: 'Network error during registration',
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      refreshUser: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          const result: ApiResponse<User> = await response.json()

          if (result.success && result.data) {
            set({ user: result.data })
          } else {
            if (response.status === 401) {
              console.error('Authentication failed, logging out:', result.error)
              get().logout()
            } else {
              console.warn('Failed to refresh user but not logging out:', result.error)
            }
          }
        } catch (error) {
          console.error('Network error during user refresh:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore 