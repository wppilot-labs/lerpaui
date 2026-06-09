"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface BarRaceFrame {
  /** Frame label (e.g. a year), shown as the period readout. */
  period: string;
  /** Value per competitor, aligned to `items`. */
  values: number[];
}

export interface AnimatedBarRaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Competitor labels, aligned to each frame's `values`. */
  items?: string[];
  /** Per-item color overrides, aligned to `items`. */
  colors?: string[];
  /** Time frames to play through. Defaults to a sample race. */
  frames?: BarRaceFrame[];
  /** How many top bars to show. */
  topN?: number;
  /** Milliseconds per frame. */
  interval?: number;
  /** Card heading. */
  title?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)", "var(--amber)", "var(--pink)", "var(--mint)"];

const DEFAULT_ITEMS = ["Nova", "Lumen", "Orbit", "Vertex", "Pulse", "Atlas"];
const DEFAULT_FRAMES: BarRaceFrame[] = [
  { period: "2020", values: [20, 34, 12, 28, 9, 15] },
  { period: "2021", values: [38, 41, 22, 33, 24, 19] },
  { period: "2022", values: [55, 47, 49, 38, 44, 28] },
  { period: "2023", values: [62, 53, 78, 41, 66, 35] },
  { period: "2024", values: [70, 88, 84, 47, 73, 58] },
];

/**
 * Bar-chart-race: horizontal bars whose widths animate and whose rows reorder
 * (via Framer Motion `layout`) as it plays through time frames. Renders a
 * sample race with no props. With reduced motion, shows the final frame
 * statically.
 */
export function AnimatedBarRace({
  items = DEFAULT_ITEMS,
  colors,
  frames = DEFAULT_FRAMES,
  topN = 5,
  interval = 1400,
  title = "Market share race",
  className,
  ...rest
}: AnimatedBarRaceProps) {
  const reduced = usePrefersReducedMotion();
  const frameCount = frames.length || 1;
  // When reduced, freeze on the final frame; otherwise advance on an interval.
  const [frame, setFrame] = useState(reduced ? frameCount - 1 : 0);

  useEffect(() => {
    if (reduced || frameCount <= 1) {
      setFrame(frameCount - 1);
      return;
    }
    setFrame(0);
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % frameCount);
    }, Math.max(400, interval));
    return () => window.clearInterval(id);
  }, [reduced, frameCount, interval]);

  const { rows, max, current } = useMemo(() => {
    const frm = frames[frame] ?? frames[frameCount - 1] ?? { period: "", values: [] };
    const vals = frm.values ?? [];
    const ranked = items
      .map((label, i) => ({
        label,
        value: vals[i] ?? 0,
        color: colors?.[i] ?? PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
    const hi = Math.max(1, ...ranked.map((r) => r.value));
    return { rows: ranked, max: hi, current: frm };
  }, [frames, frame, frameCount, items, colors, topN]);

  const leader = rows[0];

  return (
    <div
      role="img"
      aria-label={`${title}. Period ${current.period}: ${rows.map((r, i) => `${i + 1}. ${r.label} ${Math.round(r.value)}`).join(", ")}.`}
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
        <motion.span
          key={current.period}
          className="text-lg font-bold tabular-nums"
          style={{ color: "var(--text-3)" }}
          initial={reduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {current.period}
        </motion.span>
      </div>

      <LayoutGroup id="animated-bar-race">
        <ul className="m-0 list-none space-y-2 p-0" aria-hidden="true">
          {rows.map((r) => (
            <motion.li
              key={r.label}
              layout={reduced ? false : true}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="flex items-center gap-2"
            >
              <span className="w-16 shrink-0 truncate text-right text-[11px] font-medium" style={{ color: "var(--text-2, var(--text))" }}>
                {r.label}
              </span>
              <div className="h-5 flex-1">
                <motion.div
                  className="flex h-full items-center justify-end rounded-md px-1.5"
                  style={{ background: r.color, minWidth: 22 }}
                  initial={reduced ? false : { width: 0 }}
                  animate={{ width: `${Math.max(6, (r.value / max) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 26 }}
                >
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: "var(--bg-2)" }}>
                    {Math.round(r.value)}
                  </span>
                </motion.div>
              </div>
            </motion.li>
          ))}
        </ul>
      </LayoutGroup>

      {leader ? (
        <div className="mt-3 text-[11px]" style={{ color: "var(--text-3)" }}>
          Leader: <span style={{ color: "var(--text)" }}>{leader.label}</span>
        </div>
      ) : null}
    </div>
  );
}

export default AnimatedBarRace;
