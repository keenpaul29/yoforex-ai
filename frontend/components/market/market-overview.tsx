"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandlestickChart } from "@/components/charts/candlestick-chart"
import { useMarketData } from "@/hooks/use-market-data"
import { Skeleton } from "@/components/ui/skeleton"

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"]
const DEFAULT_SYMBOL = "EURUSD"

interface MarketPair {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
}

export function MarketOverview() {
  const [activePair, setActivePair] = useState(DEFAULT_SYMBOL)
  const [timeframe, setTimeframe] = useState<Timeframe>("1h")
  const [marketPairs, setMarketPairs] = useState<MarketPair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { data: chartData, isLoading: isChartLoading } = useMarketData({
    symbol: activePair,
    timeframe,
    limit: 100,
  })

  // Simulate fetching market pairs data
  useEffect(() => {
    const fetchMarketPairs = async () => {
      try {
        setIsLoading(true)
        // Simulating API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockPairs: MarketPair[] = [
          {
            symbol: "EURUSD",
            name: "Euro / US Dollar",
            price: 1.0876,
            change: 0.0023,
            changePercent: 0.21,
            high: 1.0892,
            low: 1.0851,
            volume: 1250000000
          },
          {
            symbol: "GBPUSD",
            name: "British Pound / US Dollar",
            price: 1.2718,
            change: -0.0012,
            changePercent: -0.09,
            high: 1.2745,
            low: 1.2698,
            volume: 987000000
          },
          {
            symbol: "USDJPY",
            name: "US Dollar / Japanese Yen",
            price: 150.42,
            change: 0.35,
            changePercent: 0.23,
            high: 150.78,
            low: 150.12,
            volume: 1450000000
          },
          {
            symbol: "AUDUSD",
            name: "Australian Dollar / US Dollar",
            price: 0.6578,
            change: 0.0012,
            changePercent: 0.18,
            high: 0.6592,
            low: 0.6556,
            volume: 567000000
          },
          {
            symbol: "USDCAD",
            name: "US Dollar / Canadian Dollar",
            price: 1.3521,
            change: -0.0023,
            changePercent: -0.17,
            high: 1.3545,
            low: 1.3501,
            volume: 423000000
          },
          {
            symbol: "USDCHF",
            name: "US Dollar / Swiss Franc",
            price: 0.8976,
            change: 0.0008,
            changePercent: 0.09,
            high: 0.8992,
            low: 0.8954,
            volume: 312000000
          },
        ]
        
        setMarketPairs(mockPairs)
      } catch (error) {
        console.error("Error fetching market pairs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMarketPairs()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketPairs(prevPairs => 
        prevPairs.map(pair => ({
          ...pair,
          price: pair.price * (1 + (Math.random() * 0.0005 - 0.00025)),
          volume: pair.volume * (1 + (Math.random() * 0.1 - 0.05))
        }))
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const activePairData = marketPairs.find(pair => pair.symbol === activePair) || {
    symbol: activePair,
    name: `${activePair.substring(0, 3)} / ${activePair.substring(3)}`,
    price: 0,
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    volume: 0
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Market Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {marketPairs.map((pair) => (
                  <button
                    key={pair.symbol}
                    onClick={() => setActivePair(pair.symbol)}
                    className={`flex items-center justify-between w-full p-3 rounded-md transition-colors ${
                      activePair === pair.symbol
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{pair.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {pair.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">
                        {pair.price.toFixed(4)}
                      </div>
                      <div 
                        className={`text-xs ${
                          pair.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(4)} ({pair.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-3 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <div className="text-2xl font-bold">{activePairData.symbol}</div>
              <div className="text-sm text-muted-foreground">
                {activePairData.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {activePairData.price.toFixed(4)}
              </div>
              <div 
                className={`text-sm ${
                  activePairData.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {activePairData.change >= 0 ? '+' : ''}{activePairData.change.toFixed(4)} ({activePairData.changePercent.toFixed(2)}%)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as Timeframe)}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  {TIMEFRAMES.map((tf) => (
                    <TabsTrigger key={tf} value={tf}>
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Icons.lineChart className="h-4 w-4 mr-2" />
                    Indicators
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
              
              <div className="h-[500px] w-full">
                {isChartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <CandlestickChart 
                    data={chartData} 
                    height={500}
                    onCrosshairMove={(price) => {
                      // Handle crosshair move
                    }}
                  />
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High</span>
                  <span>{activePairData.high.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low</span>
                  <span>{activePairData.low.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume (24h)</span>
                  <span>{(activePairData.volume / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RSI (14)</span>
                  <span>54.32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MACD</span>
                  <span>0.0012</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bollinger Bands</span>
                  <span>1.0865 - 1.0887</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Icons.arrowUp className="h-4 w-4 text-green-500 mr-2" />
                  <span>Strong Buy</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on 12 technical indicators
                </div>
                <Button size="sm" className="w-full mt-2">
                  <Icons.zap className="h-4 w-4 mr-2" />
                  Place Trade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
