import { useEffect, useState, useCallback } from 'react';

type ColorScheme = 'light' | 'dark' | 'no-preference';

/**
 * Custom hook to detect the user's preferred color scheme (light/dark mode)
 * @returns The current color scheme preference
 */
export function useColorScheme(): ColorScheme {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('no-preference');

  const getColorScheme = useCallback((): ColorScheme => {
    // Check for browser support
    if (!window.matchMedia) return 'no-preference';
    
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (isDark) return 'dark';
    if (isLight) return 'light';
    return 'no-preference';
  }, []);

  useEffect(() => {
    // Set initial value
    setColorScheme(getColorScheme());

    // Listen for changes
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');

    const handleChange = () => {
      setColorScheme(getColorScheme());
    };

    // Modern browsers
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener('change', handleChange);
      lightQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      darkQuery.addListener(handleChange);
      lightQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (darkQuery.removeEventListener) {
        darkQuery.removeEventListener('change', handleChange);
        lightQuery.removeEventListener('change', handleChange);
      } else {
        darkQuery.removeListener(handleChange);
        lightQuery.removeListener(handleChange);
      }
    };
  }, [getColorScheme]);

  return colorScheme;
}

/**
 * Custom hook to apply a class to the document element based on the color scheme
 * @param className The class to apply when in dark mode
 * @param options Configuration options
 */
export function useColorSchemeClass(
  darkClassName: string = 'dark',
  lightClassName: string = 'light',
  options: { disableTransitions?: boolean } = {}
) {
  const { disableTransitions = false } = options;
  const colorScheme = useColorScheme();

  useEffect(() => {
    const classList = document.documentElement.classList;
    
    // Disable transitions while changing classes to prevent flash
    if (disableTransitions) {
      document.documentElement.style.transition = 'none';
    }

    // Remove all color scheme classes
    classList.remove(darkClassName, lightClassName);
    
    // Add the appropriate class
    if (colorScheme === 'dark') {
      classList.add(darkClassName);
    } else if (colorScheme === 'light') {
      classList.add(lightClassName);
    }

    // Re-enable transitions
    if (disableTransitions) {
      // Force reflow to ensure the transition is applied
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.documentElement.offsetHeight;
      
      // Remove the inline style to re-enable transitions
      document.documentElement.style.transition = '';
    }
  }, [colorScheme, darkClassName, lightClassName, disableTransitions]);

  return colorScheme;
}

/**
 * Custom hook to get the current theme (light/dark) with manual override support
 * @param overrideTheme Optional manual theme override
 * @returns The current theme
 */
export function useTheme(overrideTheme?: 'light' | 'dark' | 'system') {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    overrideTheme === 'system' 
      ? systemTheme === 'dark' ? 'dark' : 'light'
      : overrideTheme || (systemTheme === 'dark' ? 'dark' : 'light')
  );

  // Update theme when override or system theme changes
  useEffect(() => {
    if (overrideTheme === 'system') {
      setTheme(systemTheme === 'dark' ? 'dark' : 'light');
    } else if (overrideTheme === 'light' || overrideTheme === 'dark') {
      setTheme(overrideTheme);
    }
  }, [overrideTheme, systemTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    setTheme,
    systemTheme: systemTheme === 'dark' ? 'dark' as const : 'light' as const,
  };
}

/**
 * Custom hook to persist theme preference in localStorage
 * @param key The localStorage key to use (default: 'theme')
 * @returns An object with theme information and setter function
 */
export function useThemeWithPersistence(key: string = 'theme') {
  const [storedTheme, setStoredTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'system';
    
    try {
      const item = window.localStorage.getItem(key);
      return item === 'light' || item === 'dark' || item === 'system' 
        ? item 
        : 'system';
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
      return 'system';
    }
  });

  const { theme, isDark, isLight, setTheme: setThemeState } = useTheme(storedTheme);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    try {
      setStoredTheme(theme);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, theme);
      }
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }, [key]);

  // Apply theme class to document element
  useColorSchemeClass('dark', 'light', { disableTransitions: false });

  return {
    theme,
    isDark,
    isLight,
    setTheme,
    systemTheme: storedTheme === 'system' ? (theme as 'light' | 'dark') : null,
  };
}
