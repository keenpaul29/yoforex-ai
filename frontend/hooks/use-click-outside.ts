import { RefObject, useEffect, useRef } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * Custom hook that triggers a callback when a click occurs outside of the specified element(s)
 * @param ref - The ref object(s) to check for outside clicks
 * @param handler - The callback function to execute when a click outside is detected
 * @param enabled - Whether the event listener is active (default: true)
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: Event) => void,
  enabled: boolean = true
) {
  const handlerRef = useRef(handler);
  
  // Update handler if it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const target = event.target as Node;
      
      // Convert single ref to array for consistent handling
      const refs = Array.isArray(ref) ? ref : [ref];
      
      // Check if the click was outside all provided refs
      const isOutside = refs.every(
        r => r.current && !r.current.contains(target)
      );

      if (isOutside) {
        handlerRef.current(event);
      }
    };

    // Use capture phase to ensure we catch the event before it bubbles up
    document.addEventListener('mousedown', listener, true);
    document.addEventListener('touchstart', listener, true);

    return () => {
      document.removeEventListener('mousedown', listener, true);
      document.removeEventListener('touchstart', listener, true);
    };
  }, [ref, enabled]);
}

/**
 * Custom hook that returns a ref and a state indicating whether the element is being hovered
 * @returns A tuple containing a ref and a boolean indicating hover state
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  const [isHovered, setIsHovered] = React.useState(false);
  const ref = useRef<T>(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}

/**
 * Custom hook that returns a ref and a state indicating whether the element is focused
 * @returns A tuple containing a ref and a boolean indicating focus state
 */
export function useFocus<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  const [isFocused, setIsFocused] = React.useState(false);
  const ref = useRef<T>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener('focus', handleFocus);
    node.addEventListener('blur', handleBlur);

    return () => {
      node.removeEventListener('focus', handleFocus);
      node.removeEventListener('blur', handleBlur);
    };
  }, []);

  return [ref, isFocused];
}

/**
 * Custom hook that combines hover and focus states
 * @returns An object containing ref, isHovered, and isFocused states
 */
export function useHoverAndFocus<T extends HTMLElement = HTMLElement>() {
  const [hoverRef, isHovered] = useHover<T>();
  const [focusRef, isFocused] = useFocus<T>();
  const ref = useCombinedRefs(hoverRef, focusRef);
  
  return {
    ref,
    isHovered,
    isFocused,
    isInteractive: isHovered || isFocused,
  };
}

/**
 * Combines multiple refs into a single ref callback
 * @param refs - The refs to combine
 * @returns A single ref callback that updates all provided refs
 */
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | React.RefCallback<T> | null | undefined>) {
  return useCallback(
    (element: T | null) => {
      refs.forEach(ref => {
        if (!ref) return;
        
        if (typeof ref === 'function') {
          ref(element);
        } else {
          (ref as React.MutableRefObject<T | null>).current = element;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  ) as (instance: T | null) => void;
}
