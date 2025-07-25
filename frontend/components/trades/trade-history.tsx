"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Trade {
  id: string
  pair: string
  type: 'buy' | 'sell'
  lotSize: number
  entryPrice: number
  exitPrice?: number
  pips?: number
  profit?: number
  status: 'open' | 'closed' | 'pending'
  openTime: string
  closeTime?: string
  strategy?: string
  takeProfit?: number
  stopLoss?: number
}

export function TradeHistory() {
  const [timeframe, setTimeframe] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Mock data for trades
  const mockTrades: Trade[] = [
    {
      id: '1',
      pair: 'EUR/USD',
      type: 'buy',
      lotSize: 0.1,
      entryPrice: 1.0876,
      exitPrice: 1.0923,
      pips: 47,
      profit: 47.00,
      status: 'closed',
      openTime: '2024-01-15T09:30:00Z',
      closeTime: '2024-01-15T14:15:00Z',
      strategy: 'EMA Crossover',
      takeProfit: 1.0950,
      stopLoss: 1.0850
    },
    {
      id: '2',
      pair: 'GBP/JPY',
      type: 'sell',
      lotSize: 0.05,
      entryPrice: 185.42,
      exitPrice: 184.87,
      pips: 55,
      profit: 27.50,
      status: 'closed',
      openTime: '2024-01-14T11:20:00Z',
      closeTime: '2024-01-14T16:45:00Z',
      strategy: 'Support/Resistance',
      takeProfit: 184.50,
      stopLoss: 186.00
    },
    {
      id: '3',
      pair: 'USD/JPY',
      type: 'buy',
      lotSize: 0.1,
      entryPrice: 150.25,
      status: 'open',
      openTime: '2024-01-16T08:15:00Z',
      strategy: 'Trend Following',
      takeProfit: 151.00,
      stopLoss: 149.75
    },
    {
      id: '4',
      pair: 'AUD/USD',
      type: 'sell',
      lotSize: 0.2,
      entryPrice: 0.6578,
      status: 'open',
      openTime: '2024-01-16T10:45:00Z',
      strategy: 'Price Action',
      takeProfit: 0.6520,
      stopLoss: 0.6620
    },
    {
      id: '5',
      pair: 'XAU/USD',
      type: 'buy',
      lotSize: 0.1,
      entryPrice: 2025.40,
      exitPrice: 2018.75,
      pips: -66.5,
      profit: -66.50,
      status: 'closed',
      openTime: '2024-01-12T13:20:00Z',
      closeTime: '2024-01-12T18:30:00Z',
      strategy: 'News Trading',
      takeProfit: 2040.00,
      stopLoss: 2015.00
    },
    {
      id: '6',
      pair: 'EUR/GBP',
      type: 'buy',
      lotSize: 0.15,
      entryPrice: 0.8572,
      status: 'pending',
      openTime: '2024-01-16T11:30:00Z',
      strategy: 'Pending Order',
      takeProfit: 0.8620,
      stopLoss: 0.8540
    },
  ]

  const filteredTrades = mockTrades.filter(trade => {
    const matchesTimeframe = timeframe === 'all' || true // Implement timeframe filtering
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter
    return matchesTimeframe && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="border-green-500 text-green-500">Open</Badge>
      case 'closed':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Closed</Badge>
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProfitBadge = (profit?: number) => {
    if (profit === undefined) return null
    const isPositive = profit >= 0
    return (
      <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{profit.toFixed(2)} USD
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Trade History</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="sm" variant="outline">
            <Icons.download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border
        ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">#{trade.id}</TableCell>
                  <TableCell className="font-medium">{trade.pair}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.type === 'buy' ? (
                        <Icons.arrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <Icons.arrowDown className="h-4 w-4 mr-1" />
                      )}
                      {trade.type.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>{trade.lotSize} lot</TableCell>
                  <TableCell>{trade.entryPrice}</TableCell>
                  <TableCell>{trade.exitPrice?.toFixed(5) || '-'}</TableCell>
                  <TableCell>{getProfitBadge(trade.profit)}</TableCell>
                  <TableCell>{getStatusBadge(trade.status)}</TableCell>
                  <TableCell>{formatDate(trade.openTime)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {trade.strategy}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <Icons.moreVertical className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredTrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Icons.activity className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No trades found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your filters or place a new trade
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTrades.length}</span> of{' '}
            <span className="font-medium">{filteredTrades.length}</span> results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
