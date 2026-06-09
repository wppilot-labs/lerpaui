"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface RadialBarItem {
  label: string;
  /** Value as a percentage (0–100) of the full ring. */
  value: number;
  /** Optional per-arc color override. */
  color?: string;
}

export interface RadialBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Concentric arcs, outermost first. Defaults to sample completion data. */
  data?: RadialBarItem[];
  /** Card heading. */
  title?: string;
  /** Maximum value mapped to a full 270° sweep. */
  max?: number;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)"];

const DEFAULT_DATA: RadialBarItem[] = [
  { label: "Mobile", value: 86 },
  { label: "Desktop", value: 64 },
  { label: "Tablet", value: 42 },
  { label: "Watch", value: 23 },
];
const S = 180;
const CX = S / 2;
const CY = S / 2;
const STROKE = 13;
const GAP = 5;
const R_OUTER = 76;
// Sweep over 270°, starting at the top (12 o'clock) going clockwise.
const SWEEP = 270;

/**
 * Radial bar chart — concentric arcs whose lengths encode value, each sweeping
 * in clockwise. Includes a value legend. Renders sample data with no props.
 */
export function RadialBarChart({
  data = DEFAULT_DATA,
  title = "Adoption by device",
  max = 100,
  className,
  ...rest
}: RadialBarChartProps) {
  const reduced = usePrefersReducedMotion();

  const { rings } = useMemo(() => {
    const arr = data.map((d, i) => {
      const r = R_OUTER - i * (STROKE + GAP);
      const circ = 2 * Math.PI * r;
      const sweepLen = circ * (SWEEP / 360);
      const frac = Math.min(1, Math.max(0, d.value / (max || 1)));
      return {
        ...d,
        r,
        circ,
        sweepLen,
        dash: frac * sweepLen,
        color: d.color ?? PALETTE[i % PALETTE.length],
        pct: Math.round(frac * 100),
      };
    });
    return { rings: arr };
  }, [data, max]);

  const summary = rings.map((r) => `${r.label} ${r.pct}%`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} radial bar chart. ${summary}.`}
      className={cn(
        "w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        {title}
      </h3>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: 148, height: 148 }}>
          {/* rotate so the 270° sweep begins at the top */}
          <svg viewBox={`0 0 ${S} ${S}`} className="h-full w-full" style={{ transform: "rotate(135deg)" }} aria-hidden="true">
            {rings.map((r, i) => (
              <g key={i}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={r.r}
                  fill="none"
                  stroke="var(--edge)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${r.sweepLen.toFixed(2)} ${r.circ.toFixed(2)}`}
                />
                <motion.circle
                  cx={CX}
                  cy={CY}
                  r={r.r}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${r.dash.toFixed(2)} ${r.circ.toFixed(2)}`}
                  initial={reduced ? false : { strokeDasharray: `0 ${r.circ.toFixed(2)}` }}
                  animate={{ strokeDasharray: `${r.dash.toFixed(2)} ${r.circ.toFixed(2)}` }}
                  transition={{ duration: 1, delay: reduced ? 0 : i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                />
              </g>
            ))}
          </svg>
        </div>

        <ul className="m-0 flex-1 list-none space-y-2.5 p-0">
          {rings.map((r, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden="true" />
              <span className="flex-1 truncate" style={{ color: "var(--text-2, var(--text))" }}>
                {r.label}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                {r.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RadialBarChart;
