import { useState, useCallback, useRef } from 'react'

interface ApiState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  retries?: number
  retryDelay?: number
}

interface RequestConfig extends RequestInit {
  timeout?: number
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const { onSuccess, onError, retries = 3, retryDelay = 1000 } = options

  const execute = useCallback(
    async (url: string, config: RequestConfig = {}): Promise<T> => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const { timeout = 10000, ...fetchConfig } = config

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        // Set up timeout
        const timeoutId = setTimeout(() => {
          abortController.abort()
        }, timeout)

        const response = await fetch(url, {
          ...fetchConfig,
          signal: abortController.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get('content-type')
        let data: T

        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else {
          data = (await response.text()) as unknown as T
        }

        setState({ data, isLoading: false, error: null })
        retryCountRef.current = 0

        if (onSuccess) {
          onSuccess(data)
        }

        return data
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't update state
          return Promise.reject(err)
        }

        const error = err instanceof Error ? err : new Error('Request failed')

        // Retry logic
        if (retryCountRef.current < retries) {
          retryCountRef.current++
          
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current))
          
          return execute(url, config)
        }

        setState({ data: null, isLoading: false, error })

        if (onError) {
          onError(error)
        }

        throw error
      }
    },
    [onSuccess, onError, retries, retryDelay]
  )

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
    retryCountRef.current = 0
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    cancel,
  }
}

// Specialized hooks for common HTTP methods
export function useGet<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options)
  
  const get = useCallback(
    (url: string, config: Omit<RequestConfig, 'method'> = {}) =>
      api.execute(url, { ...config, method: 'GET' }),
    [api.execute]
  )

  return { ...api, get }
}

export function usePost<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options)
  
  const post = useCallback(
    (url: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}) =>
      api.execute(url, {
        ...config,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      }),
    [api.execute]
  )

  return { ...api, post }
}

export function usePut<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options)
  
  const put = useCallback(
    (url: string, data?: any, config: Omit<RequestConfig, 'method' | 'body'> = {}) =>
      api.execute(url, {
        ...config,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      }),
    [api.execute]
  )

  return { ...api, put }
}

export function useDelete<T = any>(options: UseApiOptions = {}) {
  const api = useApi<T>(options)
  
  const del = useCallback(
    (url: string, config: Omit<RequestConfig, 'method'> = {}) =>
      api.execute(url, { ...config, method: 'DELETE' }),
    [api.execute]
  )

  return { ...api, delete: del }
}
