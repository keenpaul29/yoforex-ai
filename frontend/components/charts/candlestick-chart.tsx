"use client"

import React, { useRef, useEffect } from "react"
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from "lightweight-charts"
import { useTheme } from "next-themes"

export interface CandlestickChartProps {
  data: CandlestickData[]
  height?: number
  autoWidth?: boolean
  onCrosshairMove?: (price: number | null) => void
}

export function CandlestickChart({
  data,
  height = 400,
  autoWidth = true,
  onCrosshairMove,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove()
    }

    // Create new chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: resolvedTheme === 'dark' ? '#E2E8F0' : '#1A202C',
      },
      autoSize: autoWidth,
      height,
      grid: {
        vertLines: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        horzLines: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      rightPriceScale: {
        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: resolvedTheme === 'dark' ? '#4A5568' : '#CBD5E0',
        },
        horzLine: {
          labelBackgroundColor: resolvedTheme === 'dark' ? '#4A5568' : '#CBD5E0',
        },
      },
    })

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Set data
    candlestickSeries.setData(data)

    // Handle crosshair move
    chart.subscribeCrosshairMove((param) => {
      if (onCrosshairMove && param && param.seriesPrices) {
        const priceObj = param.seriesPrices.get(candlestickSeriesRef.current!)
        const closePrice = (priceObj && typeof priceObj === "object" && "close" in priceObj)
          ? (priceObj as { close: number }).close
          : null
        onCrosshairMove(closePrice)
      }
    })

    // Handle window resize
    const handleResize = () => {
      if (autoWidth && chartContainerRef.current?.parentElement) {
        chart.applyOptions({ width: chartContainerRef.current.parentElement.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Store references
    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, height, autoWidth, onCrosshairMove, resolvedTheme])

  return <div ref={chartContainerRef} className="w-full" />
}
