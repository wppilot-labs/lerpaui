'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DataRefreshControlProps {
  label?: string;
  lastUpdated?: Date | string | number | null;
  onRefresh?: () => void | Promise<void>;
  className?: string;
}

function toDate(value: DataRefreshControlProps['lastUpdated']): Date | null {
  if (value === null || value === undefined) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function relativeTime(date: Date, now: number): string {
  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
}

export function DataRefreshControl({
  label = 'Refresh data',
  lastUpdated,
  onRefresh,
  className,
}: DataRefreshControlProps) {
  const initialDate = React.useRef(new Date());
  const [internalDate, setInternalDate] = React.useState(initialDate.current);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [now, setNow] = React.useState(() => Date.now());
  const externalDate = toDate(lastUpdated);
  const resolvedDate = lastUpdated === undefined ? internalDate : externalDate;

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError(false);
    try {
      await onRefresh?.();
      const completedAt = new Date();
      if (lastUpdated === undefined) setInternalDate(completedAt);
      setNow(completedAt.getTime());
    } catch {
      setError(true);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-card p-2 pl-3 shadow-sm',
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">Data status</p>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {error
            ? 'Refresh failed. Try again.'
            : resolvedDate
              ? `Updated ${relativeTime(resolvedDate, now)}`
              : 'Not refreshed yet'}
        </p>
      </div>
      <button
        type="button"
        onClick={refresh}
        disabled={refreshing}
        aria-busy={refreshing}
        className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {error ? (
          <AlertCircle aria-hidden="true" className="h-4 w-4" />
        ) : (
          <RefreshCw
            aria-hidden="true"
            className={cn('h-4 w-4', refreshing && 'animate-spin motion-reduce:animate-none')}
          />
        )}
        {refreshing ? 'Refreshing…' : label}
      </button>
    </div>
  );
}

export default DataRefreshControl;
