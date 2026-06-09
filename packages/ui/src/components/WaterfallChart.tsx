"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface WaterfallStep {
  label: string;
  /** Signed delta. Positive grows the running total, negative shrinks it. */
  value: number;
  /** When true, this bar is a total/baseline drawn from zero (not a delta). */
  total?: boolean;
}

export interface WaterfallChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered steps. Defaults to a sample P&L bridge. */
  data?: WaterfallStep[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Color for positive deltas. */
  upColor?: string;
  /** Color for negative deltas. */
  downColor?: string;
  /** Color for total/baseline bars. */
  totalColor?: string;
}

const DEFAULT_DATA: WaterfallStep[] = [
  { label: "Start", value: 60, total: true },
  { label: "Sales", value: 34 },
  { label: "Services", value: 18 },
  { label: "Refunds", value: -12 },
  { label: "Costs", value: -28 },
  { label: "Net", value: 0, total: true },
];
const W = 340;
const H = 200;
const PAD = { t: 16, r: 8, b: 28, l: 8 };

/**
 * Waterfall (bridge) chart: floating bars showing how a running total builds,
 * with up/down colors and connector lines. Bars grow in left-to-right. Renders
 * a sample bridge with no props.
 */
export function WaterfallChart({
  data = DEFAULT_DATA,
  title = "Revenue bridge",
  subtitle = "Q3 → Q4",
  upColor = "var(--mint)",
  downColor = "var(--pink)",
  totalColor = "var(--accent)",
  className,
  ...rest
}: WaterfallChartProps) {
  const reduced = usePrefersReducedMotion();

  const { bars, finalTotal } = useMemo(() => {
    const series = data.length ? data : [{ label: "—", value: 0, total: true }];
    // First pass: compute running totals + the absolute extent.
    let run = 0;
    const computed = series.map((s) => {
      let start: number;
      let end: number;
      if (s.total) {
        // total bars: if value is 0, snap to the current running total
        const v = s.value === 0 ? run : s.value;
        start = 0;
        end = v;
        run = v;
      } else {
        start = run;
        end = run + s.value;
        run = end;
      }
      return { ...s, start, end };
    });
    const hi = Math.max(0, ...computed.map((c) => Math.max(c.start, c.end)));
    const lo = Math.min(0, ...computed.map((c) => Math.min(c.start, c.end)));
    const range = hi - lo || 1;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const slot = iw / computed.length;
    const bw = Math.min(34, slot * 0.6);
    const yOf = (v: number) => PAD.t + ih - ((v - lo) / range) * ih;
    const arr = computed.map((c, i) => {
      const yTop = yOf(Math.max(c.start, c.end));
      const yBot = yOf(Math.min(c.start, c.end));
      const up = c.end >= c.start;
      const color = c.total ? totalColor : up ? upColor : downColor;
      const x = PAD.l + slot * i + (slot - bw) / 2;
      return {
        ...c,
        x,
        w: bw,
        cx: PAD.l + slot * i + slot / 2,
        y: yTop,
        h: Math.max(2, yBot - yTop),
        color,
        connectorY: yOf(c.end),
      };
    });
    return { bars: arr, finalTotal: run };
  }, [data, upColor, downColor, totalColor]);

  return (
    <div
      role="img"
      aria-label={`${title} waterfall chart, ${subtitle}. ${data.length} steps, ending total ${finalTotal}.`}
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
        {/* connectors between consecutive bars */}
        {bars.map((b, i) =>
          i < bars.length - 1 ? (
            <motion.line
              key={`c${i}`}
              x1={b.cx + b.w / 2}
              y1={b.connectorY}
              x2={bars[i + 1].cx - bars[i + 1].w / 2}
              y2={b.connectorY}
              stroke="var(--text-3)"
              strokeWidth="1"
              strokeDasharray="2 3"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : i * 0.1 + 0.45 }}
            />
          ) : null,
        )}

        {bars.map((b, i) => (
          <g key={i}>
            <motion.rect
              x={b.x}
              width={b.w}
              rx="3"
              fill={b.color}
              fillOpacity={b.total ? 1 : 0.85}
              initial={reduced ? false : { height: 0, y: b.y + b.h / 2 }}
              animate={{ height: b.h, y: b.y }}
              transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              height={b.h}
              y={b.y}
            />
            <text x={b.cx} y={H - 16} textAnchor="middle" fontSize="8.5" fill="var(--text-3)">
              {b.label}
            </text>
            <text x={b.cx} y={H - 5} textAnchor="middle" fontSize="9" fontWeight={600} fill="var(--text)">
              {b.total ? b.end : (b.value > 0 ? "+" : "") + b.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default WaterfallChart;
