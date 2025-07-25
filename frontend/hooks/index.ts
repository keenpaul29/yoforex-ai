// API Hooks
export { useApi, useGet, usePost, usePut, useDelete } from './use-api'

// Authentication Hook
export { useAuth } from './use-auth'

// Debounce Hooks
export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedState,
  useDebouncedSearch,
  useDebouncedValidation,
} from './use-debounce'

// Form Hook
export { useForm } from './use-form'

// Local Storage Hook
export { useLocalStorage } from './use-local-storage'

// Market Data Hook
export { useMarketData } from './use-market-data'

// Pagination Hooks
export {
  usePagination,
  useInfinitePagination,
  useCursorPagination,
} from './use-pagination'

// Theme Hooks
export {
  useTheme,
  useThemeClasses,
  useThemeMediaQuery,
  useThemePersistence,
  type Theme,
  type ResolvedTheme,
} from './use-theme'

// WebSocket Hooks
export {
  useWebSocket,
  useWebSocketJson,
  WebSocketReadyState,
} from './use-websocket'
