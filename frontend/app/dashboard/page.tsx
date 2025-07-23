'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Target, Calculator, Brain, Bell, BarChart, ArrowUpRight, ArrowDownRight, Calendar, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboardData } from '@/services/dashboardService';
import { authAPI } from '@/utils/api';
import { Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Types
type CurrencyPair = {
  pair: string;
  price: string;
  change: string;
  positive: boolean;
};

type PerformanceData = {
  day: string;
  value: number;
};

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  published_at: string;
  source: string;
};

type ForumPost = {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  time?: string;
  replies?: number;
  avatar?: string;
};

type User = {
  name: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  // State for API data
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  const [swingData, setSwingData] = useState<{ name: string, value: number }[]>([]);
  const [scalpData, setScalpData] = useState<{ name: string, value: number }[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [communityPosts, setCommunityPosts] = useState<ForumPost[]>([]);

  // Sample data for fallback
  const sampleCurrencyPairs: CurrencyPair[] = [
    { pair: 'EUR/USD', price: '1.0892', change: '+0.05%', positive: true },
    { pair: 'GBP/USD', price: '1.2754', change: '-0.12%', positive: false },
    { pair: 'USD/JPY', price: '138.92', change: '+0.23%', positive: true },
    { pair: 'AUD/USD', price: '0.6598', change: '+0.08%', positive: true },
    { pair: 'USD/CAD', price: '1.3465', change: '-0.03%', positive: false },
  ];

  const samplePerformanceData: PerformanceData[] = [
    { day: 'Mon', value: 100 },
    { day: 'Tue', value: 150 },
    { day: 'Wed', value: -50 },
    { day: 'Thu', value: 180 },
    { day: 'Fri', value: 120 },
    { day: 'Sat', value: 250 },
    { day: 'Sun', value: 140 },
  ];

  const sampleSwingData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 19 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 25 },
    { name: 'May', value: 22 },
    { name: 'Jun', value: 30 },
  ];

  const sampleScalpData = [
    { name: 'Jan', value: 8 },
    { name: 'Feb', value: 14 },
    { name: 'Mar', value: 12 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 16 },
    { name: 'Jun', value: 21 },
  ];

  const sampleCommunityPosts: ForumPost[] = [
    {
      id: '1',
      author: 'Michael R.',
      timeAgo: '2 hours ago',
      content: 'Just closed a EUR/USD long position with 2.3% profit! The AI analysis was spot on with the reversal point.',
      likes: 24,
      comments: 7,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
    },
    {
      id: '2',
      author: 'Sarah K.',
      timeAgo: '5 hours ago',
      content: 'Has anyone else noticed the strong resistance level on GBP/JPY? Thinking about going short if it bounces again.',
      likes: 15,
      comments: 9,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
    },
    {
      id: '3',
      author: 'David L.',
      timeAgo: '1 day ago',
      content: 'The market sentiment indicator is showing extreme fear - could be a good buying opportunity for some major pairs.',
      likes: 32,
      comments: 14,
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
    }
  ];

  // Fetch data on component mount and when active tab changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Only show loading skeleton for the active tab
        const data = await fetchDashboardData();
        
        if (!isMounted) return;
        
        // Update state with fetched data
        setCurrencyPairs(data.currencyPairs);
        setPerformanceData(data.performanceData);
        setSwingData(data.swingData);
        setScalpData(data.scalpData);
        setNews(data.news);
        setCommunityPosts(data.communityPosts);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          setError('Unable to load dashboard data. Some features may be limited.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [activeTab]); // Re-fetch when tab changes

  // Format currency pair data
  const formatCurrencyPairs = (pairs: any[]): CurrencyPair[] => {
    if (!Array.isArray(pairs)) return sampleCurrencyPairs;
    
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, []);

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
              <div className={`text-xs flex items-center ${currency.positive ? 'text-green-400' : 'text-red-400'
                }`}>
                {currency.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {currency.change}
              </div>
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
              <CardTitle className="text-white">Swing Trading</CardTitle>
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
              <CardTitle className="text-white">Scalp Trading</CardTitle>
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
              <CardTitle className="text-white">Performance Statistics</CardTitle>
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
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
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

        {/* Trading Tips */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Trading Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-800">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Daily Insight
              </h4>
              <p className="text-sm text-slate-300">
                USD is showing strength against major pairs today due to positive economic data. Consider this in your trade planning.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-orange-900/30 border border-orange-800">
              <h4 className="font-medium text-white mb-2">Risk Management Reminder</h4>
              <p className="text-sm text-slate-300">
                Never risk more than 2% of your account on a single trade. Your suggested max position size today: $240.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-900/30 border border-green-800">
              <h4 className="font-medium text-white mb-2">Market Events</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>USD CPI Data</span>
                  <span className="text-yellow-400">High Impact</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>USD FOMC Statement</span>
                  <span className="text-red-400">Extreme Impact</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GBP Employment Change</span>
                  <span className="text-yellow-400">High Impact</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-800">
                <h5 className="font-medium text-white text-sm mb-1">Upcoming Events (Next 2 Hours)</h5>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>USD CPI Data</span>
                    <span>2:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EUR ECB Speech</span>
                    <span>3:15 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}