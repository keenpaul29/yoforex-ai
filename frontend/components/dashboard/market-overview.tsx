import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MarketPair {
  pair: string;
  price: string;
  change: number;
  high: string;
  low: string;
  volume: string;
}

const defaultMarketData: MarketPair[] = [
  {
    pair: 'EUR/USD',
    price: '1.0923',
    change: 0.24,
    high: '1.0956',
    low: '1.0890',
    volume: '1.2M',
  },
  {
    pair: 'GBP/USD',
    price: '1.2745',
    change: -0.12,
    high: '1.2768',
    low: '1.2712',
    volume: '890.5K',
  },
  {
    pair: 'USD/JPY',
    price: '149.87',
    change: 0.45,
    high: '150.12',
    low: '149.25',
    volume: '2.1M',
  },
  {
    pair: 'AUD/USD',
    price: '0.6621',
    change: -0.08,
    high: '0.6645',
    low: '0.6601',
    volume: '750.3K',
  },
  {
    pair: 'USD/CAD',
    price: '1.3542',
    change: 0.15,
    high: '1.3567',
    low: '1.3521',
    volume: '980.7K',
  },
];

interface MarketOverviewProps {
  marketData?: MarketPair[];
}

export function MarketOverview({ marketData = defaultMarketData }: MarketOverviewProps) {
  const columns = [
    {
      key: 'pair',
      header: 'Pair',
      render: (row: MarketPair) => (
        <span className="font-medium">{row.pair}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      className: 'text-right',
      render: (row: MarketPair) => (
        <span className="font-mono">{row.price}</span>
      ),
    },
    {
      key: 'change',
      header: '24h Change',
      className: 'text-right',
      render: (row: MarketPair) => (
        <span className={`font-mono ${row.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {row.change >= 0 ? (
            <ArrowUpRight className="inline h-4 w-4" />
          ) : (
            <ArrowDownRight className="inline h-4 w-4" />
          )}
          {Math.abs(row.change)}%
        </span>
      ),
    },
    {
      key: 'highLow',
      header: '24h High/Low',
      className: 'text-right',
      render: (row: MarketPair) => (
        <span className="font-mono">
          {row.high}/{row.low}
        </span>
      ),
    },
    {
      key: 'volume',
      header: 'Volume',
      className: 'text-right',
      render: (row: MarketPair) => (
        <span className="font-mono">{row.volume}</span>
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={marketData}
          emptyMessage="No market data available"
          className="w-full"
          headerClassName="text-xs"
          rowClassName="text-sm"
        />
      </CardContent>
    </Card>
  );
}
