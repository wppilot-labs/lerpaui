import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../lib/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  timeframe?: string;
  icon?: React.ReactNode;
  trendLabel?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, change, changeType, timeframe, icon, trendLabel, ...props }, ref) => {
    const defaultChangeType = change !== undefined
      ? change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
      : changeType;

    const isPositive = defaultChangeType === 'positive';
    const isNegative = defaultChangeType === 'negative';

    return (
      <Card ref={ref} className={cn('overflow-hidden relative', className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            {icon && (
              <div className="p-2 bg-muted rounded-md text-muted-foreground">
                {icon}
              </div>
            )}
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              {value != null && value !== '' && (
                <h4 className="text-3xl font-bold tracking-tight text-foreground">{value}</h4>
              )}
            </div>
          </div>
          {(change !== undefined || timeframe || trendLabel) && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              {change !== undefined && (
                <span
                  className={cn(
                    'flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-full',
                    isPositive && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    isNegative && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                    !isPositive && !isNegative && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isPositive && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                  {isNegative && <ArrowDownRight className="h-3 w-3 shrink-0" />}
                  {Math.abs(change)}%
                </span>
              )}
              {trendLabel && <span className="text-muted-foreground font-medium">{trendLabel}</span>}
              {timeframe && <span className="text-muted-foreground/80">{timeframe}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
StatCard.displayName = 'StatCard';

export { StatCard };
