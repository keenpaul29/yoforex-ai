import { useState, useEffect, useCallback, useRef } from 'react';

type VisibilityState = 'visible' | 'hidden' | 'prerender' | undefined;

interface TabState {
  /**
   * Whether the current tab is active
   */
  isActive: boolean;
  
  /**
   * The current visibility state of the document
   */
  visibilityState: VisibilityState;
  
  /**
   * The time when the tab was last activated
   */
  lastActiveTime: number | null;
  
  /**
   * The time when the tab was last inactive
   */
  lastInactiveTime: number | null;
  
  /**
   * The number of times the tab has been activated
   */
  activationCount: number;
}

interface UseTabStateOptions {
  /**
   * Whether to listen for visibility changes
   * @default true
   */
  listenVisibility?: boolean;
  
  /**
   * Whether to listen for focus/blur events
   * @default true
   */
  listenFocus?: boolean;
  
  /**
   * Whether to persist the tab state in localStorage
   * @default false
   */
  persistState?: boolean;
  
  /**
   * The key to use for localStorage persistence
   * @default 'tab-state'
   */
  storageKey?: string;
  
  /**
   * Callback when the tab becomes active
   */
  onActivate?: (state: TabState) => void;
  
  /**
   * Callback when the tab becomes inactive
   */
  onDeactivate?: (state: TabState) => void;
  
  /**
   * Callback when the tab state changes
   */
  onChange?: (state: TabState) => void;
}

/**
 * Custom hook to track the state of the current browser tab/window
 * @param options Configuration options
 * @returns The current tab state
 */
export function useTabState(options: UseTabStateOptions = {}): TabState {
  const {
    listenVisibility = true,
    listenFocus = true,
    persistState = false,
    storageKey = 'tab-state',
    onActivate,
    onDeactivate,
    onChange,
  } = options;
  
  const [state, setState] = useState<TabState>(() => ({
    isActive: typeof document !== 'undefined' 
      ? !document.hidden 
      : true,
    visibilityState: typeof document !== 'undefined'
      ? document.visibilityState as VisibilityState
      : 'visible',
    lastActiveTime: null,
    lastInactiveTime: null,
    activationCount: 0,
  }));
  
  const stateRef = useRef(state);
  
  // Update the ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    const isActive = !document.hidden;
    const visibilityState = document.visibilityState as VisibilityState;
    const now = Date.now();
    
    setState(prevState => {
      const newState: TabState = {
        ...prevState,
        isActive,
        visibilityState,
        lastActiveTime: isActive ? now : prevState.lastActiveTime,
        lastInactiveTime: !isActive ? now : prevState.lastInactiveTime,
        activationCount: isActive && !prevState.isActive 
          ? prevState.activationCount + 1 
          : prevState.activationCount,
      };
      
      return newState;
    });
  }, []);
  
  // Handle focus/blur events
  const handleFocus = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    
    setState(prevState => {
      if (prevState.isActive) return prevState;
      
      const newState: TabState = {
        ...prevState,
        isActive: true,
        lastActiveTime: now,
        activationCount: prevState.activationCount + 1,
      };
      
      return newState;
    });
  }, []);
  
  const handleBlur = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    
    setState(prevState => {
      if (!prevState.isActive) return prevState;
      
      return {
        ...prevState,
        isActive: false,
        lastInactiveTime: now,
      };
    });
  }, []);
  
  // Handle storage events (for cross-tab communication)
  const handleStorage = useCallback((event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return;
    
    try {
      const data = JSON.parse(event.newValue);
      
      if (data.type === 'TAB_STATE_UPDATE') {
        setState(prevState => ({
          ...prevState,
          ...data.payload,
        }));
      }
    } catch (error) {
      console.error('Error parsing tab state from storage:', error);
    }
  }, [storageKey]);
  
  // Persist state to localStorage if enabled
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        type: 'TAB_STATE_UPDATE',
        payload: state,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error persisting tab state:', error);
    }
  }, [state, persistState, storageKey]);
  
  // Set up event listeners
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    if (listenVisibility) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    if (listenFocus) {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
    }
    
    if (persistState) {
      window.addEventListener('storage', handleStorage);
    }
    
    // Initial state
    handleVisibilityChange();
    
    return () => {
      if (listenVisibility) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      
      if (listenFocus) {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
      }
      
      if (persistState) {
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, [
    listenVisibility, 
    listenFocus, 
    persistState, 
    handleVisibilityChange, 
    handleFocus, 
    handleBlur, 
    handleStorage
  ]);
  
  // Call callbacks when state changes
  useEffect(() => {
    if (!stateRef.current) return;
    
    onChange?.(state);
    
    if (state.isActive && !stateRef.current.isActive) {
      onActivate?.(state);
    } else if (!state.isActive && stateRef.current.isActive) {
      onDeactivate?.(state);
    }
  }, [state, onActivate, onDeactivate, onChange]);
  
  return state;
}

/**
 * Hook to detect if the current tab is active
 * @returns Whether the current tab is active
 */
export function useTabActive(): boolean {
  const { isActive } = useTabState();
  return isActive;
}

/**
 * Hook to detect if the current tab is visible
 * @returns Whether the current tab is visible
 */
export function useTabVisible(): boolean {
  const { visibilityState } = useTabState();
  return visibilityState === 'visible';
}

/**
 * Hook to detect if the current tab is in the background
 * @returns Whether the current tab is in the background
 */
export function useTabBackgrounded(): boolean {
  const { isActive, visibilityState } = useTabState();
  return !isActive || visibilityState !== 'visible';
}

/**
 * Hook to detect if the current tab is focused
 * @returns Whether the current tab is focused
 */
export function useTabFocused(): boolean {
  const { isActive } = useTabState({ listenFocus: true, listenVisibility: false });
  return isActive;
}
