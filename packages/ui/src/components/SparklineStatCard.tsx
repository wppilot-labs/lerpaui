"use client";

import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface SparklineStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sparkline series. Defaults to a realistic upward trend. */
  data?: number[];
  /** Big headline metric. Defaults to the last data point formatted. */
  value?: string;
  /** Stat label above the value. */
  label?: string;
  /** Period-over-period change, in percent. Drives the trend arrow + color. */
  delta?: number;
  /** Caption shown next to the delta (e.g. "vs last week"). */
  deltaCaption?: string;
  /** Sparkline + accent color. */
  color?: string;
}

const DEFAULT_DATA = [12, 14, 11, 17, 16, 22, 19, 27, 24, 31, 29, 38];
const W = 200;
const H = 56;
const PAD = { t: 8, r: 4, b: 8, l: 4 };

/**
 * KPI stat card pairing a large value and trend delta with an animated
 * path-drawn sparkline. Renders sample data with no props.
 */
export function SparklineStatCard({
  data = DEFAULT_DATA,
  value,
  label = "Active users",
  delta = 12.4,
  deltaCaption = "vs last week",
  color = "var(--accent)",
  className,
  ...rest
}: SparklineStatCardProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");

  const { linePath, areaPath, last } = useMemo(() => {
    const series = data.length ? data : [0];
    const lo = Math.min(...series);
    const hi = Math.max(...series);
    const range = hi - lo || 1;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const pts = series.map((v, i) => {
      const x = PAD.l + (series.length === 1 ? iw / 2 : (i / (series.length - 1)) * iw);
      const y = PAD.t + ih - ((v - lo) / range) * ih;
      return [x, y] as const;
    });
    const ld = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const ad = `${ld} L${(W - PAD.r).toFixed(2)},${(H - PAD.b).toFixed(2)} L${PAD.l.toFixed(2)},${(H - PAD.b).toFixed(2)} Z`;
    return { linePath: ld, areaPath: ad, last: pts[pts.length - 1] };
  }, [data]);

  const up = delta >= 0;
  const deltaColor = up ? "var(--mint)" : "var(--pink)";
  const headline = value ?? String(data[data.length - 1] ?? 0);

  return (
    <div
      role="img"
      aria-label={`${label}: ${headline}, ${up ? "up" : "down"} ${Math.abs(delta)} percent ${deltaCaption}.`}
      className={cn(
        "w-full max-w-xs rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <div className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
        {label}
      </div>

      <div className="mb-3 flex items-end justify-between gap-3">
        <motion.span
          className="text-3xl font-bold tabular-nums leading-none"
          style={{ color: "var(--text)" }}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.span>

        <motion.span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
          style={{ color: deltaColor, background: "color-mix(in oklab, currentColor 14%, transparent)" }}
          initial={reduced ? false : { opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: reduced ? 0 : 0.25 }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: up ? "none" : "scaleY(-1)" }}>
            <path d="M5 1 L9 6 H6 V9 H4 V6 H1 Z" fill="currentColor" />
          </svg>
          {Math.abs(delta)}%
        </motion.span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-14 w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`spk-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={areaPath}
          fill={`url(#spk-fill-${uid})`}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.4 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r="2.75"
          fill={color}
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: reduced ? 0 : 1.05 }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
      </svg>

      <div className="mt-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>
        {deltaCaption}
      </div>
    </div>
  );
}

export default SparklineStatCard;
