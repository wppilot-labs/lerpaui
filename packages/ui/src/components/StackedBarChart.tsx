"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface StackedSeries {
  label: string;
  /** One value per category (aligned to `categories`). */
  values: number[];
  /** CSS color; defaults cycle through the theme palette. */
  color?: string;
}

export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Series, each contributing a segment to every bar. Defaults to sample data. */
  series?: StackedSeries[];
  /** Category labels under each bar. */
  categories?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)"];

const DEFAULT_CATEGORIES = ["Q1", "Q2", "Q3", "Q4"];
const DEFAULT_SERIES: StackedSeries[] = [
  { label: "Subscriptions", values: [32, 41, 38, 52] },
  { label: "Services", values: [18, 22, 26, 24] },
  { label: "One-off", values: [10, 14, 12, 19] },
];
const W = 320;
const H = 190;
const PAD = { t: 14, r: 6, b: 26, l: 6 };
const baseY = H - PAD.b;

/**
 * Stacked vertical bar chart with a category legend and animated segments that
 * grow in from the baseline. Renders sample data with no props.
 */
export function StackedBarChart({
  series = DEFAULT_SERIES,
  categories = DEFAULT_CATEGORIES,
  title = "Revenue by quarter",
  subtitle = "$k",
  className,
  ...rest
}: StackedBarChartProps) {
  const reduced = usePrefersReducedMotion();

  const colored = useMemo(
    () => series.map((s, i) => ({ ...s, color: s.color ?? PALETTE[i % PALETTE.length] })),
    [series],
  );

  const { bars, totals } = useMemo(() => {
    const n = categories.length;
    const colTotals = Array.from({ length: n }, (_, c) => colored.reduce((a, s) => a + (s.values[c] ?? 0), 0));
    const hi = Math.max(...colTotals, 1);
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const slot = iw / n;
    const bw = Math.min(40, slot * 0.6);

    const cols = Array.from({ length: n }, (_, c) => {
      const x = PAD.l + slot * c + (slot - bw) / 2;
      let yCursor = baseY;
      const segs = colored.map((s) => {
        const v = s.values[c] ?? 0;
        const h = (v / hi) * ih;
        yCursor -= h;
        return { y: yCursor, h, color: s.color, v };
      });
      return { x, w: bw, cx: PAD.l + slot * c + slot / 2, segs };
    });
    return { bars: cols, totals: colTotals };
  }, [colored, categories]);

  const summary = colored.map((s) => s.label).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} stacked bar chart. Series: ${summary}. ${categories.length} categories.`}
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
        {bars.map((b, ci) => (
          <g key={ci}>
            {b.segs.map((seg, si) =>
              seg.h > 0 ? (
                <motion.rect
                  key={si}
                  x={b.x}
                  width={b.w}
                  fill={seg.color}
                  rx="2"
                  initial={reduced ? false : { height: 0, y: baseY }}
                  animate={{ height: seg.h, y: seg.y }}
                  transition={{
                    duration: 0.6,
                    delay: reduced ? 0 : ci * 0.1 + si * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  height={seg.h}
                  y={seg.y}
                />
              ) : null,
            )}
            <text x={b.cx} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--text-3)">
              {categories[ci] ?? ""}
            </text>
            <motion.text
              x={b.cx}
              y={(b.segs[b.segs.length - 1]?.y ?? baseY) - 5}
              textAnchor="middle"
              fontSize="9"
              fontWeight={600}
              fill="var(--text)"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : ci * 0.1 + 0.6 }}
            >
              {totals[ci]}
            </motion.text>
          </g>
        ))}
        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY} stroke="var(--edge-2)" strokeWidth="1.25" />
      </svg>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 p-0" style={{ listStyle: "none" }}>
        {colored.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
            <span style={{ color: "var(--text-2, var(--text))" }}>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StackedBarChart;
