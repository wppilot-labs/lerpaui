"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface BulletRow {
  label: string;
  /** Actual measured value. */
  measure: number;
  /** Target marker value. */
  target: number;
  /** Qualitative range boundaries (ascending). Defaults to [60, 80, 100] of max. */
  ranges?: number[];
  /** Scale maximum for this row. */
  max?: number;
  /** Measure bar color override. */
  color?: string;
}

export interface BulletKpiChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** KPI rows. Defaults to a sample scorecard. */
  data?: BulletRow[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const DEFAULT_DATA: BulletRow[] = [
  { label: "Revenue", measure: 84, target: 90, max: 120 },
  { label: "Profit", measure: 67, target: 60, max: 100 },
  { label: "New users", measure: 42, target: 55, max: 80 },
  { label: "Retention", measure: 91, target: 85, max: 100 },
];
const TRACK_W = 240;
const ROW_H = 18;

/**
 * Bullet KPI chart: per-metric measure bars against a target marker, layered
 * over qualitative range bands. Bars fill in left-to-right. Renders a sample
 * scorecard with no props.
 */
export function BulletKpiChart({
  data = DEFAULT_DATA,
  title = "KPI scorecard",
  subtitle = "actual vs target",
  className,
  ...rest
}: BulletKpiChartProps) {
  const reduced = usePrefersReducedMotion();

  const rows = useMemo(() => {
    return (data.length ? data : [{ label: "—", measure: 0, target: 0 }]).map((d) => {
      const max = d.max ?? (Math.max(d.measure, d.target) * 1.2 || 1);
      const ranges = (d.ranges ?? [max * 0.6, max * 0.8, max]).slice().sort((a, b) => a - b);
      const met = d.measure >= d.target;
      return {
        ...d,
        max,
        ranges,
        measurePct: Math.min(100, (d.measure / max) * 100),
        targetPct: Math.min(100, (d.target / max) * 100),
        bands: ranges.map((r) => Math.min(100, (r / max) * 100)),
        met,
        color: d.color ?? (met ? "var(--mint)" : "var(--accent)"),
      };
    });
  }, [data]);

  const summary = rows.map((r) => `${r.label} ${r.measure} of ${r.target} target`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title}, ${subtitle}. ${summary}.`}
      className={cn(
        "w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>
          {subtitle}
        </span>
      </div>

      <ul className="m-0 list-none space-y-3.5 p-0">
        {rows.map((r, i) => (
          <li key={i}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                {r.label}
              </span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: r.met ? "var(--mint)" : "var(--text-3)" }}>
                {r.measure}
                <span style={{ color: "var(--text-3)" }}> / {r.target}</span>
              </span>
            </div>

            <svg viewBox={`0 0 ${TRACK_W} ${ROW_H}`} preserveAspectRatio="none" className="block w-full" style={{ height: ROW_H }} aria-hidden="true">
              {/* qualitative range bands, darkest (worst) to lightest (best) */}
              {r.bands.map((b, bi) => {
                const prev = bi === 0 ? 0 : r.bands[bi - 1];
                return (
                  <rect
                    key={bi}
                    x={(prev / 100) * TRACK_W}
                    y={0}
                    width={((b - prev) / 100) * TRACK_W}
                    height={ROW_H}
                    rx="2"
                    fill="var(--edge)"
                    fillOpacity={0.4 + bi * 0.18}
                  />
                );
              })}

              {/* measure bar */}
              <motion.rect
                x={0}
                y={ROW_H / 2 - 4}
                height={8}
                rx="2"
                fill={r.color}
                initial={reduced ? false : { width: 0 }}
                animate={{ width: (r.measurePct / 100) * TRACK_W }}
                transition={{ duration: 0.9, delay: reduced ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                width={(r.measurePct / 100) * TRACK_W}
              />

              {/* target marker */}
              <motion.line
                x1={(r.targetPct / 100) * TRACK_W}
                x2={(r.targetPct / 100) * TRACK_W}
                y1={2}
                y2={ROW_H - 2}
                stroke="var(--text)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={reduced ? false : { opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.1 + 0.6 }}
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BulletKpiChart;
