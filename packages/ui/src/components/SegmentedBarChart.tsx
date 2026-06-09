"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Horizontal stacked bar split into colored segments with legend and totals. */
export interface BarSegment {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface SegmentedBarChartProps {
  segments?: BarSegment[];
  title?: string;
  formatValue?: (v: number) => string;
  className?: string;
  height?: number;
  showLegend?: boolean;
}

const palette = [
  'var(--chart-1, #0ea5e9)',
  'var(--chart-2, #22c55e)',
  'var(--chart-3, #facc15)',
  'var(--chart-4, #a855f7)',
  'var(--chart-5, #ef4444)',
  'var(--chart-6, #14b8a6)',
];

const demo: BarSegment[] = [
  { id: 'product', label: 'Product', value: 4200 },
  { id: 'engineering', label: 'Engineering', value: 6800 },
  { id: 'support', label: 'Support', value: 1900 },
  { id: 'marketing', label: 'Marketing', value: 3100 },
];

export function SegmentedBarChart({
  segments,
  title = 'Allocation',
  formatValue = (v) => v.toLocaleString(),
  className,
  height = 24,
  showLegend = true,
}: SegmentedBarChartProps) {
  const data = (segments ?? demo).map((s, i) => ({ ...s, color: s.color ?? palette[i % palette.length] }));
  const [hover, setHover] = React.useState<string | null>(null);
  const total = data.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 text-card-foreground', className)}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{formatValue(total)}</span>
      </div>
      <div
        role="img" aria-label={`${title} chart, total ${formatValue(total)}`}
        style={{ height }}
        className="flex overflow-hidden rounded-md border border-border bg-muted/30"
      >
        {data.map((s) => {
          const pct = (s.value / total) * 100;
          const dim = hover && hover !== s.id;
          return (
            <button
              type="button"
              key={s.id}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.id)}
              onBlur={() => setHover(null)}
              aria-label={`${s.label}: ${formatValue(s.value)} (${pct.toFixed(1)}%)`}
              style={{ width: `${pct}%`, background: s.color, opacity: dim ? 0.4 : 1 }}
              className="relative h-full transition-opacity duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 motion-reduce:transition-none"
              title={`${s.label}: ${formatValue(s.value)}`}
            >
              {pct >= 8 && <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white/90 mix-blend-overlay">{pct.toFixed(0)}%</span>}
            </button>
          );
        })}
      </div>
      {showLegend && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {data.map((s) => {
            const pct = (s.value / total) * 100;
            const dim = hover && hover !== s.id;
            return (
              <li
                key={s.id}
                onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
                style={{ opacity: dim ? 0.5 : 1 }}
                className="flex items-center gap-1.5 text-xs transition-opacity duration-150 motion-reduce:transition-none"
              >
                <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="text-foreground">{s.label}</span>
                <span className="font-mono text-muted-foreground">{formatValue(s.value)} ({pct.toFixed(1)}%)</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

SegmentedBarChart.displayName = 'SegmentedBarChart';
