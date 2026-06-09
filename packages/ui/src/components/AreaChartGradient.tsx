"use client";

import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface AreaChartGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Numeric series to plot. Defaults to a realistic revenue trend. */
  data?: number[];
  /** X-axis tick labels, aligned to data points (sampled if longer). */
  labels?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Accent color used for the line + gradient fill. */
  color?: string;
}

const DEFAULT_DATA = [18, 24, 21, 33, 29, 42, 38, 51, 47, 63, 58, 72];
const DEFAULT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const W = 320;
const H = 160;
const PAD = { t: 12, r: 8, b: 22, l: 8 };

/**
 * Animated area chart with a soft gradient fill, horizontal gridlines and
 * x-axis labels. Renders a sample series with no props.
 */
export function AreaChartGradient({
  data = DEFAULT_DATA,
  labels = DEFAULT_LABELS,
  title = "Revenue",
  subtitle = "Last 12 months",
  color = "var(--accent)",
  className,
  ...rest
}: AreaChartGradientProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");

  const { linePath, areaPath, points, max, min } = useMemo(() => {
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
    return { linePath: ld, areaPath: ad, points: pts, max: hi, min: lo };
  }, [data]);

  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));
  const tickStep = Math.max(1, Math.ceil(labels.length / 6));

  return (
    <div
      role="img"
      aria-label={`${title} area chart, ${subtitle}. Ranges from ${min} to ${max} across ${data.length} points.`}
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

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`acg-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridY.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--edge)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        <motion.path
          d={areaPath}
          fill={`url(#acg-fill-${uid})`}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        />

        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        <motion.circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r="3.5"
          fill={color}
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 1.15 }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />

        {labels.map((lab, i) =>
          i % tickStep === 0 || i === labels.length - 1 ? (
            <text
              key={i}
              x={PAD.l + (labels.length === 1 ? (W - PAD.l - PAD.r) / 2 : (i / (labels.length - 1)) * (W - PAD.l - PAD.r))}
              y={H - 6}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-3)"
            >
              {lab}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

export default AreaChartGradient;
