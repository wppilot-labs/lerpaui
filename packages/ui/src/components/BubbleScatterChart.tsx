"use client";

import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface BubblePoint {
  /** Horizontal position, in data units. */
  x: number;
  /** Vertical position, in data units. */
  y: number;
  /** Magnitude → bubble radius. */
  r: number;
  /** Optional per-bubble color override. */
  color?: string;
  /** Optional category label (used in the aria summary). */
  label?: string;
}

export interface BubbleScatterChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bubbles to plot. Defaults to a sample distribution. */
  data?: BubblePoint[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Default bubble color. */
  color?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)", "var(--mint)"];

const DEFAULT_DATA: BubblePoint[] = [
  { x: 12, y: 30, r: 18 },
  { x: 28, y: 52, r: 30 },
  { x: 40, y: 22, r: 14 },
  { x: 55, y: 68, r: 40 },
  { x: 62, y: 40, r: 22 },
  { x: 74, y: 58, r: 26 },
  { x: 85, y: 78, r: 34 },
  { x: 92, y: 34, r: 16 },
];
const W = 320;
const H = 200;
const PAD = { t: 12, r: 16, b: 16, l: 16 };

/**
 * Scatter / bubble plot where bubbles scale in with a stagger over axis
 * gridlines. Bubble radius encodes a third dimension. Renders sample data with
 * no props.
 */
export function BubbleScatterChart({
  data = DEFAULT_DATA,
  title = "Reach vs engagement",
  subtitle = "bubble = budget",
  color = "var(--accent)",
  className,
  ...rest
}: BubbleScatterChartProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");

  const { bubbles } = useMemo(() => {
    const series = data.length ? data : [{ x: 0, y: 0, r: 1 }];
    const xs = series.map((d) => d.x);
    const ys = series.map((d) => d.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const xRange = xMax - xMin || 1;
    const yRange = yMax - yMin || 1;
    const rMax = Math.max(...series.map((d) => d.r), 1);
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const arr = series.map((d, i) => ({
      cx: PAD.l + ((d.x - xMin) / xRange) * iw,
      cy: PAD.t + ih - ((d.y - yMin) / yRange) * ih,
      r: 4 + (d.r / rMax) * 18,
      color: d.color ?? PALETTE[i % PALETTE.length] ?? color,
    }));
    return { bubbles: arr };
  }, [data, color]);

  const gridX = [0.25, 0.5, 0.75].map((t) => PAD.l + t * (W - PAD.l - PAD.r));
  const gridY = [0.25, 0.5, 0.75].map((t) => PAD.t + t * (H - PAD.t - PAD.b));

  return (
    <div
      role="img"
      aria-label={`${title} bubble scatter chart, ${subtitle}. ${data.length} points plotted.`}
      className={cn(
        "w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>
          {subtitle}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id={`bub-${uid}`} cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="none" stroke="var(--edge)" strokeWidth="1" rx="4" />
        {gridX.map((x, i) => (
          <line key={`gx${i}`} x1={x} y1={PAD.t} x2={x} y2={H - PAD.b} stroke="var(--edge)" strokeWidth="1" strokeDasharray="2 5" />
        ))}
        {gridY.map((y, i) => (
          <line key={`gy${i}`} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--edge)" strokeWidth="1" strokeDasharray="2 5" />
        ))}

        {bubbles.map((b, i) => (
          <motion.g
            key={i}
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: reduced ? 0 : 0.1 + i * 0.07 }}
            style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
          >
            <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.color} fillOpacity={0.55} stroke={b.color} strokeWidth="1.5" />
            <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#bub-${uid})`} />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default BubbleScatterChart;
