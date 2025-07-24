// Common types used across the dashboard

export interface CurrencyPair {
  pair: string;
  price: string;
  change: string;
  positive: boolean;
}

export interface PerformanceData {
  day: string;
  value: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  title: string;
  summary: string;
  published_at: string;
  time: string;
  source: string;
  url?: string;
  image?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  time?: string;
  replies?: number;
  avatar?: string;
}

export interface DashboardData {
  currencyPairs: CurrencyPair[];
  performanceData: PerformanceData[];
  news: NewsItem[];
  communityPosts: ForumPost[];
  swingData: { name: string; value: number }[];
  scalpData: { name: string; value: number }[];
}

export interface TradingDataPoint {
  name: string;
  value: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// API response types
export interface PriceData {
  pair: string;
  price: number;
  change: number;
  timestamp: string;
}

export interface NewsResponse {
  articles: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

// Chart data types
export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
}

export interface ChartSeries {
  id: string;
  data: ChartDataPoint[];
  name?: string;
  color?: string;
}
