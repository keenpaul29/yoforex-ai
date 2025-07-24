'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchWithErrorHandling } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { authAPI } from '@/utils/api';
// Icons
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Calculator, 
  Brain, 
  Bell, 
  BarChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Clock, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  Newspaper
} from 'lucide-react';

// Charts
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar,
  Tooltip,
  Legend
} from 'recharts';

// Types
import { 
  CurrencyPair, 
  PerformanceData, 
  NewsItem, 
  ForumPost, 
  TradingDataPoint 
} from '@/types/dashboard';

// Hooks
import useDashboardData from '@/hooks/useDashboardData';

// Utils
import { format } from 'date-fns';

// Badge variants are handled by the component itself

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <Skeleton className="h-6 w-1/4 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription className="flex flex-col space-y-2">
      <span>{error}</span>
      <Button 
        variant="outline" 
        size="sm" 
        className="self-start mt-2"
        onClick={onRetry}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </AlertDescription>
  </Alert>
);

// CurrencyPairCard Component
const CurrencyPairCard = ({ pair }: { pair: CurrencyPair }) => {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-400">{pair.pair}</p>
            <p className="text-2xl font-bold text-white">{pair.price}</p>
          </div>
          {pair.positive ? (
            <Badge className="flex items-center gap-1 bg-green-600 text-white">
              <ArrowUpRight size={14} />
              {pair.change}
            </Badge>
          ) : (
            <Badge className="flex items-center gap-1 bg-red-600 text-white">
              <ArrowDownRight size={14} />
              {pair.change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for user data
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Use data from our custom hook with fallbacks
  const { data, loading, error, refetch } = useDashboardData();
  
  // Destructure data with fallbacks
  const {
    currencyPairs = [],
    performanceData = [],
    news = [],
    communityPosts = [],
    swingData = [],
    scalpData = []
  } = data || {};
  
  // Handle tab change with refetch
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    refetch(); // Refetch data when tab changes if needed
  };
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the centralized API service with the correct auth endpoint
        const userData = await fetchWithErrorHandling<{ name: string }>('/auth/profile');
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user profile.',
          variant: 'destructive',
        });
      }
    };

    fetchUserData();
  }, []);

  // Format currency pair data
  const formatCurrencyPairs = (pairs: any[]): CurrencyPair[] => {
    if (!Array.isArray(pairs)) return [];
    
    return pairs.map(pair => {
      // If the pair is already in the correct format, return it
      if (pair.pair && pair.price && pair.change !== undefined) {
        return {
          pair: pair.pair,
          price: typeof pair.price === 'number' ? pair.price.toFixed(4) : pair.price,
          change: String(pair.change).startsWith('+') || String(pair.change).startsWith('-') 
            ? pair.change 
            : (pair.change >= 0 ? '+' : '') + pair.change + '%',
          positive: pair.positive !== undefined ? pair.positive : pair.change >= 0
        };
      }
      
      // If it's in the API format, convert it
      return {
        pair: pair.symbol || pair.pair || 'N/A',
        price: pair.price ? (typeof pair.price === 'number' ? pair.price.toFixed(4) : pair.price) : '0.0000',
        change: pair.change !== undefined 
          ? (typeof pair.change === 'number' 
              ? (pair.change >= 0 ? '+' : '') + pair.change.toFixed(2) + '%' 
              : pair.change)
          : '0.00%',
        positive: pair.positive !== undefined ? pair.positive : pair.change >= 0
      };
    });
  };


  if (loading && !currencyPairs.length) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/20 rounded"></CardContent>
          </Card>
          <Card className="col-span-3 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show error message if there's an error and no data is loaded
  if (error && !currencyPairs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription className="mt-2">
            {error} Some features may be limited. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Good morning, {user?.name || "Loading..."}</h1>
          {/* <p className="text-slate-400">Monday, June 14, 2023</p> */}
        </div>
      </div>

      {/* Currency Pairs */}

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {currencyPairs.map((currency) => (
          <Card key={currency.pair} className="flex-shrink-0 bg-slate-800/50 border-slate-700 min-w-[140px]">
            <CardContent className="p-3">
              <div className="font-medium text-white text-sm">{currency.pair}</div>
              <div className="text-lg font-bold text-white">{currency.price}</div>
              
              {currency.positive ? (
                <Badge className="flex items-center gap-1 bg-green-600 text-white">
                  <ArrowUpRight size={14} />
                  {currency.change}
                </Badge>
              ) : (
                <Badge className="flex items-center gap-1 bg-red-600 text-white">
                  <ArrowDownRight size={14} />
                  {currency.change}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trading Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swing Trading */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white mb-5">Swing Trading</CardTitle>
              <p className="text-slate-400 text-sm">H4, D1, W1 Timeframes</p>
            </div>
            <Badge className="bg-blue-600 text-white">7 Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-slate-400 text-sm">Win Rate</div>
                <div className="text-2xl font-bold text-white">72.3%</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Avg. Profit</div>
                <div className="text-2xl font-bold text-green-400">+1.68%</div>
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={swingData}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scalp Trading */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white mb-5">Scalp Trading</CardTitle>
              <p className="text-slate-400 text-sm">M5, M15, M30 Timeframes</p>
            </div>
            <Badge className="bg-purple-600 text-white">12 Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-slate-400 text-sm">Win Rate</div>
                <div className="text-2xl font-bold text-white">68.5%</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Avg. Profit</div>
                <div className="text-2xl font-bold text-green-400">+0.75%</div>
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scalpData}>
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics and Trading Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Statistics */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white mb-5">Performance Statistics</CardTitle>
              <Tabs defaultValue="week" className="w-auto">
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">This Month</TabsTrigger>
                  <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-slate-400 text-sm">Total Trades</div>
                <div className="text-2xl font-bold text-white">47</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-sm">Win Rate</div>
                <div className="text-2xl font-bold text-white">71.2%</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-sm">Profit Factor</div>
                <div className="text-2xl font-bold text-white">2.8</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-sm">Total Profit</div>
                <div className="text-2xl font-bold text-green-400">+$1,248</div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Bar dataKey="value" fill="#3b82f6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trading Tools */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Trading Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
              <Calculator className="h-4 w-4 mr-3" />
              Pre-Trade Calculator
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
              <Brain className="h-4 w-4 mr-3" />
              AI Analysis
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
              <Bell className="h-4 w-4 mr-3" />
              Price Alerts
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
              <BarChart className="h-4 w-4 mr-3" />
              Backtest Simulator
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Community Feed and Trading Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Community Feed */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Community Feed</CardTitle>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityPosts.map((post, index) => (
              <div key={index} className="flex space-x-3 p-3 rounded-lg bg-slate-700/30">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-600 flex items-center justify-center">
                  {post.avatar ? (
                    <Image
                      src={post.avatar}
                      alt={post.author}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white text-sm">{post.author}</span>
                    <span className="text-slate-400 text-xs">{post.time}</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-slate-400 text-xs">
                    <span>{post.likes} likes</span>
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market News */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Market News</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-slate-300"
              onClick={() => refetch()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {loading && !news.length ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-700/30 animate-pulse">
                    <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading news</AlertTitle>
                <AlertDescription className="mt-2">
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : news.length > 0 ? (
              // News items
              news.map((item, index) => (
                <a
                  key={index}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-slate-700/30 transition-colors border border-slate-700"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1 line-clamp-2">
                        {item.headline}
                      </h4>
                      <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {item.source} • {new Date(item.time).toLocaleDateString()}
                        </span>
                        {item.sentiment && (
                          <Badge
                            variant={
                              item.sentiment === 'positive'
                                ? 'success'
                                : item.sentiment === 'negative'
                                ? 'destructive'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {item.sentiment.charAt(0).toUpperCase() +
                              item.sentiment.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              // Empty state
              <div className="text-center py-8">
                <Newspaper className="h-10 w-10 mx-auto text-slate-500 mb-2" />
                <p className="text-slate-400">No news available at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}