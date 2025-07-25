"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { CandlestickChart } from "@/components/charts/candlestick-chart"
import { useMarketData } from "@/hooks/use-market-data"

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
type AnalysisType = "scalp" | "swing"
const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"]
const DEFAULT_SYMBOL = "EURUSD"

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const [analysisType, setAnalysisType] = useState<AnalysisType>(
    (searchParams.get("type") as AnalysisType) || "scalp"
  )
  const [timeframe, setTimeframe] = useState<Timeframe>(
    (searchParams.get("tf") as Timeframe) || (analysisType === "scalp" ? "5m" : "1h")
  )
  const [symbol] = useState(searchParams.get("symbol") || DEFAULT_SYMBOL)
  
  const { data, isLoading, error, refetch } = useMarketData({
    symbol,
    timeframe,
  })

  // Calculate chart height based on analysis type
  const chartHeight = useMemo(() => {
    return analysisType === "scalp" ? 400 : 500
  }, [analysisType])

  // Handle analysis type change
  const handleAnalysisTypeChange = (value: string) => {
    const newType = value as AnalysisType
    setAnalysisType(newType)
    // Update timeframe based on analysis type
    setTimeframe(newType === "scalp" ? "5m" : "1h")
  }

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as Timeframe)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Icons.alertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Error loading chart data</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            <Icons.refreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {analysisType === "scalp" ? "Scalp" : "Swing"} Analysis
          </h1>
          <p className="text-muted-foreground">
            {analysisType === "scalp"
              ? "Short-term trading opportunities with quick entries and exits."
              : "Medium to long-term trading opportunities with higher timeframes."}
          </p>
        </div>
        
        <Tabs 
          defaultValue={analysisType}
          onValueChange={handleAnalysisTypeChange}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scalp">Scalp</TabsTrigger>
            <TabsTrigger value="swing">Swing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {symbol} - {timeframe} Chart
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.refreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b">
            <Tabs 
              value={timeframe}
              onValueChange={handleTimeframeChange}
              className="px-4"
            >
              <TabsList className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
                {TIMEFRAMES.map((tf) => (
                  <TabsTrigger
                    key={tf}
                    value={tf}
                    className="relative h-9 rounded-none border-b-2 border-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    {tf}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center" style={{ height: chartHeight }}>
                <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CandlestickChart 
                data={data} 
                height={chartHeight}
                onCrosshairMove={(price) => {
                  // Handle crosshair move (e.g., update price display)
                  console.log("Current price:", price)
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Key Levels
            </CardTitle>
            <Icons.barChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisType === "scalp" ? "Intraday" : "Swing"} Levels
            </div>
            <p className="text-xs text-muted-foreground">
              {analysisType === "scalp"
                ? "Support and resistance levels for today's session"
                : "Key support and resistance levels for the current swing"}
            </p>
            {/* TODO: Add dynamic levels */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Technical Indicators
            </CardTitle>
            <Icons.lineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisType === "scalp" ? "Momentum" : "Trend"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analysisType === "scalp"
                ? "RSI, MACD, and other momentum indicators"
                : "Moving averages, trend lines, and other trend indicators"}
            </p>
            {/* TODO: Add dynamic indicators */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Sentiment
            </CardTitle>
            <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisType === "scalp" ? "Short-term" : "Long-term"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analysisType === "scalp"
                ? "Order book and short-term sentiment indicators"
                : "Positioning and long-term market sentiment"}
            </p>
            {/* TODO: Add sentiment indicators */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
