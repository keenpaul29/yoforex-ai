'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PriceChart } from '@/components/dashboard/price-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { 
  DollarSign, ArrowUpDown, Wallet, TrendingUp, BarChart3, RefreshCw, Bell, 
  AlertCircle, Settings, Info, Calendar as CalendarIcon, Filter, Plus, 
  Download, MoreHorizontal, Search, ChevronDown, ChevronUp, ChevronLeft, 
  ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Check, X, SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/toast-simple';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import useDashboardData from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";

// Sample data for the transactions table with proper typing
const transactionsData: Trade[] = [
  {
    id: '1',
    date: new Date('2025-07-28T10:30:00'),
    pair: 'EUR/USD',
    type: 'BUY' as const,
    lotSize: 0.1,
    entry: 1.1050,
    exit: 1.1080,
    pips: 30,
    profit: 30.00,
    status: 'Closed' as const,
  },
  // Add more sample data as needed
];

// Define the type for our trade data
type Trade = {
  id: string;
  date: Date;
  pair: string;
  type: 'BUY' | 'SELL';
  lotSize: number;
  entry: number;
  exit: number;
  pips: number;
  profit: number;
  status: 'Open' | 'Closed' | 'Pending';
};

export default function DashboardPage() {
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useDashboardData();
  const [riskLevel, setRiskLevel] = useState(50);
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Handle date range selection with proper type handling
  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      setDateRange(undefined);
      return;
    }
    
    // Ensure both from and to are defined if either is present
    if (range.from || range.to) {
      setDateRange({
        from: range.from || new Date(0), // Default to epoch start if from is missing
        to: range.to || new Date() // Default to now if to is missing
      });
    } else {
      setDateRange(undefined);
    }
  };
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Handle risk level change with toast notification
  const handleRiskLevelChange = (value: number[]) => {
    const newRiskLevel = value[0];
    setRiskLevel(newRiskLevel);
    
    // Show warning toast for high risk levels
    if (newRiskLevel > 80) {
      showToast({
        title: "⚠️ High Risk Warning",
        description: "You've set a high risk level. Please ensure you understand the potential risks.",
        variant: "warning"
      });
    } else if (newRiskLevel > 60) {
      showToast({
        title: "ℹ️ Risk Level Increased",
        description: `Risk level set to ${newRiskLevel}%`,
        variant: "info"
      });
    }
  };
  
  // Filter transactions based on selected date range and status
  const filteredData: Trade[] = useMemo(() => {
    let result = [...transactionsData];
    
    // Apply date filter
    if (dateRange?.from) {
      result = result.filter(
        (trade) => new Date(trade.date) >= dateRange.from!
      );
    }
    
    if (dateRange?.to) {
      result = result.filter(
        (trade) => new Date(trade.date) <= dateRange.to!
      );
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter((trade) => 
        trade.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    
    return result;
  }, [dateRange, selectedStatus]);

  // Columns configuration for the DataTable
  const columns: ColumnDef<Trade>[] = [
    {
      key: 'date',
      header: 'Date',
      cell: (row) => format(row.date, 'MMM dd, yyyy HH:mm'),
    },
    {
      key: 'pair',
      header: 'Pair',
      cell: (row) => row.pair,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row) => (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          row.type === 'BUY' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        )}>
          {row.type}
        </span>
      ),
    },
    {
      key: 'lotSize',
      header: 'Lot Size',
      cell: (row) => row.lotSize,
    },
    {
      key: 'entry',
      header: 'Entry',
      cell: (row) => row.entry,
    },
    {
      key: 'exit',
      header: 'Exit',
      cell: (row) => row.exit || '-',
    },
    {
      key: 'pips',
      header: 'Pips',
      cell: (row) => row.pips,
    },
    {
      key: 'profit',
      header: 'Profit',
      cell: (row) => (
        <span className={cn(
          'font-medium',
          row.profit >= 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        )}>
          {row.profit >= 0 ? '+' : ''}{row.profit.toFixed(2)} $
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: Trade) => (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          row.status === 'Closed'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
            : row.status === 'Open'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        )}>
          {row.status}
        </span>
      ),
    },
  ];

  // Handle refresh with toast feedback
  const handleRefresh = async () => {
    try {
      await refetch();
      showToast({
        title: "Success",
        description: "Dashboard data refreshed successfully",
        variant: "success"
      });
    } catch (err) {
      showToast({
        title: "Error",
        description: "Failed to refresh dashboard data",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-destructive mb-4">Failed to load dashboard data</p>
        <Button onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const {
    totalBalance,
    todaysPL,
    openTrades,
    winRate,
    chartData,
    marketData,
    recentTransactions
  } = data;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Balance"
          value={totalBalance}
          change={12.5}
          changeType="increase"
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Today's P/L"
          value={todaysPL}
          change={8.2}
          changeType={todaysPL.startsWith('+') ? "increase" : "decrease"}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Open Trades"
          value={openTrades.toString()}
          change={-2.3}
          changeType="decrease"
          icon={<ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Win Rate"
          value={`${winRate}%`}
          change={4.1}
          changeType="increase"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Market Overview */}
      <div className="grid gap-6">
        <MarketOverview marketData={marketData} />
      </div>

      {/* Trading Panel and Risk Management */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Trading Panel</span>
            </CardTitle>
            <CardDescription>Manage your trading preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-trading">Auto Trading</Label>
                <p className="text-xs text-muted-foreground">Enable automated trading</p>
              </div>
              <Switch id="auto-trading" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="price-alerts">Price Alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified on price changes</p>
              </div>
              <Switch id="price-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <Label htmlFor="risk-management">Risk Management</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px]">
                        <p>Adjust your risk tolerance level for automated trades</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">Set your risk tolerance</p>
              </div>
              <div className="flex items-center gap-2 w-[180px]">
                <Slider 
                  id="risk-management"
                  value={[riskLevel]}
                  onValueChange={handleRiskLevelChange}
                  max={100}
                  step={1}
                  className="w-full"
                  showValue={false}
                />
                <div className={cn(
                  "text-sm font-medium w-10 text-center rounded px-1",
                  riskLevel > 80 ? "bg-red-500/10 text-red-500" : 
                  riskLevel > 60 ? "bg-amber-500/10 text-amber-500" :
                  "bg-green-500/10 text-green-500"
                )}>
                  {riskLevel}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Price Chart</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            <PriceChart 
              title="EUR/USD 1D" 
              data={chartData} 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions and Notifications */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Trade History</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[260px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d, yyyy")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange as DateRange | undefined}
                      onSelect={(range: DateRange | undefined) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        } else if (range?.from) {
                          setDateRange({ from: range.from, to: range.from });
                        } else {
                          setDateRange(undefined);
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable<Trade>
                columns={columns}
                data={filteredData}
                emptyMessage="No transactions found"
                loading={false}
                className="w-full"
                striped
                hoverable
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="alerts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="settings">Notification Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="alerts" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Price Alert Triggered</p>
                          <p className="text-xs text-muted-foreground">EUR/USD reached 1.1000</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive email notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Enable browser notifications</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Overview Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 pt-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chart and Transactions Skeleton */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
