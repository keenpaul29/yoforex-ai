import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLocalStorage } from './use-local-storage'

interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
  avatar?: string
  role?: string
  preferences?: Record<string, any>
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const API_BASE_URL = '/api/auth'
const TOKEN_STORAGE_KEY = 'auth_tokens'
const USER_STORAGE_KEY = 'auth_user'

export function useAuth() {
  const router = useRouter()
  const [tokens, setTokens, removeTokens] = useLocalStorage<AuthTokens | null>(
    TOKEN_STORAGE_KEY,
    null
  )
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage<User | null>(
    USER_STORAGE_KEY,
    null
  )

  const [state, setState] = useState<AuthState>({
    user: storedUser,
    isLoading: true,
    isAuthenticated: !!storedUser && !!tokens,
    error: null,
  })

  // Check if token is expired
  const isTokenExpired = useMemo(() => {
    if (!tokens) return true
    return Date.now() >= tokens.expiresAt
  }, [tokens])

  // Auto-refresh token when it's about to expire
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!tokens?.refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const newTokens: AuthTokens = await response.json()
      setTokens(newTokens)
      
      setState(prev => ({ ...prev, error: null }))
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      return false
    }
  }, [tokens, setTokens])

  // Verify current user session
  const verifySession = useCallback(async (): Promise<User | null> => {
    if (!tokens || isTokenExpired) {
      if (tokens?.refreshToken) {
        const refreshed = await refreshToken()
        if (!refreshed) return null
      } else {
        return null
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await refreshToken()
          if (refreshed) {
            return verifySession()
          }
        }
        throw new Error('Session verification failed')
      }

      const user: User = await response.json()
      setStoredUser(user)
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        error: null,
      }))

      return user
    } catch (error) {
      console.error('Session verification error:', error)
      await logout()
      return null
    }
  }, [tokens, isTokenExpired, refreshToken, setStoredUser])

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Login failed')
        }

        const { user, tokens: authTokens }: { user: User; tokens: AuthTokens } = 
          await response.json()

        setTokens(authTokens)
        setStoredUser(user)

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })

        toast.success(`Welcome back, ${user.name}!`)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Login failed')
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err,
        }))
        toast.error(err.message)
        throw err
      }
    },
    [setTokens, setStoredUser]
  )

  // Register function
  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Registration failed')
        }

        const result = await response.json()

        setState(prev => ({ ...prev, isLoading: false }))
        toast.success('Registration successful! Please check your email to verify your account.')
        
        // Optionally auto-login after registration
        if (result.autoLogin) {
          await login({ email: data.email, password: data.password })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Registration failed')
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err,
        }))
        toast.error(err.message)
        throw err
      }
    },
    [login]
  )

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      if (tokens?.accessToken) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      removeTokens()
      removeStoredUser()
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })

      toast.success('Logged out successfully')
      router.push('/login')
    }
  }, [tokens, removeTokens, removeStoredUser, router])

  // Update user profile
  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<void> => {
      if (!tokens?.accessToken || !state.user) {
        throw new Error('Not authenticated')
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error('Profile update failed')
        }

        const updatedUser: User = await response.json()
        setStoredUser(updatedUser)
        
        setState(prev => ({
          ...prev,
          user: updatedUser,
        }))

        toast.success('Profile updated successfully')
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Profile update failed')
        toast.error(err.message)
        throw err
      }
    },
    [tokens, state.user, setStoredUser]
  )

  // Send password reset email
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Password reset request failed')
      }

      toast.success('Password reset email sent')
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Password reset failed')
      toast.error(err.message)
      throw err
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (tokens && !isTokenExpired) {
        await verifySession()
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, []) // Only run on mount

  // Set up token refresh interval
  useEffect(() => {
    if (!tokens || !state.isAuthenticated) return

    const refreshInterval = setInterval(() => {
      const timeUntilExpiry = tokens.expiresAt - Date.now()
      const refreshThreshold = 5 * 60 * 1000 // 5 minutes

      if (timeUntilExpiry <= refreshThreshold) {
        refreshToken()
      }
    }, 60000) // Check every minute

    return () => clearInterval(refreshInterval)
  }, [tokens, state.isAuthenticated, refreshToken])

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    refreshToken,
    verifySession,
  }
}
