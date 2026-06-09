"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface BarChartVerticalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bar values. Defaults to a weekly sample series. */
  data?: number[];
  /** Category labels under each bar. */
  labels?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Bar fill color. */
  color?: string;
  /** Append this unit to value labels (e.g. "k", "%"). */
  unit?: string;
}

const DEFAULT_DATA = [42, 58, 35, 71, 64, 88, 53];
const DEFAULT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const W = 320;
const H = 180;
const PAD = { t: 22, r: 6, b: 24, l: 6 };
const baseY = H - PAD.b;

/**
 * Vertical bar chart with staggered grow-in, value labels and a baseline.
 * Renders a sample series with no props.
 */
export function BarChartVertical({
  data = DEFAULT_DATA,
  labels = DEFAULT_LABELS,
  title = "Weekly orders",
  subtitle = "This week",
  color = "var(--accent)",
  unit = "",
  className,
  ...rest
}: BarChartVerticalProps) {
  const reduced = usePrefersReducedMotion();

  const { bars, max } = useMemo(() => {
    const series = data.length ? data : [0];
    const hi = Math.max(...series, 1);
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const slot = iw / series.length;
    const bw = Math.min(34, slot * 0.62);
    const arr = series.map((v, i) => {
      const h = (v / hi) * ih;
      const x = PAD.l + slot * i + (slot - bw) / 2;
      return { x, y: baseY - h, w: bw, h, v, cx: PAD.l + slot * i + slot / 2 };
    });
    return { bars: arr, max: hi };
  }, [data]);

  return (
    <div
      role="img"
      aria-label={`${title} bar chart, ${subtitle}. ${data.length} bars, peak value ${max}${unit}.`}
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
        {bars.map((b, i) => (
          <g key={i}>
            <motion.rect
              x={b.x}
              width={b.w}
              rx="4"
              fill={color}
              initial={reduced ? false : { height: 0, y: baseY }}
              animate={{ height: b.h, y: b.y }}
              transition={{ duration: 0.7, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              height={b.h}
              y={b.y}
            />
            <motion.text
              x={b.cx}
              y={b.y - 6}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={600}
              fill="var(--text)"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : i * 0.08 + 0.5 }}
            >
              {b.v}
              {unit}
            </motion.text>
            <text x={b.cx} y={H - 7} textAnchor="middle" fontSize="9" fill="var(--text-3)">
              {labels[i] ?? ""}
            </text>
          </g>
        ))}

        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY} stroke="var(--edge-2)" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

export default BarChartVertical;
