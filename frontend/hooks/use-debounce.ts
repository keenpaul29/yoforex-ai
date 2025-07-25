import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook that debounces a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook that debounces a callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef<T>(callback)

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback
  }, [callback, ...deps])

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [debouncedCallback, cancel]
}

/**
 * Hook that provides debounced state with immediate and debounced values
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T | ((prev: T) => T)) => void] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue)
  const debouncedValue = useDebounce(immediateValue, delay)

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setImmediateValue(value)
  }, [])

  return [immediateValue, debouncedValue, setValue]
}

/**
 * Hook for debounced search functionality
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay = 300
) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedQuery = useDebounce(query, delay)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    const performSearch = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsLoading(true)
      setError(null)

      try {
        const searchResults = await searchFunction(debouncedQuery)
        
        // Check if request was cancelled
        if (!abortController.signal.aborted) {
          setResults(searchResults)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Search failed')
          setError(error)
          setResults([])
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    performSearch()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedQuery, searchFunction])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
  }
}

/**
 * Hook for debounced input validation
 */
export function useDebouncedValidation<T>(
  value: T,
  validator: (value: T) => Promise<string | null> | string | null,
  delay = 500
) {
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const debouncedValue = useDebounce(value, delay)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (debouncedValue === undefined || debouncedValue === null || debouncedValue === '') {
      setError(null)
      setIsValidating(false)
      return
    }

    const validate = async () => {
      // Cancel previous validation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsValidating(true)

      try {
        const result = await validator(debouncedValue)
        
        if (!abortController.signal.aborted) {
          setError(result)
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          const errorMessage = err instanceof Error ? err.message : 'Validation failed'
          setError(errorMessage)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsValidating(false)
        }
      }
    }

    validate()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedValue, validator])

  return {
    error,
    isValidating,
  }
}
