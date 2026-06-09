"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface HolographicPieChartProps {
  data: PieChartDataPoint[];
  title?: string;
  description?: string;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
}

// Custom shape rendering for the hovered active slice. Recharts passes a loose
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// payload object; consuming it as `any` is the recharts-recommended pattern.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload: _payload, percent: _percent, value: _value
  } = props;
  
  // Calculate offset for separation/explosion
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (10 * cos);
  const sy = cy + (10 * sin);
  
  return (
    <g>
      {/* Outer Glow Halo Ring */}
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.35}
        className="blur-[2px]"
      />
      {/* Exploded Active Slice Sector */}
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const HolographicPieChart: React.FC<HolographicPieChartProps> = ({
  data,
  title = "Distribution",
  description = "Category ratio breakdown",
  className,
  innerRadius = 60,
  outerRadius = 80,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const activePoint = data[activeIndex] || data[0];
  const activePercentage = totalValue > 0 ? ((activePoint.value / totalValue) * 100).toFixed(1) : "0";

  if (!mounted) {
    // SSR Safe Loader Skeleton
    return (
      <div className={cn("w-full h-[360px] rounded-3xl border border-border bg-card/50 p-6 flex flex-col items-center justify-center animate-pulse", className)}>
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-32 w-32 rounded-full border-8 border-muted" />
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full rounded-3xl border border-border bg-card/45 backdrop-blur-xl shadow-md p-6 flex flex-col gap-6",
      className
    )}>
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PieIcon className="h-3.5 w-3.5 text-primary" /> {title}
        </span>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Grid containing Chart and Legend */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Pie Chart */}
        <div className="md:col-span-7 h-[220px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={prefersReducedMotion ? undefined : renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 focus:outline-none"
                    style={{
                      filter: activeIndex === index ? `drop-shadow(0 0 12px ${entry.color}66)` : 'none'
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Absolute Holographic Donut Center Overlay */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              {activePoint.name}
            </span>
            <span className="text-xl font-black text-foreground tracking-tight">
              {activePercentage}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono font-medium">
              {activePoint.value.toLocaleString()} units
            </span>
          </div>
        </div>

        {/* Right: Legends Detail Overlay */}
        <div className="md:col-span-5 flex flex-col gap-2.5">
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/80 mb-1 border-b border-border/50 pb-1 flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-primary" /> Slices Details
          </span>
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {data.map((item, index) => {
              const isSelected = activeIndex === index;
              const ratio = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0";

              return (
                <button
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all duration-200",
                    isSelected
                      ? "bg-card border-border/80 shadow-sm scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: isSelected ? `0 0 8px ${item.color}` : 'none'
                      }}
                    />
                    <span className="text-xs font-bold text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[11px] font-semibold">
                    <span className="text-foreground">{item.value.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1.5">({ratio}%)</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
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
