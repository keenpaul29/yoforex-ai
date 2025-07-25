import { useState, useEffect, useCallback, useRef } from 'react'

export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
  shouldReconnect?: (closeEvent: CloseEvent) => boolean
  reconnectInterval?: number
  reconnectAttempts?: number
  protocols?: string | string[]
}

interface WebSocketState {
  lastMessage: MessageEvent | null
  readyState: WebSocketReadyState
  isConnected: boolean
  connectionAttempts: number
  lastError: Event | null
}

export function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {}
) {
  const {
    onOpen,
    onClose,
    onMessage,
    onError,
    shouldReconnect = () => true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    protocols,
  } = options

  const [state, setState] = useState<WebSocketState>({
    lastMessage: null,
    readyState: WebSocketReadyState.CLOSED,
    isConnected: false,
    connectionAttempts: 0,
    lastError: null,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageQueueRef = useRef<string[]>([])
  const urlRef = useRef(url)

  // Update URL ref when URL changes
  useEffect(() => {
    urlRef.current = url
  }, [url])

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!urlRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      setState(prev => ({
        ...prev,
        readyState: WebSocketReadyState.CONNECTING,
        connectionAttempts: prev.connectionAttempts + 1,
      }))

      const ws = new WebSocket(urlRef.current, protocols)
      wsRef.current = ws

      ws.onopen = (event) => {
        setState(prev => ({
          ...prev,
          readyState: WebSocketReadyState.OPEN,
          isConnected: true,
          lastError: null,
        }))

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift()
          if (message && ws.readyState === WebSocket.OPEN) {
            ws.send(message)
          }
        }

        onOpen?.(event)
      }

      ws.onclose = (event) => {
        setState(prev => ({
          ...prev,
          readyState: WebSocketReadyState.CLOSED,
          isConnected: false,
        }))

        onClose?.(event)

        // Attempt to reconnect if conditions are met
        if (
          shouldReconnect(event) &&
          state.connectionAttempts < reconnectAttempts &&
          urlRef.current
        ) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onmessage = (event) => {
        setState(prev => ({
          ...prev,
          lastMessage: event,
        }))

        onMessage?.(event)
      }

      ws.onerror = (event) => {
        setState(prev => ({
          ...prev,
          lastError: event,
        }))

        onError?.(event)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      setState(prev => ({
        ...prev,
        readyState: WebSocketReadyState.CLOSED,
        isConnected: false,
      }))
    }
  }, [
    protocols,
    onOpen,
    onClose,
    onMessage,
    onError,
    shouldReconnect,
    reconnectInterval,
    reconnectAttempts,
    state.connectionAttempts,
  ])

  const disconnect = useCallback(() => {
    clearReconnectTimeout()
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }

    setState(prev => ({
      ...prev,
      readyState: WebSocketReadyState.CLOSED,
      isConnected: false,
      connectionAttempts: 0,
    }))
  }, [clearReconnectTimeout])

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    } else {
      // Queue message for when connection is established
      messageQueueRef.current.push(message)
    }
  }, [])

  const sendJsonMessage = useCallback((data: any) => {
    sendMessage(JSON.stringify(data))
  }, [sendMessage])

  const reconnect = useCallback(() => {
    disconnect()
    setState(prev => ({ ...prev, connectionAttempts: 0 }))
    connect()
  }, [disconnect, connect])

  // Connect when URL is provided
  useEffect(() => {
    if (url) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [url, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [clearReconnectTimeout])

  return {
    lastMessage: state.lastMessage,
    readyState: state.readyState,
    isConnected: state.isConnected,
    connectionAttempts: state.connectionAttempts,
    lastError: state.lastError,
    sendMessage,
    sendJsonMessage,
    connect,
    disconnect,
    reconnect,
  }
}

// Specialized hook for JSON message handling
export function useWebSocketJson<T = any>(
  url: string | null,
  options: Omit<UseWebSocketOptions, 'onMessage'> & {
    onJsonMessage?: (data: T) => void
  } = {}
) {
  const { onJsonMessage, ...wsOptions } = options
  const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null)

  const ws = useWebSocket(url, {
    ...wsOptions,
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastJsonMessage(data)
        onJsonMessage?.(data)
      } catch (error) {
        console.error('Failed to parse WebSocket message as JSON:', error)
      }
    },
  })

  return {
    ...ws,
    lastJsonMessage,
  }
}
