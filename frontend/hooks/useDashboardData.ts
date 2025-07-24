import { useState, useEffect, useCallback } from 'react';
import { DashboardData, PriceData, NewsResponse } from '@/types/dashboard';
import { fetchWithErrorHandling } from '@/services/api';

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setLoading(true);
    }
    try {
      setError(null);

      // Fetch data in parallel
      const [pricesResponse, newsResponse, performanceResponse, forumResponse] = await Promise.all([
        fetchWithErrorHandling<PriceData[]>('/prices/prices'),
        fetchWithErrorHandling<any>('/news/'),
        fetchWithErrorHandling<any>('/performance/').catch(() => null),
        fetchWithErrorHandling<any>('/forum/posts').catch(() => null)
      ]);

      // Transform API responses to match our data structure
      const formattedData: DashboardData = {
        currencyPairs: pricesResponse?.map(pair => ({
          pair: pair.pair,
          price: pair.price.toFixed(4),
          change: `${pair.change > 0 ? '+' : ''}${pair.change.toFixed(2)}%`,
          positive: pair.change >= 0
        })) || [],

        // Use real API data with fallbacks
        performanceData: performanceResponse?.by_day?.map((day: any) => ({
          day: day.day,
          value: day.net_pct
        })) || generateSamplePerformanceData(),
        news: newsResponse?.top_news?.map((article: any) => ({
          id: article.headline || Math.random().toString(),
          headline: article.headline,
          title: article.headline,
          summary: article.summary,
          published_at: article.time,
          time: article.time,
          source: article.source,
          url: article.url,
          sentiment: article.sentiment
        })) || [],
        communityPosts: forumResponse?.posts?.slice(0, 5)?.map((post: any) => ({
          id: post.id,
          author: post.author?.name || 'Anonymous',
          content: post.content,
          likes: post.like_count || 0,
          comments: post.comment_count || 0,
          timeAgo: new Date(post.created_at).toLocaleDateString(),
          time: post.created_at,
          replies: post.comment_count || 0,
          avatar: '/default-avatar.png'
        })) || [],
        swingData: generateSampleTradingData('Swing'),
        scalpData: generateSampleTradingData('Scalp')
      };

      setData(formattedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
        if (showLoadingSpinner) {
            setLoading(false);
        }
    }
  }, []);

  // Helper functions for sample data generation
  const generateSamplePerformanceData = (): { day: string; value: number }[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      value: Math.floor(Math.random() * 200) - 50
    }));
  };

  const generateSampleTradingData = (type: 'Swing' | 'Scalp'): { name: string; value: number }[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValue = type === 'Swing' ? 10 : 5;
    return months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 20) + baseValue
    }));
  };

  useEffect(() => {
    fetchDashboardData(true); // Initial fetch with loading spinner

    const intervalId = setInterval(() => {
      fetchDashboardData(false); // Subsequent fetches without loading spinner
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchDashboardData]);

  return { data, loading, error, refetch: () => fetchDashboardData(true) };
};

export default useDashboardData;
