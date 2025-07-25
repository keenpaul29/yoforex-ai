import { useState, useEffect, useCallback, useRef } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

interface UseLocalStorageOptions<T> {
  serializer?: {
    parse: (value: string) => T
    stringify: (value: T) => string
  }
  syncAcrossTabs?: boolean
  onError?: (error: Error) => void
}

const defaultSerializer = {
  parse: JSON.parse,
  stringify: JSON.stringify,
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: SetValue<T>) => void, () => void] {
  const {
    serializer = defaultSerializer,
    syncAcrossTabs = true,
    onError,
  } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? serializer.parse(item) : initialValue
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to parse localStorage value')
      if (onError) {
        onError(err)
      } else {
        console.error(`Error reading localStorage key "${key}":`, err)
      }
      return initialValue
    }
  })

  const setValueRef = useRef<(value: SetValue<T>) => void>()

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer.stringify(valueToStore))
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to set localStorage value')
        if (onError) {
          onError(err)
        } else {
          console.error(`Error setting localStorage key "${key}":`, err)
        }
      }
    },
    [key, serializer, storedValue, onError]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove localStorage value')
      if (onError) {
        onError(err)
      } else {
        console.error(`Error removing localStorage key "${key}":`, err)
      }
    }
  }, [key, initialValue, onError])

  setValueRef.current = setValue

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== localStorage) {
        return
      }

      try {
        if (e.newValue === null) {
          setStoredValue(initialValue)
        } else {
          setStoredValue(serializer.parse(e.newValue))
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to sync localStorage value')
        if (onError) {
          onError(err)
        } else {
          console.error(`Error syncing localStorage key "${key}":`, err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue, serializer, syncAcrossTabs, onError])

  return [storedValue, setValue, removeValue]
}

// Specialized hooks for common data types
export function useLocalStorageString(
  key: string,
  initialValue: string = '',
  options: Omit<UseLocalStorageOptions<string>, 'serializer'> = {}
) {
  return useLocalStorage(key, initialValue, {
    ...options,
    serializer: {
      parse: (value: string) => value,
      stringify: (value: string) => value,
    },
  })
}

export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0,
  options: Omit<UseLocalStorageOptions<number>, 'serializer'> = {}
) {
  return useLocalStorage(key, initialValue, {
    ...options,
    serializer: {
      parse: (value: string) => {
        const parsed = parseFloat(value)
        if (isNaN(parsed)) {
          throw new Error('Invalid number format')
        }
        return parsed
      },
      stringify: (value: number) => value.toString(),
    },
  })
}

export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false,
  options: Omit<UseLocalStorageOptions<boolean>, 'serializer'> = {}
) {
  return useLocalStorage(key, initialValue, {
    ...options,
    serializer: {
      parse: (value: string) => {
        if (value === 'true') return true
        if (value === 'false') return false
        throw new Error('Invalid boolean format')
      },
      stringify: (value: boolean) => value.toString(),
    },
  })
}

export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = [],
  options: Omit<UseLocalStorageOptions<T[]>, 'serializer'> = {}
) {
  return useLocalStorage(key, initialValue, {
    ...options,
    serializer: {
      parse: (value: string) => {
        const parsed = JSON.parse(value)
        if (!Array.isArray(parsed)) {
          throw new Error('Value is not an array')
        }
        return parsed
      },
      stringify: (value: T[]) => JSON.stringify(value),
    },
  })
}

// Hook for managing multiple localStorage keys as a single object
export function useLocalStorageObject<T extends Record<string, any>>(
  keyPrefix: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const [value, setValue, removeValue] = useLocalStorage(keyPrefix, initialValue, options)

  const setProperty = useCallback(
    <K extends keyof T>(property: K, propertyValue: SetValue<T[K]>) => {
      setValue(prev => ({
        ...prev,
        [property]: propertyValue instanceof Function ? propertyValue(prev[property]) : propertyValue,
      }))
    },
    [setValue]
  )

  const removeProperty = useCallback(
    <K extends keyof T>(property: K) => {
      setValue(prev => {
        const newValue = { ...prev }
        delete newValue[property]
        return newValue
      })
    },
    [setValue]
  )

  return {
    value,
    setValue,
    removeValue,
    setProperty,
    removeProperty,
  }
}
