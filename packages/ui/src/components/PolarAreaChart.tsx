"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface PolarSlice {
  label: string;
  value: number;
  /** Optional per-wedge color override. */
  color?: string;
}

export interface PolarAreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wedges; each spans an equal angle, radius encodes value. Defaults to sample data. */
  data?: PolarSlice[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)", "var(--mint)"];

const DEFAULT_DATA: PolarSlice[] = [
  { label: "Mon", value: 52 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 40 },
  { label: "Thu", value: 84 },
  { label: "Fri", value: 72 },
  { label: "Sat", value: 30 },
];
const S = 200;
const CX = S / 2;
const CY = S / 2;
const R_MAX = 84;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180; // 0° at top, clockwise
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function wedgePath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)} Z`;
}

/**
 * Polar-area (rose) chart: equal-angle wedges whose radius encodes value. Each
 * wedge scales out from the center with a stagger. Renders sample data with no
 * props.
 */
export function PolarAreaChart({
  data = DEFAULT_DATA,
  title = "Activity by day",
  subtitle = "this week",
  className,
  ...rest
}: PolarAreaChartProps) {
  const reduced = usePrefersReducedMotion();

  const { wedges, rings } = useMemo(() => {
    const series = data.length ? data : [{ label: "—", value: 0 }];
    const hi = Math.max(...series.map((d) => d.value), 1);
    const step = 360 / series.length;
    const arr = series.map((d, i) => {
      const r = 14 + (Math.max(0, d.value) / hi) * (R_MAX - 14);
      const a0 = i * step;
      const a1 = (i + 1) * step;
      const mid = polar(CX, CY, r + 9, (a0 + a1) / 2);
      return {
        ...d,
        d: wedgePath(CX, CY, r, a0, a1),
        color: d.color ?? PALETTE[i % PALETTE.length],
        labelX: mid.x,
        labelY: mid.y,
      };
    });
    return { wedges: arr, rings: [0.33, 0.66, 1].map((t) => 14 + t * (R_MAX - 14)) };
  }, [data]);

  const summary = wedges.map((w) => `${w.label} ${w.value}`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} polar area chart, ${subtitle}. ${summary}.`}
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

      <svg viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid meet" className="mx-auto block h-auto w-full max-w-[220px] overflow-visible" aria-hidden="true">
        {rings.map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="var(--edge)" strokeWidth="1" strokeDasharray="2 4" />
        ))}

        {wedges.map((w, i) => (
          <motion.path
            key={i}
            d={w.d}
            fill={w.color}
            fillOpacity={0.7}
            stroke={w.color}
            strokeWidth="1.25"
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: reduced ? 0 : 0.1 + i * 0.08 }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        ))}

        {wedges.map((w, i) => (
          <text key={`l${i}`} x={w.labelX} y={w.labelY} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fontWeight={600} fill="var(--text-3)">
            {w.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default PolarAreaChart;
