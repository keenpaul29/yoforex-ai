import { useCallback, useEffect, useRef } from "react"

type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'
type Key = string

type ShortcutHandler = (event: KeyboardEvent) => void

interface UseKeyboardShortcutOptions {
  /**
   * Callback function to execute when the shortcut is triggered
   */
  handler: ShortcutHandler
  
  /**
   * Array of modifier keys that must be pressed
   */
  modifiers?: ModifierKey[]
  
  /**
   * The main key that triggers the shortcut
   */
  key: Key
  
  /**
   * Whether the handler should be called on keydown (true) or keyup (false)
   * @default true
   */
  keydown?: boolean
  
  /**
   * Whether the event should be prevented from propagating
   * @default true
   */
  preventDefault?: boolean
  
  /**
   * Whether the shortcut is currently enabled
   * @default true
   */
  enabled?: boolean
  
  /**
   * Element to attach the event listener to (defaults to document)
   */
  target?: HTMLElement | Document | Window | null
}

/**
 * Hook to handle keyboard shortcuts
 * @param options Configuration options for the keyboard shortcut
 * @returns Cleanup function to remove the event listener
 */
export function useKeyboardShortcut(options: UseKeyboardShortcutOptions): () => void {
  const {
    handler,
    modifiers = [],
    key,
    keydown = true,
    preventDefault = true,
    enabled = true,
    target = document,
  } = options

  const handlerRef = useRef<ShortcutHandler>(handler)
  const isMac = typeof window !== 'undefined' ? /Mac|iPod|iPhone|iPad/.test(navigator.platform) : false

  // Update handler ref if handler changes
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  // Convert modifier keys to their corresponding event properties
  const getModifierState = useCallback((event: KeyboardEvent) => {
    const mods: Record<ModifierKey, boolean> = {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
    }
    
    return modifiers.every(mod => mods[mod])
  }, [modifiers])

  // Format the key for comparison (case-insensitive, handle special keys)
  const formatKey = useCallback((key: string): string => {
    // Handle special keys
    const specialKeys: Record<string, string> = {
      ' ': 'space',
      'esc': 'escape',
      'up': 'arrowup',
      'down': 'arrowdown',
      'left': 'arrowleft',
      'right': 'arrowright',
      'cmd': 'meta',
      'command': 'meta',
      'return': 'enter',
      'plus': '+',
    }

    const normalizedKey = key.toLowerCase().trim()
    return specialKeys[normalizedKey] || normalizedKey
  }, [])

  // Handle the keyboard event
  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    // Don't trigger if the event is already handled or if the target is an input/textarea
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    
    if (isInput && !(target as HTMLInputElement).dataset.allowShortcuts) {
      return
    }

    const formattedKey = formatKey(event.key.toLowerCase())
    const expectedKey = formatKey(key)
    
    // Check if the pressed key matches the expected key and modifiers
    if (
      formattedKey === expectedKey &&
      getModifierState(event) &&
      modifiers.length === (event.ctrlKey ? 1 : 0) + (event.shiftKey ? 1 : 0) + (event.altKey ? 1 : 0) + (event.metaKey ? 1 : 0)
    ) {
      if (preventDefault) {
        event.preventDefault()
        event.stopPropagation()
      }
      
      handlerRef.current(event)
    }
  }, [key, modifiers, preventDefault, formatKey, getModifierState])

  // Add event listeners
  useEffect(() => {
    if (!enabled || !target) return
    
    const eventType = keydown ? 'keydown' : 'keyup'
    
    target.addEventListener(eventType, handleKeyEvent as EventListener, true)
    
    return () => {
      target.removeEventListener(eventType, handleKeyEvent as EventListener, true)
    }
  }, [target, keydown, enabled, handleKeyEvent])

  // Return cleanup function
  return useCallback(() => {
    if (!target) return
    
    const eventType = keydown ? 'keydown' : 'keyup'
    target.removeEventListener(eventType, handleKeyEvent as EventListener, true)
  }, [target, keydown, handleKeyEvent])
}

/**
 * Hook to create a keyboard shortcut that can be displayed in the UI
 * @param shortcut The shortcut string (e.g., "Ctrl+Shift+S")
 * @returns Formatted shortcut for display
 */
export function useShortcutDisplay(shortcut: string): string {
  const isMac = typeof window !== 'undefined' ? /Mac|iPod|iPhone|iPad/.test(navigator.platform) : false
  
  return shortcut
    .split('+')
    .map(key => {
      const k = key.trim().toLowerCase()
      const replacements: Record<string, string> = {
        'cmd': isMac ? '⌘' : 'Ctrl',
        'command': isMac ? '⌘' : 'Ctrl',
        'ctrl': 'Ctrl',
        'shift': '⇧',
        'alt': isMac ? '⌥' : 'Alt',
        'option': isMac ? '⌥' : 'Alt',
        'enter': '⏎',
        'return': '⏎',
        'backspace': '⌫',
        'delete': '⌦',
        'tab': '⇥',
        'esc': '⎋',
        'escape': '⎋',
        'up': '↑',
        'down': '↓',
        'left': '←',
        'right': '→',
        'space': '␣',
      }
      
      return replacements[k] || key
    })
    .join(isMac ? '' : '+')
}

// Example usage:
/*
// Basic shortcut
useKeyboardShortcut({
  key: 's',
  modifiers: ['ctrl'],
  handler: () => {
    console.log('Ctrl+S pressed')
    saveDocument()
  },
})

// With display
const saveShortcut = useShortcutDisplay('Ctrl+S')
// On Mac: "⌘S", on Windows: "Ctrl+S"
*/
