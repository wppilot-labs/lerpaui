"use client";

import React, { useId } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface AuroraStatCardProps {
  label?: string;
  value?: string;
  delta?: number;
  series?: number[];
  className?: string;
}

/**
 * Signature KPI card — large readable value with an aurora-glow sparkline.
 * Production scale (not preview-sized) and fully theme-aware (light + dark via tokens).
 */
export function AuroraStatCard({
  label = "Monthly revenue",
  value = "$48,250",
  delta = 12.4,
  series = [12, 18, 14, 22, 19, 28, 26, 34, 31, 42],
  className,
}: AuroraStatCardProps) {
  const reduced = usePrefersReducedMotion();
  const gid = useId().replace(/:/g, "");
  const up = delta >= 0;

  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * 100;
    const y = 32 - ((v - min) / span) * 28 - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L100,34 L0,34 Z`;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
            up ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-red-500/12 text-red-600 dark:text-red-400",
          )}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta)}%
        </span>
      </div>

      <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{value}</p>

      <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="mt-4 h-16 w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary, currentColor)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-primary, currentColor)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`stroke-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary, currentColor)" />
            <stop offset="100%" stopColor="var(--color-primary, currentColor)" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#fill-${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={`url(#stroke-${gid})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary [stroke-dasharray:240] [stroke-dashoffset:0]"
          style={reduced ? undefined : { animation: "aurora-draw 1.6s ease-out both" }}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.8" className="fill-primary" />
      </svg>

      <style>{`@keyframes aurora-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}`}</style>
    </div>
  );
}
