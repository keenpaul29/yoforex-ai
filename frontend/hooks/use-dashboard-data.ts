import { useEffect, useState } from 'react';
import { MarketPair } from '@/components/dashboard/market-overview';
import { Transaction } from '@/components/dashboard/recent-transactions';

interface DashboardStats {
  totalBalance: string;
  todaysPL: string;
  openTrades: number;
  winRate: number;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
    }[];
  };
  marketData: MarketPair[];
  recentTransactions: Transaction[];
}

const useDashboardData = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would be an API call
        const mockData: DashboardStats = {
          totalBalance: '$24,780.00',
          todaysPL: '+$245.50',
          openTrades: 12,
          winRate: 68.5,
          chartData: {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            datasets: [{
              label: 'EUR/USD',
              data: Array.from({ length: 30 }, () => Math.random() * 1000 + 1000),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              fill: true,
            }],
          },
          marketData: [
            {
              pair: 'EUR/USD',
              price: '1.0923',
              change: 0.24,
              high: '1.0956',
              low: '1.0890',
              volume: '1.2M',
            },
            // ... other market data
          ],
          recentTransactions: [
            // ... transaction data
          ],
        };

        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      // Re-fetch logic would go here
      setTimeout(() => setIsLoading(false), 1000);
    },
  };
};

export default useDashboardData;
