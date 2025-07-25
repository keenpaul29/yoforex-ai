import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

interface UseInfiniteScrollOptions<T> {
  /**
   * The element to use as the scroll container. If not provided, window will be used.
   */
  containerRef?: RefObject<HTMLElement>;
  
  /**
   * The element to use as the sentinel (the element that triggers loading when it becomes visible).
   * If not provided, the last child of the container will be used.
   */
  sentinelRef?: RefObject<HTMLElement>;
  
  /**
   * The threshold in pixels from the bottom of the container before loading more items.
   * @default 100
   */
  threshold?: number;
  
  /**
   * The direction to load more items when scrolling.
   * @default 'down'
   */
  direction?: 'up' | 'down';
  
  /**
   * Whether the infinite scroll is enabled.
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Callback function to load more items.
   * Should return a boolean indicating whether there are more items to load.
   */
  loadMore: () => Promise<boolean> | boolean;
  
  /**
   * Callback function when loading starts.
   */
  onLoadStart?: () => void;
  
  /**
   * Callback function when loading completes.
   * @param hasMore Whether there are more items to load.
   */
  onLoadComplete?: (hasMore: boolean) => void;
  
  /**
   * Callback function when an error occurs during loading.
   * @param error The error that occurred.
   */
  onError?: (error: Error) => void;
  
  /**
   * The root margin for the IntersectionObserver.
   * @default '0px 0px 100px 0px'
   */
  rootMargin?: string;
}

/**
 * Custom hook for implementing infinite scroll functionality.
 * @param options Configuration options for the infinite scroll.
 * @returns An object containing loading state and error information.
 */
export function useInfiniteScroll<T>({
  containerRef,
  sentinelRef,
  threshold = 100,
  direction = 'down',
  enabled = true,
  loadMore,
  onLoadStart,
  onLoadComplete,
  onError,
  rootMargin = '0px 0px 100px 0px',
}: UseInfiniteScrollOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelNodeRef = useRef<Element | null>(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  
  // Update refs when state changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Handle loading more items
  const handleLoadMore = useCallback(async () => {
    if (!enabled || isLoadingRef.current || !hasMoreRef.current) return;
    
    try {
      setIsLoading(true);
      onLoadStart?.();
      
      const result = await loadMore();
      
      if (typeof result === 'boolean') {
        setHasMore(result);
        onLoadComplete?.(result);
      } else if (result !== undefined) {
        console.warn('loadMore should return a boolean or undefined');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load more items');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, loadMore, onError, onLoadComplete, onLoadStart]);

  // Set up intersection observer
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || !hasMore) return;
    
    // Get the container element (default to document)
    const container = containerRef?.current || document;
    
    // Get or create the sentinel element
    let sentinel: Element;
    
    if (sentinelRef?.current) {
      sentinel = sentinelRef.current;
    } else {
      // Create a sentinel element if not provided
      sentinel = document.createElement('div');
      sentinel.style.height = '1px';
      sentinel.style.width = '100%';
      sentinel.style.pointerEvents = 'none';
      
      // Add the sentinel to the container
      if (container === document) {
        document.body.appendChild(sentinel);
      } else {
        (container as HTMLElement).appendChild(sentinel);
      }
      
      sentinelNodeRef.current = sentinel;
    }
    
    // Create intersection observer callback
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && !isLoadingRef.current && hasMoreRef.current) {
        handleLoadMore();
      }
    };
    
    // Set up the intersection observer
    const observerOptions: IntersectionObserverInit = {
      root: container === document ? null : container,
      rootMargin,
      threshold: 0,
    };
    
    observerRef.current = new IntersectionObserver(handleIntersect, observerOptions);
    observerRef.current.observe(sentinel);
    
    // Initial load
    if (direction === 'down') {
      handleLoadMore();
    }
    
    // Clean up
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      // Remove the sentinel element if we created it
      if (sentinelNodeRef.current && sentinelNodeRef.current.parentNode) {
        sentinelNodeRef.current.parentNode.removeChild(sentinelNodeRef.current);
        sentinelNodeRef.current = null;
      }
    };
  }, [
    containerRef,
    sentinelRef,
    threshold,
    direction,
    enabled,
    hasMore,
    handleLoadMore,
    rootMargin,
  ]);
  
  // Reset the infinite scroll state
  const reset = useCallback(() => {
    setIsLoading(false);
    setHasMore(true);
    setError(null);
    isLoadingRef.current = false;
    hasMoreRef.current = true;
  }, []);

  return {
    isLoading,
    hasMore,
    error,
    reset,
  };
}

/**
 * Custom hook for implementing a scroll position restoration.
 * @param enabled Whether the scroll position restoration is enabled.
 * @param key A unique key to identify the scroll position.
 */
export function useScrollRestoration(enabled: boolean = true, key?: string) {
  const scrollPositionRef = useRef(0);
  
  // Save scroll position before unmount
  useEffect(() => {
    if (!enabled || !key) return;
    
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-${key}`, window.scrollY.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, key]);
  
  // Restore scroll position after mount
  useEffect(() => {
    if (!enabled || !key || typeof window === 'undefined') return;
    
    const savedPosition = sessionStorage.getItem(`scroll-${key}`);
    
    if (savedPosition) {
      const scrollTo = parseInt(savedPosition, 10);
      
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollTo);
        sessionStorage.removeItem(`scroll-${key}`);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [enabled, key]);
  
  // Update scroll position on scroll
  useEffect(() => {
    if (!enabled) return;
    
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);
  
  // Programmatically scroll to a position
  const scrollTo = useCallback((position: number, behavior: ScrollBehavior = 'auto') => {
    if (typeof window === 'undefined') return;
    
    window.scrollTo({
      top: position,
      behavior,
    });
  }, []);
  
  return {
    scrollPosition: scrollPositionRef.current,
    scrollTo,
  };
}
