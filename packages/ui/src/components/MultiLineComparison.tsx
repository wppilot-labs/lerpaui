"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface ComparisonSeries {
  label: string;
  /** One value per x position (aligned to `labels`). */
  values: number[];
  /** CSS color; defaults cycle through the theme palette. */
  color?: string;
}

export interface MultiLineComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Two or three series to compare. Defaults to sample data. */
  series?: ComparisonSeries[];
  /** X-axis labels. */
  labels?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const PALETTE = ["var(--accent)", "var(--violet)", "var(--amber)"];

const DEFAULT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_SERIES: ComparisonSeries[] = [
  { label: "This week", values: [22, 30, 27, 38, 34, 45, 41] },
  { label: "Last week", values: [18, 21, 25, 24, 29, 31, 30] },
];
const W = 320;
const H = 180;
const PAD = { t: 14, r: 12, b: 24, l: 12 };

/**
 * Two-to-three series line chart with a legend and gridlines. Strokes draw in
 * with a stagger. Renders sample data with no props.
 */
export function MultiLineComparison({
  series = DEFAULT_SERIES,
  labels = DEFAULT_LABELS,
  title = "Sessions",
  subtitle = "Week over week",
  className,
  ...rest
}: MultiLineComparisonProps) {
  const reduced = usePrefersReducedMotion();

  const colored = useMemo(
    () => series.map((s, i) => ({ ...s, color: s.color ?? PALETTE[i % PALETTE.length] })),
    [series],
  );

  const { lines, lo, hi } = useMemo(() => {
    const all = colored.flatMap((s) => s.values);
    const min = all.length ? Math.min(...all) : 0;
    const max = all.length ? Math.max(...all) : 1;
    const range = max - min || 1;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const built = colored.map((s) => {
      const pts = s.values.map((v, i) => {
        const x = PAD.l + (s.values.length <= 1 ? iw / 2 : (i / (s.values.length - 1)) * iw);
        const y = PAD.t + ih - ((v - min) / range) * ih;
        return { x, y };
      });
      const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
      return { ...s, d, last: pts[pts.length - 1] };
    });
    return { lines: built, lo: min, hi: max };
  }, [colored]);

  const gridY = [0, 0.5, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));
  const tickStep = Math.max(1, Math.ceil(labels.length / 6));
  const summary = colored.map((s) => s.label).join(" vs ");

  return (
    <div
      role="img"
      aria-label={`${title} comparison line chart, ${subtitle}. ${summary}. Values from ${lo} to ${hi}.`}
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
        {gridY.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--edge)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        {lines.map((ln, i) => (
          <g key={i}>
            <motion.path
              d={ln.d}
              fill="none"
              stroke={ln.color}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: reduced ? 0 : i * 0.2, ease: "easeInOut" }}
            />
            {ln.last && (
              <motion.circle
                cx={ln.last.x}
                cy={ln.last.y}
                r="3.25"
                fill={ln.color}
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: reduced ? 0 : 1 + i * 0.2 }}
                style={{ transformOrigin: "center", transformBox: "fill-box" }}
              />
            )}
          </g>
        ))}

        {labels.map((lab, i) =>
          i % tickStep === 0 || i === labels.length - 1 ? (
            <text
              key={i}
              x={PAD.l + (labels.length <= 1 ? (W - PAD.l - PAD.r) / 2 : (i / (labels.length - 1)) * (W - PAD.l - PAD.r))}
              y={H - 7}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-3)"
            >
              {lab}
            </text>
          ) : null,
        )}
      </svg>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 p-0" style={{ listStyle: "none" }}>
        {colored.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block h-0.5 w-4 rounded-full" style={{ background: s.color }} aria-hidden="true" />
            <span style={{ color: "var(--text-2, var(--text))" }}>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MultiLineComparison;
