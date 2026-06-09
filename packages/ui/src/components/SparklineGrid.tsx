"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Grid of mini sparkline cards — each cell shows a metric, value, and trend line. */
export interface SparklineCell {
  id: string;
  label: string;
  value: string | number;
  delta?: number;
  data: number[];
  color?: string;
}

export interface SparklineGridProps {
  cells?: SparklineCell[];
  columns?: number;
  className?: string;
}

function randomSeries(seed: number, length = 20) {
  const out: number[] = [];
  let v = 50;
  for (let i = 0; i < length; i++) {
    v += Math.sin(seed * (i + 1)) * 8 + Math.cos(seed * (i * 0.7)) * 5;
    out.push(Math.max(5, Math.min(95, v)));
  }
  return out;
}

const demo: SparklineCell[] = [
  { id: '1', label: 'Active users', value: '12.4K', delta: 8.2, data: randomSeries(1.1), color: 'var(--chart-1, #0ea5e9)' },
  { id: '2', label: 'Revenue', value: '$48,210', delta: 3.4, data: randomSeries(0.7), color: 'var(--chart-2, #22c55e)' },
  { id: '3', label: 'Errors', value: 27, delta: -12.7, data: randomSeries(1.9), color: 'var(--chart-3, #ef4444)' },
  { id: '4', label: 'Latency p95', value: '142ms', delta: -2.1, data: randomSeries(0.4), color: 'var(--chart-4, #a855f7)' },
  { id: '5', label: 'Signups', value: 318, delta: 14.5, data: randomSeries(2.2), color: 'var(--chart-5, #facc15)' },
  { id: '6', label: 'Churn', value: '1.8%', delta: -0.4, data: randomSeries(0.9), color: 'var(--chart-6, #f97316)' },
];

function buildPath(data: number[], w: number, h: number): string {
  if (data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / Math.max(1, data.length - 1);
  return data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function Spark({ data, color, width = 120, height = 36 }: { data: number[]; color: string; width?: number; height?: number }) {
  const path = buildPath(data, width, height);
  const areaPath = `${path} L${width},${height} L0,${height} Z`;
  const gradId = React.useId();
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparklineGrid({ cells = demo, columns = 3, className }: SparklineGridProps) {
  return (
    <div role="list" aria-label="Metric sparklines" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={cn('grid gap-3', className)}>
      {cells.map((c) => {
        const positive = (c.delta ?? 0) >= 0;
        const color = c.color ?? 'var(--chart-1, #0ea5e9)';
        return (
          <div key={c.id} role="listitem"
            className="rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm transition-all duration-150 hover:shadow-md motion-reduce:transition-none">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              {c.delta !== undefined && (
                <span className={cn('text-[10px] font-mono tabular-nums', positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                  {positive ? '+' : ''}{c.delta.toFixed(1)}%
                </span>
              )}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{c.value}</div>
            <div className="mt-1">
              <Spark data={c.data} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

SparklineGrid.displayName = 'SparklineGrid';
