import { authAPI, newsAPI } from '@/utils/api';

// Helper function to generate sample performance data
const generateSamplePerformanceData = (): PerformanceData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    value: Math.floor(Math.random() * 200) - 50 // Random value between -50 and 150
  }));
};

// Helper function to generate sample trading data
const generateSampleTradingData = (type: 'Swing' | 'Scalp') => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValue = type === 'Swing' ? 10 : 5;
  return months.map(month => ({
    name: month,
    value: Math.floor(Math.random() * 20) + baseValue
  }));
};

// Helper function to make API calls with error handling
const fetchWithErrorHandling = async (endpoint: string, options?: RequestInit) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}:`, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

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
};

type DashboardData = {
  currencyPairs: CurrencyPair[];
  performanceData: PerformanceData[];
  news: NewsItem[];
  communityPosts: ForumPost[];
  swingData: { name: string; value: number }[];
  scalpData: { name: string; value: number }[];
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard data...');
    let pricesData = [];
    let newsData = [];

    try {
      // Fetch prices data
      console.log('Fetching prices...');
      const pricesResponse = await fetchWithErrorHandling('/prices/prices');
      pricesData = Array.isArray(pricesResponse) ? pricesResponse : [];
      console.log('Prices data:', pricesData);
    } catch (error) {
      console.error('Error in prices fetch:', error);
      pricesData = [];
    }

    try {
      // Fetch news data
      console.log('Fetching news...');
      const newsResponse = await fetchWithErrorHandling('/news/');
      // Extract top_news from the response and transform to match frontend format
      newsData = newsResponse?.top_news?.map((article: any) => ({
        id: article.headline || Math.random().toString(),
        headline: article.headline,
        title: article.headline,
        summary: article.summary,
        published_at: article.time,
        time: article.time,
        source: article.source,
        url: article.url,
        sentiment: article.sentiment
      })) || [];
      console.log('News data:', newsData);
    } catch (error) {
      console.error('Error in news fetch:', error);
      newsData = [];
    }

    // Fetch additional data
    let performanceData = [];
    let forumPosts = [];

    try {
      const performanceResponse = await fetchWithErrorHandling('/performance/');
      performanceData = performanceResponse?.by_day?.map((day: any) => ({
        day: day.day,
        value: day.net_pct
      })) || generateSamplePerformanceData();
    } catch (error) {
      console.error('Error fetching performance data:', error);
      performanceData = generateSamplePerformanceData();
    }

    try {
      const forumResponse = await fetchWithErrorHandling('/forum/posts');
      forumPosts = forumResponse?.posts?.slice(0, 5)?.map((post: any) => ({
        id: post.id,
        author: post.author?.name || 'Anonymous',
        content: post.content,
        likes: post.like_count || 0,
        comments: post.comment_count || 0,
        timeAgo: new Date(post.created_at).toLocaleDateString(),
        time: post.created_at,
        replies: post.comment_count || 0,
        avatar: '/default-avatar.png'
      })) || [];
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      forumPosts = [];
    }

    const swingData = generateSampleTradingData('Swing');
    const scalpData = generateSampleTradingData('Scalp');

    // Transform data to match the expected format with fallbacks
    const formattedData: DashboardData = {
      // Currency pairs from prices endpoint
      currencyPairs: pricesData.length > 0
        ? pricesData.map((pair: any) => {
            const price = typeof pair.price === 'number' ? pair.price : 0;
            const change = typeof pair.change === 'number' ? pair.change : 0;
            return {
              pair: pair.pair || 'N/A',
              price: price.toFixed(4),
              change: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`,
              positive: change >= 0
            };
          })
        : [
            // Fallback data if API fails
            { pair: 'EUR/USD', price: '1.0892', change: '+0.05%', positive: true },
            { pair: 'GBP/USD', price: '1.2754', change: '-0.12%', positive: false },
            { pair: 'USD/JPY', price: '138.92', change: '+0.23%', positive: true },
            { pair: 'AUD/USD', price: '0.6598', change: '+0.08%', positive: true },
            { pair: 'USD/CAD', price: '1.3465', change: '-0.03%', positive: false },
          ],

      // Performance data (sample for now)
      performanceData: performanceData,

      // News data
      news: newsData.length > 0
        ? newsData.map((item: any) => ({
            id: item.id || `news-${Math.random().toString(36).substr(2, 9)}`,
            title: item.headline || item.title || 'Market Update',
            summary: item.summary || 'Latest market updates and analysis.',
            published_at: item.time || item.published_at || new Date().toISOString(),
            source: item.source || 'Market News'
          }))
        : [
            {
              id: '1',
              title: 'Market Update: Major Currency Pairs Analysis',
              summary: 'Latest analysis on major currency pairs and market trends.',
              published_at: new Date().toISOString(),
              source: 'Forex News Network'
            },
            {
              id: '2',
              title: 'Economic Calendar: Upcoming Events',
              summary: 'Key economic events that could impact the forex market this week.',
              published_at: new Date().toISOString(),
              source: 'Market Watch'
            }
          ],

      // Community posts (sample for now)
      communityPosts: [
        {
          id: '1',
          author: 'Trader123',
          content: 'Just made a great trade on EUR/USD!',
          likes: 5,
          comments: 2,
          timeAgo: '2h ago'
        },
        {
          id: '2',
          author: 'ForexNewbie',
          content: 'Can someone explain how to read candlestick patterns?',
          likes: 3,
          comments: 7,
          timeAgo: '1d ago'
        }
      ],

      // Trading history (sample for now)
      swingData: swingData,
      scalpData: scalpData
    };

    return formattedData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;
  
  return 'Just now';
};
