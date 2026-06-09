"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AreaChartDataPoint {
  label: string;
  value: number;
  // Recharts-style generic data; consumer-defined extra series keyed by string.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ResponsiveAreaMetricChartProps {
  data: AreaChartDataPoint[];
  title?: string;
  description?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  dataKey?: string;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
  showGrid?: boolean;
}

export const ResponsiveAreaMetricChart: React.FC<ResponsiveAreaMetricChartProps> = ({
  data,
  title = "Metric Analysis",
  description = "Real-time stream stats",
  valuePrefix = "",
  valueSuffix = "",
  dataKey = "value",
  strokeColor = "var(--primary, #3b82f6)",
  fillColor: _fillColor = "rgba(59, 130, 246, 0.15)",
  className,
  showGrid = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredData, setHoveredData] = useState<AreaChartDataPoint | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const latestPoint = data[data.length - 1];
  const displayPoint = hoveredData || latestPoint;
  const displayValue = displayPoint ? displayPoint[dataKey] : 0;
  const displayLabel = displayPoint ? displayPoint.label : "";

  // Compute growth percentage compared to first value
  const growthPercentage = (() => {
    if (data.length < 2) return 0;
    const firstVal = data[0][dataKey];
    const lastVal = latestPoint[dataKey];
    if (firstVal === 0) return 0;
    return ((lastVal - firstVal) / firstVal) * 100;
  })();

  if (!mounted) {
    // SSR safe fallback skeleton loader
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
      {/* Chart Header displaying dynamic value on hover */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3 text-primary" /> {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-foreground tracking-tight transition-all duration-100">
              {valuePrefix}{displayValue.toLocaleString()}{valueSuffix}
            </span>
            {displayLabel && (
              <span className="text-xs text-muted-foreground ml-1.5 font-medium font-mono bg-muted/50 px-2 py-0.5 rounded-full">
                {displayLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Global trend pill */}
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono border",
          growthPercentage >= 0
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <TrendingUp className={cn("h-3.5 w-3.5", growthPercentage < 0 && "rotate-180")} />
          <span>{growthPercentage >= 0 ? "+" : ""}{growthPercentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* SVG Recharts Area Chart */}
      <div className="flex-1 h-[200px] w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                setHoveredData(state.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="areaMetricGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

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
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card/90 backdrop-blur-md p-3 shadow-xl flex flex-col gap-1 text-xs">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase font-bold">{dataPoint.label}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: strokeColor }} />
                        <span className="font-semibold text-foreground">
                          {valuePrefix}{dataPoint[dataKey].toLocaleString()}{valueSuffix}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{
                stroke: strokeColor,
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              fill="url(#areaMetricGrad)"
              activeDot={{
                r: 6,
                stroke: 'var(--background)',
                strokeWidth: 2,
                fill: strokeColor,
              }}
              isAnimationActive={!prefersReducedMotion}
            />
          </AreaChart>
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
