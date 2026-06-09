"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface DonutSlice {
  label: string;
  value: number;
  /** CSS color; defaults cycle through the theme palette. */
  color?: string;
}

export interface DonutChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slices to render. Defaults to a sample traffic breakdown. */
  data?: DonutSlice[];
  /** Card heading. */
  title?: string;
  /** Label shown under the center total. */
  centerLabel?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)", "var(--mint)"];

const DEFAULT_DATA: DonutSlice[] = [
  { label: "Direct", value: 42 },
  { label: "Organic", value: 28 },
  { label: "Referral", value: 18 },
  { label: "Social", value: 12 },
];

/**
 * Donut chart with an animated arc sweep, a legend with per-slice values and a
 * center total. Renders a sample breakdown with no props.
 */
export function DonutChartLegend({
  data = DEFAULT_DATA,
  title = "Traffic sources",
  centerLabel = "Total",
  className,
  ...rest
}: DonutChartLegendProps) {
  const reduced = usePrefersReducedMotion();
  const S = 160;
  const cx = S / 2;
  const cy = S / 2;
  const r = 60;
  const stroke = 20;
  const circ = 2 * Math.PI * r;

  const { slices, total } = useMemo(() => {
    const sum = data.reduce((a, s) => a + Math.max(0, s.value), 0) || 1;
    let acc = 0;
    const out = data.map((s, i) => {
      const frac = Math.max(0, s.value) / sum;
      const seg = {
        ...s,
        color: s.color ?? PALETTE[i % PALETTE.length],
        frac,
        offset: acc,
        pct: Math.round(frac * 100),
      };
      acc += frac;
      return seg;
    });
    return { slices: out, total: sum };
  }, [data]);

  const summary = slices.map((s) => `${s.label} ${s.pct}%`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} donut chart. Total ${total}. ${summary}.`}
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
        <div className="relative shrink-0" style={{ width: 132, height: 132 }}>
          <svg viewBox={`0 0 ${S} ${S}`} className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--edge)" strokeWidth={stroke} />
            {slices.map((s, i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                strokeDasharray={`${(s.frac * circ).toFixed(2)} ${circ.toFixed(2)}`}
                strokeDashoffset={(-s.offset * circ).toFixed(2)}
                initial={reduced ? false : { strokeDasharray: `0 ${circ.toFixed(2)}` }}
                animate={{ strokeDasharray: `${(s.frac * circ).toFixed(2)} ${circ.toFixed(2)}` }}
                transition={{ duration: 0.9, delay: reduced ? 0 : s.offset * 0.9, ease: "easeOut" }}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums" style={{ color: "var(--text)" }}>
              {total}
            </span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              {centerLabel}
            </span>
          </div>
        </div>

        <ul className="m-0 flex-1 list-none space-y-2 p-0">
          {slices.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
              <span className="flex-1 truncate" style={{ color: "var(--text-2, var(--text))" }}>
                {s.label}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                {s.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DonutChartLegend;
