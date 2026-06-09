"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, LineChart as ChartIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MultiLineTrendDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface TrendLineConfig {
  dataKey: string;
  name: string;
  strokeColor: string;
}

export interface MultiLineTrendChartProps {
  data: MultiLineTrendDataPoint[];
  lines: TrendLineConfig[];
  title?: string;
  description?: string;
  className?: string;
  showGrid?: boolean;
}

export const MultiLineTrendChart: React.FC<MultiLineTrendChartProps> = ({
  data,
  lines,
  title = "Trend Comparison",
  description = "Comparative multi-model benchmark evaluation",
  className,
  showGrid = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [_activePayload, setActivePayload] = useState<unknown>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR Safe Skeleton Loader
    return (
      <div className={cn("w-full h-[380px] rounded-3xl border border-border bg-card/50 p-6 flex flex-col gap-6 animate-pulse", className)}>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
        <div className="flex-1 bg-muted/40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full rounded-3xl border border-border bg-card/45 backdrop-blur-xl shadow-md p-6 flex flex-col gap-6",
      className
    )}>
      {/* Chart Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ChartIcon className="h-3.5 w-3.5 text-primary" /> {title}
          </span>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold font-mono border bg-muted border-border/80 text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          <span>Active Session</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="flex-1 h-[220px] w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activePayload) {
                setActivePayload(state.activePayload);
              }
            }}
            onMouseLeave={() => setActivePayload(null)}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border, rgba(229, 231, 235, 0.1))"
              />
            )}

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground, #6b7280)', fontSize: 10, fontFamily: 'monospace' }}
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground, #6b7280)', fontSize: 10, fontFamily: 'monospace' }}
              dx={-5}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const label = payload[0].payload.label;
                  return (
                    <div className="rounded-xl border border-border bg-card/90 backdrop-blur-md p-3 shadow-xl flex flex-col gap-2 text-xs min-w-[140px]">
                      <p className="font-mono text-[9px] text-muted-foreground uppercase font-bold border-b border-border/50 pb-1">{label}</p>
                      <div className="space-y-1.5">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {payload.map((entry: any) => (
                          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="font-medium text-foreground">{entry.name}</span>
                            </div>
                            <span className="font-mono font-bold text-foreground">
                              {entry.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{
                stroke: 'var(--border, rgba(229, 231, 235, 0.2))',
                strokeWidth: 1,
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => {
                if (!payload) return null;
                return (
                  <div className="flex justify-center gap-4 pt-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => (
                      <div key={`legend-${index}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="hover:text-foreground cursor-default transition-colors">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.strokeColor}
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  stroke: line.strokeColor,
                  strokeWidth: 1,
                  fill: 'var(--background)',
                }}
                activeDot={{
                  r: 6,
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                  fill: line.strokeColor,
                }}
                isAnimationActive={!prefersReducedMotion}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Accessibility hook inlined at the bottom
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
