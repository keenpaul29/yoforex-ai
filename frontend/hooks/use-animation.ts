import { useState, useEffect, useRef, useCallback } from 'react';

interface AnimationOptions {
  /**
   * Duration of the animation in milliseconds
   * @default 300
   */
  duration?: number;
  
  /**
   * Timing function for the animation
   * @default 'ease-in-out'
   */
  timingFunction?: string;
  
  /**
   * Delay before the animation starts in milliseconds
   * @default 0
   */
  delay?: number;
  
  /**
   * Whether the animation should run on mount
   * @default false
   */
  runOnMount?: boolean;
  
  /**
   * Callback when the animation starts
   */
  onStart?: () => void;
  
  /**
   * Callback when the animation completes
   */
  onComplete?: () => void;
  
  /**
   * Callback when the animation is cancelled
   */
  onCancel?: () => void;
}

interface AnimationControls {
  /**
   * Whether the animation is currently running
   */
  isRunning: boolean;
  
  /**
   * Whether the animation is paused
   */
  isPaused: boolean;
  
  /**
   * Start the animation
   */
  start: () => void;
  
  /**
   * Pause the animation
   */
  pause: () => void;
  
  /**
   * Resume the animation
   */
  resume: () => void;
  
  /**
   * Cancel the animation
   */
  cancel: () => void;
  
  /**
   * Reset the animation to its initial state
   */
  reset: () => void;
}

/**
 * Custom hook to handle CSS animations
 * @param targetRef Reference to the element to animate
 * @param keyframes Keyframes for the animation
 * @param options Animation options
 * @returns Animation controls
 */
export function useAnimation(
  targetRef: React.RefObject<HTMLElement>,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options: AnimationOptions = {}
): AnimationControls {
  const {
    duration = 300,
    timingFunction = 'ease-in-out',
    delay = 0,
    runOnMount = false,
    onStart,
    onComplete,
    onCancel,
  } = options;
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<Animation | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const isMountedRef = useRef(false);
  
  // Create the animation
  const createAnimation = useCallback(() => {
    if (!targetRef.current || !keyframes) return null;
    
    return targetRef.current.animate(keyframes, {
      duration,
      easing: timingFunction,
      delay,
      fill: 'forwards',
    });
  }, [targetRef, keyframes, duration, timingFunction, delay]);
  
  // Start the animation
  const start = useCallback(() => {
    if (!targetRef.current || !keyframes) return;
    
    // Cancel any existing animation
    if (animationRef.current) {
      animationRef.current.cancel();
    }
    
    // Create and start the animation
    const animation = createAnimation();
    if (!animation) return;
    
    animationRef.current = animation;
    startTimeRef.current = performance.now();
    remainingTimeRef.current = duration;
    
    // Set up event listeners
    animation.onfinish = () => {
      if (!isMountedRef.current) return;
      setIsRunning(false);
      onComplete?.();
    };
    
    animation.oncancel = () => {
      if (!isMountedRef.current) return;
      setIsRunning(false);
      onCancel?.();
    };
    
    // Start the animation
    setIsRunning(true);
    setIsPaused(false);
    onStart?.();
  }, [createAnimation, duration, keyframes, onCancel, onComplete, onStart, targetRef]);
  
  // Pause the animation
  const pause = useCallback(() => {
    if (!animationRef.current || !isRunning || isPaused) return;
    
    animationRef.current.pause();
    pauseTimeRef.current = performance.now();
    setIsPaused(true);
  }, [isPaused, isRunning]);
  
  // Resume the animation
  const resume = useCallback(() => {
    if (!animationRef.current || !isPaused) return;
    
    if (pauseTimeRef.current !== null && startTimeRef.current !== null) {
      // Calculate remaining time
      const elapsed = pauseTimeRef.current - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, duration - elapsed);
      
      // Update the animation with remaining time
      if (animationRef.current) {
        animationRef.current.currentTime = elapsed;
      }
    }
    
    animationRef.current?.play();
    startTimeRef.current = performance.now() - (duration - remainingTimeRef.current);
    setIsPaused(false);
  }, [duration, isPaused]);
  
  // Cancel the animation
  const cancel = useCallback(() => {
    if (!animationRef.current) return;
    
    animationRef.current.cancel();
    animationRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    remainingTimeRef.current = duration;
  }, [duration]);
  
  // Reset the animation
  const reset = useCallback(() => {
    cancel();
    if (targetRef.current && keyframes) {
      // Apply the initial keyframe
      const initialKeyframe = Array.isArray(keyframes) 
        ? keyframes[0] 
        : keyframes;
      
      Object.entries(initialKeyframe).forEach(([property, value]) => {
        if (targetRef.current && typeof value === 'string') {
          targetRef.current.style[property as any] = value;
        }
      });
    }
  }, [cancel, keyframes, targetRef]);
  
  // Set up cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Run animation on mount if specified
    if (runOnMount) {
      start();
    }
    
    return () => {
      isMountedRef.current = false;
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [runOnMount, start]);
  
  return {
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    cancel,
    reset,
  };
}

/**
 * Custom hook to handle CSS transitions
 * @param targetRef Reference to the element to transition
 * @param property The CSS property to transition
 * @param options Transition options
 * @returns Transition controls
 */
export function useTransition<T extends HTMLElement = HTMLElement>(
  targetRef: React.RefObject<T>,
  property: keyof React.CSSProperties,
  options: {
    /**
     * Initial value for the transition
     */
    initialValue?: string;
    
    /**
     * Duration of the transition in milliseconds
     * @default 300
     */
    duration?: number;
    
    /**
     * Timing function for the transition
     * @default 'ease-in-out'
     */
    timingFunction?: string;
    
    /**
     * Delay before the transition starts in milliseconds
     * @default 0
     */
    delay?: number;
    
    /**
     * Whether to apply the transition on mount
     * @default false
     */
    runOnMount?: boolean;
    
    /**
     * Callback when the transition starts
     */
    onStart?: () => void;
    
    /**
     * Callback when the transition completes
     */
    onComplete?: () => void;
  } = {}
) {
  const {
    initialValue = '',
    duration = 300,
    timingFunction = 'ease-in-out',
    delay = 0,
    runOnMount = false,
    onStart,
    onComplete,
  } = options;
  
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionEndHandler = useRef<(() => void) | null>(null);
  
  // Apply the transition
  const transitionTo = useCallback((value: string) => {
    if (!targetRef.current) return;
    
    // Set up the transition
    targetRef.current.style.transition = `${String(property)} ${duration}ms ${timingFunction} ${delay}ms`;
    
    // Set the new value
    targetRef.current.style[property as any] = value;
    setCurrentValue(value);
    
    // Set up the transition end handler
    const handleTransitionEnd = () => {
      if (!targetRef.current) return;
      
      // Remove the transition end listener
      targetRef.current.removeEventListener('transitionend', handleTransitionEnd as any);
      
      // Clear the transition property
      targetRef.current.style.transition = '';
      
      setIsTransitioning(false);
      onComplete?.();
    };
    
    // Remove any existing handler
    if (transitionEndHandler.current) {
      targetRef.current.removeEventListener('transitionend', transitionEndHandler.current as any);
    }
    
    // Set the new handler
    transitionEndHandler.current = handleTransitionEnd;
    targetRef.current.addEventListener('transitionend', handleTransitionEnd as any);
    
    // Update state and call onStart
    setIsTransitioning(true);
    onStart?.();
  }, [delay, duration, onComplete, onStart, property, targetRef, timingFunction]);
  
  // Set initial value on mount
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.style[property as any] = initialValue;
      
      if (runOnMount) {
        transitionTo(initialValue);
      }
    }
  }, [initialValue, property, runOnMount, targetRef, transitionTo]);
  
  // Clean up event listeners on unmount
  useEffect(() => {
    const element = targetRef.current;
    const handler = transitionEndHandler.current;
    
    return () => {
      if (element && handler) {
        element.removeEventListener('transitionend', handler as any);
      }
    };
  }, [targetRef]);
  
  return {
    currentValue,
    isTransitioning,
    transitionTo,
  };
}

// Example usage:
/*
// Using useAnimation
function AnimatedBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  
  const { start, isRunning } = useAnimation(
    boxRef,
    [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100px)', opacity: 0.5 },
      { transform: 'translateX(200px)', opacity: 1 },
    ],
    { duration: 1000, runOnMount: true }
  );
  
  return (
    <div>
      <div
        ref={boxRef}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: 'blue',
          margin: '20px 0',
        }}
      />
      <button onClick={start} disabled={isRunning}>
        {isRunning ? 'Animating...' : 'Start Animation'}
      </button>
    </div>
  );
}

// Using useTransition
function ToggleBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { transitionTo } = useTransition(boxRef, 'height', {
    initialValue: '100px',
    duration: 300,
  });
  
  const toggle = () => {
    if (isExpanded) {
      transitionTo('100px');
    } else {
      transitionTo('200px');
    }
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div>
      <div
        ref={boxRef}
        style={{
          width: '200px',
          height: '100px',
          backgroundColor: 'green',
          margin: '20px 0',
          overflow: 'hidden',
        }}
      >
        Content that can be toggled
      </div>
      <button onClick={toggle}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
}
*/
