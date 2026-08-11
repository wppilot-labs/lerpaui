'use client';

import React from 'react';
import { CloudCog, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../lib/cn';

export type ConnectionStatus = 'online' | 'offline' | 'degraded';

export interface ConnectionStatusBannerProps {
  status?: ConnectionStatus;
  autoDetect?: boolean;
  onRetry?: () => void | Promise<void>;
  className?: string;
  messages?: Partial<Record<ConnectionStatus, string>>;
}

const DEFAULT_MESSAGES: Record<ConnectionStatus, string> = {
  online: 'You are connected. Changes will sync automatically.',
  offline: 'You are offline. Changes will remain on this device until the connection returns.',
  degraded: 'The connection is unstable. Some updates may take longer than usual.',
};

export function ConnectionStatusBanner({
  status,
  autoDetect = false,
  onRetry,
  className,
  messages,
}: ConnectionStatusBannerProps) {
  const [detectedStatus, setDetectedStatus] = React.useState<ConnectionStatus>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online'
  );
  const [retrying, setRetrying] = React.useState(false);
  const [retryFailed, setRetryFailed] = React.useState(false);

  React.useEffect(() => {
    if (!autoDetect || typeof window === 'undefined') return;
    const update = () => setDetectedStatus(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [autoDetect]);

  const current = status ?? detectedStatus;
  const details = { ...DEFAULT_MESSAGES, ...messages };
  const Icon = current === 'online' ? Wifi : current === 'offline' ? WifiOff : CloudCog;

  const retry = async () => {
    if (!onRetry || retrying) return;
    setRetrying(true);
    setRetryFailed(false);
    try {
      await onRetry();
    } catch {
      setRetryFailed(true);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      data-status={current}
      className={cn(
        'flex w-full max-w-2xl items-start gap-3 rounded-xl border p-4 text-sm',
        current === 'online' &&
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
        current === 'offline' && 'border-destructive/30 bg-destructive/10 text-foreground',
        current === 'degraded' && 'border-amber-500/30 bg-amber-500/10 text-foreground',
        className
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold capitalize">{current}</p>
        <p className="mt-0.5 text-current/75">
          {retryFailed ? 'Retry failed. Check your connection and try again.' : details[current]}
        </p>
      </div>
      {current !== 'online' && onRetry ? (
        <button
          type="button"
          onClick={retry}
          disabled={retrying}
          aria-busy={retrying}
          className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border border-current/20 bg-background/70 px-3 py-1.5 font-semibold text-foreground hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {retrying ? (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
            />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          Retry
        </button>
      ) : null}
    </div>
  );
}

export default ConnectionStatusBanner;
