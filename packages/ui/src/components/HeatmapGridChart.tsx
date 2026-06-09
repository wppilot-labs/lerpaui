"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface HeatmapGridChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Flat list of daily counts (one per day, chronological). Defaults to a
   * generated ~17-week contribution-style sample.
   */
  data?: number[];
  /** Number of rows (days per week). Default 7. */
  rows?: number;
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Base color for filled cells (intensity via opacity). */
  color?: string;
}

function makeSample(weeks = 17, rows = 7): number[] {
  const out: number[] = [];
  for (let i = 0; i < weeks * rows; i++) {
    // Deterministic pseudo-random so SSR and client agree.
    const s = Math.sin(i * 12.9898) * 43758.5453;
    const r = s - Math.floor(s);
    const day = i % rows;
    const weekend = day >= 5 ? 0.45 : 1; // lighter weekends
    out.push(Math.round(Math.max(0, (r * 4 + (r > 0.7 ? 2 : 0)) * weekend)));
  }
  return out;
}

const LEVELS = 4;

/**
 * Calendar / contribution-style heatmap grid (rows × weeks) with an intensity
 * legend. Cells fade in on a diagonal wave. Renders generated sample data with
 * no props.
 */
export function HeatmapGridChart({
  data,
  rows = 7,
  title = "Activity",
  subtitle = "Last 17 weeks",
  color = "var(--accent)",
  className,
  ...rest
}: HeatmapGridChartProps) {
  const reduced = usePrefersReducedMotion();
  const series = useMemo(() => data ?? makeSample(17, rows), [data, rows]);

  const { cols, max, total, cell, gap } = useMemo(() => {
    const hi = Math.max(...series, 1);
    const c = Math.ceil(series.length / rows);
    const sum = series.reduce((a, b) => a + b, 0);
    return { cols: c, max: hi, total: sum, cell: 13, gap: 3 };
  }, [series, rows]);

  const W = cols * (cell + gap) - gap;
  const H = rows * (cell + gap) - gap;

  const levelFor = (v: number) => (v <= 0 ? 0 : Math.min(LEVELS, Math.ceil((v / max) * LEVELS)));
  const opacityFor = (lvl: number) => (lvl === 0 ? 0 : 0.18 + (lvl / LEVELS) * 0.82);

  return (
    <div
      role="img"
      aria-label={`${title} heatmap, ${subtitle}. ${total} total across ${series.length} days; peak ${max} in a day.`}
      className={cn(
        "w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>
          {subtitle}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full" aria-hidden="true">
        {series.map((v, idx) => {
          const cIdx = Math.floor(idx / rows);
          const rIdx = idx % rows;
          const lvl = levelFor(v);
          const x = cIdx * (cell + gap);
          const y = rIdx * (cell + gap);
          return (
            <motion.rect
              key={idx}
              x={x}
              y={y}
              width={cell}
              height={cell}
              rx="2.5"
              fill={lvl === 0 ? "var(--edge)" : color}
              fillOpacity={lvl === 0 ? 1 : opacityFor(lvl)}
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : (cIdx + rIdx) * 0.012, ease: "easeOut" }}
              style={{ transformOrigin: `${x + cell / 2}px ${y + cell / 2}px` }}
            />
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px]" style={{ color: "var(--text-3)" }}>
        <span>Less</span>
        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--edge)" }} aria-hidden="true" />
        {Array.from({ length: LEVELS }, (_, i) => (
          <span
            key={i}
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: color, opacity: opacityFor(i + 1) }}
            aria-hidden="true"
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default HeatmapGridChart;
