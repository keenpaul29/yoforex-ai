import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type CustomHeaders = Record<string, string | string[] | undefined>;

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  token?: string
  isFormData?: boolean
  headers?: HeadersInit | CustomHeaders
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, isFormData = false, headers: customHeaders, ...fetchOptions } = options
  const headers: HeadersInit = {}

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const finalHeaders = new Headers()
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value) finalHeaders.set(key, value)
    })
    
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => finalHeaders.append(key, v))
          } else {
            finalHeaders.set(key, value)
          }
        }
      })
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: finalHeaders,
      credentials: 'include',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred')
    }

    return data
  } catch (error) {
    console.error('API Request Error:', error)
    if (process.env.NODE_ENV !== 'production') {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
    throw error
  }
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
}

// Market Data API
export const marketApi = {
  getCandles: (symbol: string, timeframe: string, limit: number = 100) =>
    apiRequest<Array<{
      timestamp: number
      open: number
      high: number
      low: number
      close: number
      volume: number
    }>>(`/market/candles?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`),
}

// Trades API
export const tradesApi = {
  getTrades: (filters: {
    status?: 'open' | 'closed' | 'pending'
    symbol?: string
    page?: number
    limit?: number
  }) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.symbol) params.append('symbol', filters.symbol)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    return apiRequest<{
      data: Array<{
        id: string
        pair: string
        type: 'buy' | 'sell'
        lotSize: number
        entryPrice: number
        exitPrice: number | null
        pips: number | null
        profit: number | null
        status: 'open' | 'closed' | 'pending'
        openTime: string
        closeTime: string | null
        takeProfit: number | null
        stopLoss: number | null
      }>
      total: number
      page: number
      totalPages: number
    }>(`/trades?${params.toString()}`)
  },
}

// Forum API
export const forumApi = {
  getPosts: (params: {
    category?: string
    tag?: string
    page?: number
    limit?: number
  } = {}) => {
    const queryParams = new URLSearchParams()
    if (params.category) queryParams.append('category', params.category)
    if (params.tag) queryParams.append('tag', params.tag)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    
    return apiRequest<{
      data: Array<{
        id: string
        title: string
        author: {
          name: string
          role: 'admin' | 'moderator' | 'member' | 'pro'
        }
        category: string
        tags: string[]
        isPinned: boolean
        viewCount: number
        replyCount: number
        lastActivity: string
      }>
      total: number
      page: number
      totalPages: number
    }>(`/forum/posts?${queryParams.toString()}`)
  },
}

// User API
export const userApi = {
  getProfile: (userId: string) =>
    apiRequest<{
      id: string
      name: string
      email: string
      role: 'user' | 'pro' | 'moderator' | 'admin'
      joinDate: string
      stats: {
        postCount: number
        replyCount: number
        tradeWinRate: number | null
      }
    }>(`/users/${userId}`),
}
