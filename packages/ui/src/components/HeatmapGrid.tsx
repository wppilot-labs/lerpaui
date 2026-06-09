"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** GitHub-style 52w x 7d activity heatmap with tooltip and accessible bucket labels. */
export interface HeatmapDay {
  date: string;
  count: number;
}

export interface HeatmapGridProps {
  data?: HeatmapDay[];
  weeks?: number;
  colorScale?: string[];
  title?: string;
  className?: string;
  onSelectDay?: (day: HeatmapDay) => void;
}

const defaultScale = [
  'var(--muted, #f1f5f9)',
  'color-mix(in oklch, var(--accent, #38bdf8) 25%, transparent)',
  'color-mix(in oklch, var(--accent, #38bdf8) 50%, transparent)',
  'color-mix(in oklch, var(--accent, #38bdf8) 75%, transparent)',
  'var(--accent, #38bdf8)',
];

function generateDemo(weeks: number): HeatmapDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: HeatmapDay[] = [];
  const total = weeks * 7;
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const seed = (d.getDate() * 7 + d.getMonth() * 11 + d.getDay() * 3) % 30;
    days.push({ date: d.toISOString().slice(0, 10), count: Math.max(0, seed - 5) });
  }
  return days;
}

function bucket(count: number, max: number) {
  if (count <= 0) return 0;
  const ratio = count / Math.max(1, max);
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function HeatmapGrid({
  data,
  weeks = 52,
  colorScale = defaultScale,
  title = 'Activity',
  className,
  onSelectDay,
}: HeatmapGridProps) {
  const days = React.useMemo(() => data ?? generateDemo(weeks), [data, weeks]);
  const max = React.useMemo(() => days.reduce((m, d) => Math.max(m, d.count), 0), [days]);
  const total = days.reduce((sum, d) => sum + d.count, 0);

  const cols: HeatmapDay[][] = [];
  for (let w = 0; w < weeks; w++) cols.push(days.slice(w * 7, w * 7 + 7));

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 text-card-foreground', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{total.toLocaleString()} events</span>
      </div>
      <div className="flex gap-2 overflow-x-auto" role="grid" aria-label={`${title} heatmap, ${weeks} weeks`}>
        <div className="flex flex-col justify-between py-1 text-[10px] text-muted-foreground" aria-hidden="true">
          {DAY_LABELS.map((d, i) => <span key={i} className="h-3 leading-3">{d}</span>)}
        </div>
        <div className="flex gap-[3px]">
          {cols.map((week, wi) => (
            <div key={wi} role="row" className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day) return <div key={di} aria-hidden="true" className="size-3" />;
                const b = bucket(day.count, max);
                return (
                  <button
                    key={di}
                    type="button"
                    role="gridcell"
                    aria-label={`${day.date}: ${day.count} events`}
                    onClick={() => onSelectDay?.(day)}
                    style={{ background: colorScale[b], borderColor: 'color-mix(in oklch, currentColor 10%, transparent)' }}
                    className="size-3 rounded-sm border border-border/60 outline-none transition-transform hover:scale-125 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100"
                    title={`${day.date}: ${day.count}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {colorScale.map((c, i) => <span key={i} aria-hidden="true" className="size-3 rounded-sm border border-border/60" style={{ background: c }} />)}
        <span>More</span>
      </div>
    </div>
  );
}

HeatmapGrid.displayName = 'HeatmapGrid';
