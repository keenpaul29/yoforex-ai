"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  useAuth, 
  useDebounce, 
  useDebouncedSearch,
  useLocalStorage,
  usePagination,
  useTheme,
  useMarketData,
  useForm
} from '@/hooks'
import { z } from 'zod'

// Example 1: Authentication
function AuthExample() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()

  const handleLogin = async () => {
    try {
      await login({ 
        email: 'demo@example.com', 
        password: 'password123' 
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Example</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <div>
            <p>Welcome, {user?.name}!</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </CardContent>
    </Card>
  )
}

// Example 2: Debounced Search
function SearchExample() {
  const mockSearchFunction = async (query: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`
    ]
  }

  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    error 
  } = useDebouncedSearch(mockSearchFunction, 300)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debounced Search Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="mb-4"
        />
        
        {isLoading && <p>Searching...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        
        <ul>
          {results.map((result, index) => (
            <li key={index} className="py-1">{result}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Example 3: Local Storage
function LocalStorageExample() {
  const [count, setCount] = useLocalStorage('example-count', 0)
  const [settings, setSettings] = useLocalStorage('example-settings', {
    theme: 'light',
    notifications: true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Storage Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>Count: {count}</p>
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
          </div>
          
          <div>
            <p>Theme: {settings.theme}</p>
            <Button 
              onClick={() => setSettings({
                ...settings,
                theme: settings.theme === 'light' ? 'dark' : 'light'
              })}
            >
              Toggle Theme
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 4: Pagination
function PaginationExample() {
  const mockData = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)
  
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    getPageItems
  } = usePagination({
    totalItems: mockData.length,
    initialPageSize: 10
  })

  const currentItems = getPageItems(mockData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagination Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul>
            {currentItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <div className="flex justify-between items-center">
            <Button 
              onClick={previousPage} 
              disabled={!hasPreviousPage}
            >
              Previous
            </Button>
            
            <span>Page {currentPage} of {totalPages}</span>
            
            <Button 
              onClick={nextPage} 
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 5: Theme
function ThemeExample() {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Current theme: {theme}</p>
          <p>Resolved theme: {resolvedTheme}</p>
          <p>Is dark: {isDark ? 'Yes' : 'No'}</p>
          
          <div className="space-x-2">
            <Button onClick={() => setTheme('light')}>Light</Button>
            <Button onClick={() => setTheme('dark')}>Dark</Button>
            <Button onClick={() => setTheme('system')}>System</Button>
            <Button onClick={toggleTheme}>Toggle</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 6: Form
function FormExample() {
  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters')
  })

  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    handleSubmit,
    getFieldProps
  } = useForm({
    initialValues: { email: '', password: '', name: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', values)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Example</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              {...getFieldProps('name')}
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Input
              {...getFieldProps('email')}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Input
              {...getFieldProps('password')}
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Example 7: Market Data
function MarketDataExample() {
  const {
    data,
    isLoading,
    error,
    isConnected,
    lastUpdate,
    refetch
  } = useMarketData({
    symbol: 'EURUSD',
    timeframe: '1h',
    limit: 10,
    enableRealTime: true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
            <Button onClick={refetch}>Refresh</Button>
          </div>
          
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          )}
          
          {isLoading && <p>Loading market data...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          
          {data.length > 0 && (
            <div>
              <p>Latest candles ({data.length}):</p>
              <div className="text-sm">
                {data.slice(-3).map((candle, index) => (
                  <div key={index}>
                    Open: {candle.open}, Close: {candle.close}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main component showcasing all examples
export function OptimizedHooksExample() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Optimized Hooks Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AuthExample />
        <SearchExample />
        <LocalStorageExample />
        <PaginationExample />
        <ThemeExample />
        <FormExample />
        <MarketDataExample />
      </div>
    </div>
  )
}
