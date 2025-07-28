'use client';

import * as React from 'react';
import { 
  ThemeProvider as NextThemesProvider, 
  useTheme as useNextTheme,
  type ThemeProviderProps 
} from 'next-themes';

// Force light theme for better visibility
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      <ForceLightTheme />
      {children}
    </NextThemesProvider>
  )
}

// Force light theme on mount
function ForceLightTheme() {
  const { setTheme } = useNextTheme()
  
  React.useEffect(() => {
    setTheme('light')
    // Ensure light theme is applied to document element
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [setTheme])
  
  return null
}
