"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface FunnelStage {
  label: string;
  value: number;
  /** Optional per-stage color override. */
  color?: string;
}

export interface FunnelChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Funnel stages, top (widest) to bottom. Defaults to a sample journey. */
  data?: FunnelStage[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Base color; stages fade darker toward the bottom. */
  color?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--mint)", "var(--amber)"];

const DEFAULT_DATA: FunnelStage[] = [
  { label: "Visited", value: 12500 },
  { label: "Signed up", value: 6400 },
  { label: "Activated", value: 3200 },
  { label: "Subscribed", value: 1180 },
  { label: "Renewed", value: 540 },
];
const W = 320;
const ROW_H = 40;
const GAP = 8;
const PAD_X = 6;

/**
 * Conversion funnel: trapezoidal stages that widen-in from the center,
 * top-to-bottom, with value and conversion labels. Renders sample data with no
 * props.
 */
export function FunnelChart({
  data = DEFAULT_DATA,
  title = "Activation funnel",
  subtitle = "last 30 days",
  color = "var(--accent)",
  className,
  ...rest
}: FunnelChartProps) {
  const reduced = usePrefersReducedMotion();

  const { stages, H, top } = useMemo(() => {
    const series = data.length ? data : [{ label: "—", value: 0 }];
    const hi = Math.max(...series.map((d) => d.value), 1);
    const iw = W - PAD_X * 2;
    const arr = series.map((d, i) => {
      const frac = Math.max(0, d.value) / hi;
      const w = Math.max(iw * 0.18, iw * frac);
      const y = i * (ROW_H + GAP);
      const conv = i === 0 ? 100 : Math.round((d.value / series[0].value) * 100);
      return {
        ...d,
        w,
        y,
        cx: W / 2,
        x: (W - w) / 2,
        color: d.color ?? PALETTE[i % PALETTE.length] ?? color,
        conv,
      };
    });
    const height = series.length * (ROW_H + GAP) - GAP;
    return { stages: arr, H: height, top: series[0].value };
  }, [data, color]);

  const summary = stages.map((s) => `${s.label} ${s.conv}%`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} funnel chart, ${subtitle}. From ${top.toLocaleString()} entries: ${summary}.`}
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
        {stages.map((s, i) => (
          <g key={i}>
            <motion.rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={ROW_H}
              rx="6"
              fill={s.color}
              fillOpacity={1 - i * 0.12}
              initial={reduced ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${s.cx}px center` }}
            />
            <text x={s.cx} y={s.y + ROW_H / 2 - 2} textAnchor="middle" fontSize="11" fontWeight={700} fill="var(--text)">
              {s.value.toLocaleString()}
            </text>
            <text x={s.cx} y={s.y + ROW_H / 2 + 11} textAnchor="middle" fontSize="8.5" fill="var(--text)" fillOpacity={0.8}>
              {s.label} · {s.conv}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default FunnelChart;
