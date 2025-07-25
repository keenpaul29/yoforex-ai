import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { CandlestickData } from "lightweight-charts"

const API_BASE_URL = "/api/market"

interface MarketDataParams {
  symbol: string
  timeframe: string
  limit?: number
  enableRealTime?: boolean
}

interface WebSocketMessage {
  type: string
  data: {
    timestamp: number
    open: string
    high: string
    low: string
    close: string
    volume?: string
  }
}

interface MarketDataState {
  data: CandlestickData[]
  isLoading: boolean
  error: Error | null
  isConnected: boolean
  lastUpdate: number | null
}

interface ApiDataItem {
  timestamp: number
  open: string
  high: string
  low: string
  close: string
  volume?: string
}

const transformApiData = (item: ApiDataItem): CandlestickData => ({
  time: (item.timestamp / 1000) as any, // Cast to satisfy Time type
  open: parseFloat(item.open),
  high: parseFloat(item.high),
  low: parseFloat(item.low),
  close: parseFloat(item.close),
})

export function useMarketData({
  symbol,
  timeframe,
  limit = 100,
  enableRealTime = true
}: MarketDataParams) {
  const [state, setState] = useState<MarketDataState>({
    data: [],
    isLoading: true,
    error: null,
    isConnected: false,
    lastUpdate: null,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 5
  const retryDelay = 1000

  // Memoize the API URL to prevent unnecessary re-renders
  const apiUrl = useMemo(
    () => `${API_BASE_URL}/candles?symbol=${symbol}&timeframe=${timeframe}&limit=${limit}`,
    [symbol, timeframe, limit]
  )

  // Memoize WebSocket URL
  const wsUrl = useMemo(
    () => `wss://your-api-url/ws/candles/${symbol.toLowerCase()}_${timeframe}`,
    [symbol, timeframe]
  )

  const fetchMarketData = useCallback(async (): Promise<CandlestickData[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!Array.isArray(result)) {
        throw new Error("Invalid API response format")
      }

      const formattedData = result.map(transformApiData)

      setState(prev => ({
        ...prev,
        data: formattedData,
        isLoading: false,
        error: null,
        lastUpdate: Date.now(),
      }))

      return formattedData
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch market data")
      console.error("Market data fetch error:", error)

      setState(prev => ({
        ...prev,
        isLoading: false,
        error,
      }))

      throw error
    }
  }, [apiUrl])

  const updateCandleData = useCallback((message: WebSocketMessage) => {
    if (message.type !== 'candle_update') return

    setState(prev => {
      const newData = [...prev.data]
      const lastCandle = newData[newData.length - 1]
      const messageTime = message.data.timestamp / 1000

      if (lastCandle && lastCandle.time === messageTime) {
        // Update existing candle
        newData[newData.length - 1] = {
          ...lastCandle,
          high: Math.max(lastCandle.high, parseFloat(message.data.high)),
          low: Math.min(lastCandle.low, parseFloat(message.data.low)),
          close: parseFloat(message.data.close),
        }
      } else {
        // Add new candle
        const newCandle = transformApiData({
          timestamp: message.data.timestamp,
          open: message.data.open,
          high: message.data.high,
          low: message.data.low,
          close: message.data.close,
          volume: message.data.volume,
        })

        newData.push(newCandle)

        // Maintain limit
        if (newData.length > limit) {
          newData.shift()
        }
      }

      return {
        ...prev,
        data: newData,
        lastUpdate: Date.now(),
      }
    })
  }, [limit])

  const connectWebSocket = useCallback(() => {
    if (!enableRealTime || !symbol || !timeframe) return

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`WebSocket connected: ${symbol} ${timeframe}`)
        setState(prev => ({ ...prev, isConnected: true }))
        retryCountRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          updateCandleData(message)
        } catch (err) {
          console.error("WebSocket message parse error:", err)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setState(prev => ({ ...prev, isConnected: false }))
      }

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected: ${symbol} ${timeframe}`, event.code)
        setState(prev => ({ ...prev, isConnected: false }))

        // Retry connection if not manually closed
        if (event.code !== 1000 && retryCountRef.current < maxRetries) {
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++
            connectWebSocket()
          }, retryDelay * Math.pow(2, retryCountRef.current))
        }
      }
    } catch (err) {
      console.error("WebSocket connection error:", err)
      setState(prev => ({ ...prev, isConnected: false }))
    }
  }, [wsUrl, symbol, timeframe, enableRealTime, updateCandleData])

  // Initial data fetch
  useEffect(() => {
    if (symbol && timeframe) {
      fetchMarketData()
    }
  }, [fetchMarketData, symbol, timeframe])

  // WebSocket connection management
  useEffect(() => {
    if (enableRealTime && symbol && timeframe) {
      connectWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000) // Normal closure
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [connectWebSocket, enableRealTime, symbol, timeframe])

  const refetch = useCallback(() => fetchMarketData(), [fetchMarketData])

  const reconnect = useCallback(() => {
    retryCountRef.current = 0
    connectWebSocket()
  }, [connectWebSocket])

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,
    lastUpdate: state.lastUpdate,
    refetch,
    reconnect,
  }
}
