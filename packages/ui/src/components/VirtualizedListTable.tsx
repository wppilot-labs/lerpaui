"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Windowed virtual list/table — only renders visible rows for tens of thousands of items. */
export interface VirtualizedListTableProps<T> {
  items?: T[];
  itemHeight?: number;
  height?: number;
  overscan?: number;
  renderRow?: (item: T, index: number) => React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface DemoRow { id: number; name: string; email: string; amount: string }

const demoItems: DemoRow[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  name: `User #${(i + 1).toString().padStart(4, '0')}`,
  email: `user${i + 1}@lerpaui.com`,
  amount: `$${(Math.random() * 9999).toFixed(2)}`,
}));

const DefaultRow = (item: unknown, index: number) => {
  const row = item as DemoRow;
  return (
    <div className="grid grid-cols-[60px_1fr_1fr_120px] items-center px-3 text-sm">
      <span className="text-muted-foreground">#{index + 1}</span>
      <span className="truncate font-medium text-foreground">{row.name}</span>
      <span className="truncate text-muted-foreground">{row.email}</span>
      <span className="text-right font-mono text-foreground">{row.amount}</span>
    </div>
  );
};

export function VirtualizedListTable<T>({
  items,
  itemHeight = 36,
  height = 360,
  overscan = 4,
  renderRow,
  className,
  ariaLabel = 'Virtualized list',
}: VirtualizedListTableProps<T>) {
  const rows = (items ?? (demoItems as unknown as T[])) as T[];
  const render = (renderRow ?? (DefaultRow as unknown as (item: T, i: number) => React.ReactNode));
  const [scrollTop, setScrollTop] = React.useState(0);

  const total = rows.length;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(total, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemHeight;

  const slice = rows.slice(startIndex, endIndex);

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-rowcount={total}
      onScroll={(e) => setScrollTop((e.currentTarget as HTMLDivElement).scrollTop)}
      style={{ height }}
      className={cn('overflow-auto rounded-lg border border-border bg-card text-foreground', className)}
    >
      <div style={{ height: total * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', left: 0, right: 0, top: 0 }}>
          {slice.map((item, i) => (
            <div
              key={startIndex + i}
              role="row"
              aria-rowindex={startIndex + i + 1}
              style={{ height: itemHeight }}
              className="flex items-center border-b border-border last:border-b-0 hover:bg-muted/30"
            >
              {render(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

VirtualizedListTable.displayName = 'VirtualizedListTable';
