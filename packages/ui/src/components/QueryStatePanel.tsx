'use client';

import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  SearchX,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../lib/cn';

export type QueryState = 'loading' | 'empty' | 'error' | 'success';

export interface QueryStatePanelProps {
  state?: QueryState;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const COPY: Record<QueryState, { title: string; description: string }> = {
  loading: { title: 'Loading results', description: 'Fetching the latest data for this view.' },
  empty: {
    title: 'No matching results',
    description: 'Try changing or clearing your current filters.',
  },
  error: {
    title: 'Results could not be loaded',
    description: 'Check the connection and try again.',
  },
  success: { title: 'Results loaded', description: 'The latest data is ready.' },
};

export function QueryStatePanel({
  state = 'empty',
  title,
  description,
  onRetry,
  onClearFilters,
  children,
  className,
}: QueryStatePanelProps) {
  const headingId = React.useId();
  const Icon =
    state === 'loading'
      ? Loader2
      : state === 'error'
        ? AlertCircle
        : state === 'success'
          ? CheckCircle2
          : SearchX;
  const copy = COPY[state];

  return (
    <section
      role={state === 'error' ? 'alert' : 'status'}
      aria-live={state === 'error' ? 'assertive' : 'polite'}
      aria-busy={state === 'loading'}
      aria-labelledby={headingId}
      data-state={state}
      className={cn(
        'flex w-full max-w-xl flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center',
        className
      )}
    >
      <span
        className={cn(
          'mb-4 rounded-full bg-muted p-3 text-muted-foreground',
          state === 'error' && 'bg-destructive/10 text-destructive',
          state === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            'h-6 w-6',
            state === 'loading' && 'animate-spin motion-reduce:animate-none'
          )}
        />
      </span>
      <h2 id={headingId} className="font-semibold text-foreground">
        {title ?? copy.title}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description ?? copy.description}
      </p>

      {state === 'success' ? <div className="mt-4 w-full text-left">{children}</div> : null}
      {state === 'error' && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
      ) : null}
      {state === 'empty' && onClearFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          Clear filters
        </button>
      ) : null}
    </section>
  );
}

export default QueryStatePanel;
