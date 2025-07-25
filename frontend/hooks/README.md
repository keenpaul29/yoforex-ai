# Optimized React Hooks

This directory contains a comprehensive collection of clean, optimized, and reusable React hooks for the YoForex AI frontend application.

## 🚀 Features

- **Type-safe**: Full TypeScript support with proper type definitions
- **Performance optimized**: Uses memoization, proper dependency arrays, and cleanup
- **Error handling**: Robust error handling with proper error boundaries
- **Reusable**: Generic and flexible hooks that can be used across components
- **Well-documented**: Clear interfaces and usage examples

## 📚 Available Hooks

### API Hooks (`use-api.ts`)

Comprehensive hooks for making HTTP requests with built-in error handling, retries, and cancellation.

```tsx
import { useGet, usePost, usePut, useDelete } from '@/hooks'

// GET request
const { data, isLoading, error, get } = useGet()
await get('/api/users')

// POST request
const { post } = usePost({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
})
await post('/api/users', { name: 'John', email: 'john@example.com' })
```

### Authentication Hook (`use-auth.ts`)

Complete authentication management with token handling, auto-refresh, and session management.

```tsx
import { useAuth } from '@/hooks'

const { 
  user, 
  isLoading, 
  isAuthenticated, 
  login, 
  logout, 
  register 
} = useAuth()

// Login
await login({ email: 'user@example.com', password: 'password' })

// Register
await register({ name: 'John', email: 'john@example.com', password: 'password' })
```

### Debounce Hooks (`use-debounce.ts`)

Various debouncing utilities for performance optimization.

```tsx
import { useDebounce, useDebouncedCallback, useDebouncedSearch } from '@/hooks'

// Debounce a value
const debouncedValue = useDebounce(searchTerm, 300)

// Debounce a callback
const [debouncedCallback, cancel] = useDebouncedCallback(
  (value) => console.log(value),
  500
)

// Debounced search with loading states
const { query, setQuery, results, isLoading } = useDebouncedSearch(
  async (query) => {
    const response = await fetch(`/api/search?q=${query}`)
    return response.json()
  }
)
```

### Form Hook (`use-form.ts`)

Powerful form management with validation, error handling, and field utilities.

```tsx
import { useForm } from '@/hooks'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const {
  values,
  errors,
  isValid,
  setValue,
  handleSubmit,
  getFieldProps
} = useForm({
  initialValues: { email: '', password: '' },
  validationSchema: schema,
  onSubmit: async (values) => {
    await login(values)
  }
})

// Use with input
<input {...getFieldProps('email')} />
```

### Local Storage Hook (`use-local-storage.ts`)

Type-safe local storage with serialization and cross-tab synchronization.

```tsx
import { useLocalStorage, useLocalStorageObject } from '@/hooks'

// Basic usage
const [value, setValue, removeValue] = useLocalStorage('key', 'defaultValue')

// Object storage
const [settings, setSettings] = useLocalStorageObject('settings', {
  theme: 'light',
  language: 'en'
})
```

### Market Data Hook (`use-market-data.ts`)

Optimized market data fetching with WebSocket real-time updates and error handling.

```tsx
import { useMarketData } from '@/hooks'

const {
  data,
  isLoading,
  error,
  isConnected,
  refetch,
  reconnect
} = useMarketData({
  symbol: 'EURUSD',
  timeframe: '1h',
  limit: 100,
  enableRealTime: true
})
```

### Pagination Hooks (`use-pagination.ts`)

Complete pagination solutions including traditional, infinite scroll, and cursor-based pagination.

```tsx
import { usePagination, useInfinitePagination } from '@/hooks'

// Traditional pagination
const {
  currentPage,
  totalPages,
  hasNextPage,
  nextPage,
  previousPage,
  goToPage
} = usePagination({
  totalItems: 1000,
  initialPageSize: 20
})

// Infinite scroll
const {
  data,
  isLoading,
  hasMore,
  loadMore
} = useInfinitePagination({
  fetchMore: async (page, pageSize) => {
    const response = await fetch(`/api/items?page=${page}&size=${pageSize}`)
    return response.json()
  }
})
```

### Theme Hooks (`use-theme.ts`)

Comprehensive theme management with system preference detection and persistence.

```tsx
import { useTheme, useThemeClasses } from '@/hooks'

// Theme management
const {
  theme,
  resolvedTheme,
  isDark,
  setTheme,
  toggleTheme
} = useTheme()

// Theme-aware CSS classes
const { bg, text, button } = useThemeClasses()
```

### WebSocket Hooks (`use-websocket.ts`)

Robust WebSocket management with auto-reconnection and message queuing.

```tsx
import { useWebSocket, useWebSocketJson } from '@/hooks'

// Basic WebSocket
const {
  lastMessage,
  isConnected,
  sendMessage,
  reconnect
} = useWebSocket('wss://api.example.com/ws')

// JSON WebSocket
const {
  lastJsonMessage,
  sendJsonMessage
} = useWebSocketJson('wss://api.example.com/ws', {
  onJsonMessage: (data) => console.log('Received:', data)
})
```

## 🛠 Usage Guidelines

### 1. Import from Index
Always import hooks from the main index file:

```tsx
import { useAuth, useDebounce, useApi } from '@/hooks'
```

### 2. Error Handling
Most hooks include built-in error handling, but always handle errors appropriately:

```tsx
const { data, error } = useApi()

if (error) {
  return <ErrorComponent error={error} />
}
```

### 3. Loading States
Use loading states for better UX:

```tsx
const { isLoading } = useAuth()

if (isLoading) {
  return <LoadingSpinner />
}
```

### 4. Cleanup
Hooks automatically handle cleanup, but be mindful of dependencies:

```tsx
useEffect(() => {
  // Effect code
}, [dependency]) // Proper dependency array
```

## 🔧 Customization

All hooks are designed to be flexible and customizable. Most accept options objects for configuration:

```tsx
const api = useApi({
  onSuccess: (data) => toast.success('Success!'),
  onError: (error) => toast.error(error.message),
  retries: 3,
  retryDelay: 1000
})
```

## 📝 Best Practices

1. **Use TypeScript**: All hooks are fully typed
2. **Handle errors**: Always handle error states
3. **Optimize re-renders**: Use proper memoization
4. **Clean up**: Hooks handle cleanup automatically
5. **Test thoroughly**: Write tests for hook usage

## 🚀 Performance Tips

1. Use debounced hooks for search and input handling
2. Implement proper pagination for large datasets
3. Use memoization where appropriate
4. Handle loading states to improve perceived performance
5. Implement proper error boundaries

## 📖 Migration Guide

If migrating from the old hook implementations:

1. Update imports to use the new hooks
2. Check for API changes in hook interfaces
3. Update error handling patterns
4. Test thoroughly in your components

## 🤝 Contributing

When adding new hooks:

1. Follow the established patterns
2. Include proper TypeScript types
3. Add comprehensive error handling
4. Write clear documentation
5. Include usage examples
6. Add to the main index file
