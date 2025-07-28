import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs ${changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {changeType === 'increase' ? (
            <ArrowUp className="inline h-3 w-3" />
          ) : (
            <ArrowDown className="inline h-3 w-3" />
          )}{" "}
          {change}% from last month
        </div>
      </CardContent>
    </Card>
  );
}
