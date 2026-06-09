"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface GroupedSeries {
  label: string;
  /** One value per group, aligned to `groups`. */
  values: number[];
  /** Optional series color override. */
  color?: string;
}

export interface GroupedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group (category) labels along the x-axis. */
  groups?: string[];
  /** 2–3 data series. Defaults to a sample comparison. */
  series?: GroupedSeries[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const PALETTE = ["var(--accent)", "var(--violet)", "var(--amber)"];

const DEFAULT_GROUPS = ["Q1", "Q2", "Q3", "Q4"];
const DEFAULT_SERIES: GroupedSeries[] = [
  { label: "2023", values: [38, 52, 47, 61] },
  { label: "2024", values: [49, 58, 66, 74] },
];
const W = 340;
const H = 190;
const PAD = { t: 14, r: 8, b: 26, l: 8 };
const baseY = H - PAD.b;

/**
 * Grouped (clustered) bar chart comparing 2–3 series per category, with
 * staggered grow-in and a color legend. Renders sample data with no props.
 */
export function GroupedBarChart({
  groups = DEFAULT_GROUPS,
  series = DEFAULT_SERIES,
  title = "Revenue by quarter",
  subtitle = "YoY",
  className,
  ...rest
}: GroupedBarChartProps) {
  const reduced = usePrefersReducedMotion();

  const { bars, max, legend } = useMemo(() => {
    const s = series.length ? series : [{ label: "—", values: [0] }];
    const nGroups = Math.max(1, groups.length);
    const nSeries = s.length;
    const hi = Math.max(1, ...s.flatMap((ss) => ss.values));
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const groupSlot = iw / nGroups;
    const clusterW = groupSlot * 0.72;
    const bw = clusterW / nSeries;
    const out: { x: number; y: number; w: number; h: number; color: string; gi: number; si: number }[] = [];
    for (let gi = 0; gi < nGroups; gi++) {
      const groupX = PAD.l + groupSlot * gi + (groupSlot - clusterW) / 2;
      for (let si = 0; si < nSeries; si++) {
        const v = s[si].values[gi] ?? 0;
        const h = (v / hi) * ih;
        out.push({
          x: groupX + bw * si,
          y: baseY - h,
          w: bw * 0.84,
          h,
          color: s[si].color ?? PALETTE[si % PALETTE.length],
          gi,
          si,
        });
      }
    }
    const leg = s.map((ss, i) => ({ label: ss.label, color: ss.color ?? PALETTE[i % PALETTE.length] }));
    return { bars: out, max: hi, legend: leg };
  }, [groups, series]);

  const gridY = [0.25, 0.5, 0.75, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));
  const groupSlot = (W - PAD.l - PAD.r) / Math.max(1, groups.length);

  return (
    <div
      role="img"
      aria-label={`${title} grouped bar chart, ${subtitle}. ${series.length} series across ${groups.length} groups, peak ${max}.`}
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
        {gridY.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--edge)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        {bars.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            width={b.w}
            rx="3"
            fill={b.color}
            initial={reduced ? false : { height: 0, y: baseY }}
            animate={{ height: b.h, y: b.y }}
            transition={{ duration: 0.6, delay: reduced ? 0 : b.gi * 0.1 + b.si * 0.06, ease: [0.22, 1, 0.36, 1] }}
            height={b.h}
            y={b.y}
          />
        ))}

        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY} stroke="var(--edge-2)" strokeWidth="1.25" />

        {groups.map((g, i) => (
          <text key={i} x={PAD.l + groupSlot * i + groupSlot / 2} y={H - 11} textAnchor="middle" fontSize="9.5" fill="var(--text-3)">
            {g}
          </text>
        ))}
      </svg>

      <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
        {legend.map((l, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: l.color }} aria-hidden="true" />
            <span style={{ color: "var(--text-2, var(--text))" }}>{l.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupedBarChart;
