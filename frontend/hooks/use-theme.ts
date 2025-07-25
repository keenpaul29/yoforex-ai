import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocalStorage } from './use-local-storage'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

interface UseThemeOptions {
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const MEDIA_QUERY = '(prefers-color-scheme: dark)'
const STORAGE_KEY = 'theme'

export function useTheme({
  defaultTheme = 'system',
  storageKey = STORAGE_KEY,
  enableSystem = true,
  disableTransitionOnChange = false,
}: UseThemeOptions = {}) {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(
    storageKey,
    defaultTheme
  )

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
  })

  const [mounted, setMounted] = useState(false)

  // Resolve the actual theme to apply
  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (storedTheme === 'system') {
      return enableSystem ? systemTheme : 'light'
    }
    return storedTheme as ResolvedTheme
  }, [storedTheme, systemTheme, enableSystem])

  // Create theme state object
  const themeState = useMemo((): ThemeState => ({
    theme: storedTheme,
    resolvedTheme,
    systemTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: storedTheme === 'system',
  }), [storedTheme, resolvedTheme, systemTheme])

  // Apply theme to document
  const applyTheme = useCallback(
    (theme: ResolvedTheme, disableTransition = disableTransitionOnChange) => {
      if (typeof window === 'undefined') return

      const root = window.document.documentElement
      
      // Disable transitions temporarily to prevent flash
      if (disableTransition) {
        const css = document.createElement('style')
        css.appendChild(
          document.createTextNode(
            '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
          )
        )
        document.head.appendChild(css)

        // Force reflow
        window.getComputedStyle(document.body)

        // Re-enable transitions
        setTimeout(() => {
          document.head.removeChild(css)
        }, 1)
      }

      // Remove existing theme classes
      root.classList.remove('light', 'dark')
      
      // Add new theme class
      root.classList.add(theme)
      
      // Set data attribute for CSS selectors
      root.setAttribute('data-theme', theme)
      
      // Set color-scheme for better browser integration
      root.style.colorScheme = theme
    },
    [disableTransitionOnChange]
  )

  // Set theme function
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setStoredTheme(newTheme)
      
      const resolvedNewTheme = newTheme === 'system' 
        ? (enableSystem ? systemTheme : 'light')
        : newTheme as ResolvedTheme
      
      applyTheme(resolvedNewTheme)
    },
    [setStoredTheme, systemTheme, enableSystem, applyTheme]
  )

  // Toggle between light and dark (ignores system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // Cycle through all themes
  const cycleTheme = useCallback(() => {
    const themes: Theme[] = enableSystem ? ['light', 'dark', 'system'] : ['light', 'dark']
    const currentIndex = themes.indexOf(storedTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }, [storedTheme, enableSystem, setTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableSystem])

  // Apply theme when resolved theme changes
  useEffect(() => {
    if (mounted) {
      applyTheme(resolvedTheme)
    }
  }, [resolvedTheme, applyTheme, mounted])

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    applyTheme(resolvedTheme, true)
  }, [resolvedTheme, applyTheme])

  // Prevent hydration mismatch by not returning theme state until mounted
  if (!mounted) {
    return {
      theme: defaultTheme,
      resolvedTheme: 'light' as ResolvedTheme,
      systemTheme: 'light' as ResolvedTheme,
      isDark: false,
      isLight: true,
      isSystem: defaultTheme === 'system',
      setTheme: () => {},
      toggleTheme: () => {},
      cycleTheme: () => {},
    }
  }

  return {
    ...themeState,
    setTheme,
    toggleTheme,
    cycleTheme,
  }
}

// Hook for theme-aware CSS classes
export function useThemeClasses() {
  const { isDark, isLight, resolvedTheme } = useTheme()

  return useMemo(() => ({
    isDark,
    isLight,
    theme: resolvedTheme,
    // Utility classes
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    card: isDark ? 'bg-gray-800' : 'bg-white',
    input: isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
    button: {
      primary: isDark 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: isDark
        ? 'bg-gray-700 hover:bg-gray-600 text-white'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    },
  }), [isDark, isLight, resolvedTheme])
}

// Hook for theme-aware media queries
export function useThemeMediaQuery() {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return matches
}

// Hook for theme persistence across page reloads
export function useThemePersistence() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newTheme = JSON.parse(e.newValue) as Theme
          setTheme(newTheme)
        } catch (error) {
          console.error('Failed to parse theme from storage:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [setTheme])

  return theme
}
