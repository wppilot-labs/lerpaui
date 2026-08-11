'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Clock3, File, RefreshCw, Trash2, Upload } from 'lucide-react';
import { cn } from '../lib/cn';

export type UploadQueueStatus = 'queued' | 'uploading' | 'complete' | 'error';

export interface UploadQueueItem {
  id: string;
  name: string;
  size?: string;
  progress?: number;
  status: UploadQueueStatus;
  error?: string;
}

export interface UploadQueueProps {
  items?: UploadQueueItem[];
  heading?: string;
  onRetry?: (item: UploadQueueItem) => void;
  onRemove?: (item: UploadQueueItem) => void;
  className?: string;
}

const DEFAULT_ITEMS: UploadQueueItem[] = [
  { id: 'brief', name: 'project-brief.pdf', size: '1.8 MB', progress: 100, status: 'complete' },
  { id: 'assets', name: 'brand-assets.zip', size: '14.2 MB', progress: 62, status: 'uploading' },
  { id: 'notes', name: 'release-notes.md', size: '18 KB', progress: 0, status: 'queued' },
];

const STATUS_LABEL: Record<UploadQueueStatus, string> = {
  queued: 'Queued',
  uploading: 'Uploading',
  complete: 'Complete',
  error: 'Upload failed',
};

export function UploadQueue({
  items = DEFAULT_ITEMS,
  heading = 'Upload queue',
  onRetry,
  onRemove,
  className,
}: UploadQueueProps) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'w-full max-w-xl rounded-2xl border border-border bg-card p-4 shadow-sm',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2
          id={headingId}
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <Upload aria-hidden="true" className="h-4 w-4 text-primary" />
          {heading}
        </h2>
        <span className="text-xs tabular-nums text-muted-foreground">{items.length} files</span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No files are waiting to upload.
        </p>
      ) : (
        <ul className="space-y-2" aria-live="polite">
          {items.map((item) => {
            const progress = Math.max(0, Math.min(100, item.progress ?? 0));
            const StatusIcon =
              item.status === 'complete'
                ? CheckCircle2
                : item.status === 'error'
                  ? AlertCircle
                  : item.status === 'queued'
                    ? Clock3
                    : File;
            return (
              <li key={item.id} className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-start gap-3">
                  <StatusIcon
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 h-5 w-5 shrink-0 text-muted-foreground',
                      item.status === 'complete' && 'text-emerald-500',
                      item.status === 'error' && 'text-destructive',
                      item.status === 'uploading' && 'text-primary'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.size}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.error ?? STATUS_LABEL[item.status]}
                    </p>
                    {item.status === 'uploading' || item.status === 'queued' ? (
                      <div
                        role="progressbar"
                        aria-label={`${item.name} upload progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {item.status === 'error' && onRetry ? (
                      <button
                        type="button"
                        onClick={() => onRetry(item)}
                        aria-label={`Retry ${item.name}`}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <RefreshCw aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : null}
                    {onRemove ? (
                      <button
                        type="button"
                        onClick={() => onRemove(item)}
                        aria-label={`Remove ${item.name}`}
                        className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default UploadQueue;
