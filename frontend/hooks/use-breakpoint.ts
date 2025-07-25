import { useState, useEffect, useMemo } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type BreakpointConfig = {
  [key in Breakpoint]: number;
};

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,      // 0px - 639px
  sm: 640,    // 640px - 767px
  md: 768,    // 768px - 1023px
  lg: 1024,   // 1024px - 1279px
  xl: 1280,   // 1280px - 1535px
  '2xl': 1536 // 1536px and up
};

/**
 * Custom hook to detect the current breakpoint based on window size
 * @param breakpoints Custom breakpoint configuration (optional)
 * @returns The current breakpoint
 */
export function useBreakpoint(
  breakpoints: Partial<BreakpointConfig> = {}
): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');
  
  // Merge custom breakpoints with defaults
  const mergedBreakpoints = useMemo(() => ({
    ...defaultBreakpoints,
    ...breakpoints
  }), [breakpoints]);
  
  // Sort breakpoints from largest to smallest
  const sortedBreakpoints = useMemo(() => {
    return Object.entries(mergedBreakpoints)
      .sort(([, valueA], [, valueB]) => valueB - valueA)
      .map(([key]) => key as Breakpoint);
  }, [mergedBreakpoints]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Find the first breakpoint where the width is greater than or equal to the breakpoint value
      const currentBreakpoint = sortedBreakpoints.find(
        (bp) => width >= mergedBreakpoints[bp]
      ) || 'xs';
      
      setBreakpoint(currentBreakpoint);
    };
    
    // Initial call
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mergedBreakpoints, sortedBreakpoints]);
  
  return breakpoint;
}

/**
 * Custom hook to check if the current viewport matches a specific breakpoint or range
 * @param query The breakpoint query (e.g., 'sm', 'md', 'sm-md', 'md+', 'sm-2xl')
 * @param breakpoints Custom breakpoint configuration (optional)
 * @returns Boolean indicating if the current viewport matches the query
 */
export function useMatchBreakpoint(
  query: string,
  breakpoints: Partial<BreakpointConfig> = {}
): boolean {
  const currentBreakpoint = useBreakpoint(breakpoints);
  const mergedBreakpoints = useMemo(() => ({
    ...defaultBreakpoints,
    ...breakpoints
  }), [breakpoints]);
  
  const breakpointValues = useMemo(() => {
    return Object.entries(mergedBreakpoints)
      .sort(([, a], [, b]) => a - b)
      .map(([key]) => key as Breakpoint);
  }, [mergedBreakpoints]);
  
  return useMemo(() => {
    // Handle exact match (e.g., 'md')
    if (breakpointValues.includes(query as Breakpoint)) {
      return currentBreakpoint === query;
    }
    
    // Handle range (e.g., 'sm-md')
    if (query.includes('-')) {
      const [start, end] = query.split('-') as [Breakpoint, Breakpoint];
      const startIndex = breakpointValues.indexOf(start);
      const endIndex = breakpointValues.indexOf(end);
      const currentIndex = breakpointValues.indexOf(currentBreakpoint);
      
      if (startIndex === -1 || endIndex === -1) {
        console.warn(`Invalid breakpoint range: ${query}`);
        return false;
      }
      
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);
      
      return currentIndex >= minIndex && currentIndex <= maxIndex;
    }
    
    // Handle minimum (e.g., 'md+')
    if (query.endsWith('+')) {
      const bp = query.slice(0, -1) as Breakpoint;
      const bpIndex = breakpointValues.indexOf(bp);
      const currentIndex = breakpointValues.indexOf(currentBreakpoint);
      
      if (bpIndex === -1) {
        console.warn(`Invalid breakpoint: ${bp}`);
        return false;
      }
      
      return currentIndex >= bpIndex;
    }
    
    // Handle maximum (e.g., '-md')
    if (query.startsWith('-')) {
      const bp = query.slice(1) as Breakpoint;
      const bpIndex = breakpointValues.indexOf(bp);
      const currentIndex = breakpointValues.indexOf(currentBreakpoint);
      
      if (bpIndex === -1) {
        console.warn(`Invalid breakpoint: ${bp}`);
        return false;
      }
      
      return currentIndex <= bpIndex;
    }
    
    console.warn(`Invalid breakpoint query: ${query}`);
    return false;
  }, [currentBreakpoint, query, breakpointValues]);
}

/**
 * Custom hook to get the current breakpoint and whether it matches a specific query
 * @param query The breakpoint query (optional)
 * @param breakpoints Custom breakpoint configuration (optional)
 * @returns An object with the current breakpoint and a function to check if it matches the query
 */
export function useResponsive(
  query?: string,
  breakpoints: Partial<BreakpointConfig> = {}
) {
  const currentBreakpoint = useBreakpoint(breakpoints);
  const matches = useMatchBreakpoint(query || currentBreakpoint, breakpoints);
  
  return {
    breakpoint: currentBreakpoint,
    matches,
    isMobile: currentBreakpoint === 'xs' || currentBreakpoint === 'sm',
    isTablet: currentBreakpoint === 'md',
    isDesktop: currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl',
    isLargeScreen: currentBreakpoint === 'xl' || currentBreakpoint === '2xl',
    isExtraLargeScreen: currentBreakpoint === '2xl',
  };
}

// Example usage:
/*
// Basic usage
const breakpoint = useBreakpoint();

// Check if current breakpoint is 'md'
const isMedium = useMatchBreakpoint('md');

// Check if current breakpoint is between 'sm' and 'lg'
const isBetweenSmAndLg = useMatchBreakpoint('sm-lg');

// Check if current breakpoint is 'md' or larger
const isMdOrLarger = useMatchBreakpoint('md+');

// Check if current breakpoint is 'lg' or smaller
const isLgOrSmaller = useMatchBreakpoint('-lg');

// Using the responsive hook
const { breakpoint, isMobile, isTablet, isDesktop } = useResponsive();
*/
