import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  status: 'completed' | 'pending' | 'failed';
  time: string;
}

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    pair: 'EUR/USD',
    amount: 1000,
    price: 1.0923,
    status: 'completed',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'sell',
    pair: 'GBP/USD',
    amount: 500,
    price: 1.2745,
    status: 'pending',
    time: '11:15 AM',
  },
  {
    id: '3',
    type: 'buy',
    pair: 'USD/JPY',
    amount: 2000,
    price: 149.87,
    status: 'completed',
    time: '01:45 PM',
  },
  {
    id: '4',
    type: 'sell',
    pair: 'AUD/USD',
    amount: 750,
    price: 0.6621,
    status: 'failed',
    time: '02:30 PM',
  },
  {
    id: '5',
    type: 'buy',
    pair: 'USD/CAD',
    amount: 1200,
    price: 1.3542,
    status: 'completed',
    time: '03:15 PM',
  },
];

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({ transactions = defaultTransactions }: RecentTransactionsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'buy' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.pair}</p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {transaction.type === 'buy' ? '+' : '-'}{transaction.amount}
                </div>
                <Badge variant={getStatusVariant(transaction.status)} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
