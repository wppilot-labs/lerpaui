"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface RankingItem {
  label: string;
  value: number;
  /** Optional per-bar color override. */
  color?: string;
}

export interface HorizontalBarRankingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Items to rank. Sorted descending by value. Defaults to sample data. */
  data?: RankingItem[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Bar fill color (when an item has no `color`). */
  color?: string;
  /** Unit suffix for value labels. */
  unit?: string;
}

const DEFAULT_DATA: RankingItem[] = [
  { label: "United States", value: 4820 },
  { label: "Germany", value: 3110 },
  { label: "India", value: 2740 },
  { label: "Brazil", value: 1980 },
  { label: "Japan", value: 1450 },
];

/**
 * Horizontal ranking bars with animated widths plus rank and value labels.
 * Renders sample data with no props.
 */
export function HorizontalBarRanking({
  data = DEFAULT_DATA,
  title = "Top countries",
  subtitle = "by signups",
  color = "var(--accent)",
  unit = "",
  className,
  ...rest
}: HorizontalBarRankingProps) {
  const reduced = usePrefersReducedMotion();

  const { rows, max } = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const hi = Math.max(...sorted.map((d) => d.value), 1);
    return { rows: sorted, max: hi };
  }, [data]);

  const summary = rows
    .slice(0, 3)
    .map((r, i) => `${i + 1}. ${r.label} ${r.value}${unit}`)
    .join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} ${subtitle}. ${summary}.`}
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

      <ol className="m-0 list-none space-y-3 p-0">
        {rows.map((r, i) => {
          const pct = (r.value / max) * 100;
          const fill = r.color ?? color;
          return (
            <li key={r.label} className="flex items-center gap-3">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-bold tabular-nums"
                style={{ background: "var(--edge)", color: "var(--text-2, var(--text))" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-medium" style={{ color: "var(--text)" }}>
                    {r.label}
                  </span>
                  <span className="shrink-0 text-xs font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                    {r.value.toLocaleString()}
                    {unit}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--edge)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: fill }}
                    initial={reduced ? false : { width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: reduced ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default HorizontalBarRanking;
