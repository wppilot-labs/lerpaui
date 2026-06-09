"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface ActivityRing {
  label: string;
  /** Current value. */
  value: number;
  /** Goal value; the ring fills to value/goal (clamped, supports overfill cap at 100%). */
  goal: number;
  /** Ring color. */
  color?: string;
  /** Unit suffix shown in the legend. */
  unit?: string;
}

export interface ProgressRingTrioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Three concentric rings. Defaults to a sample fitness day. */
  rings?: ActivityRing[];
  /** Card heading. */
  title?: string;
}

const DEFAULT_RINGS: ActivityRing[] = [
  { label: "Move", value: 480, goal: 600, color: "var(--pink)", unit: "cal" },
  { label: "Exercise", value: 38, goal: 45, color: "var(--mint)", unit: "min" },
  { label: "Stand", value: 9, goal: 12, color: "var(--cyan)", unit: "hr" },
];

/**
 * Three concentric activity rings (Apple-fitness style) that fill in on mount,
 * with a center legend. Renders a sample day with no props.
 */
export function ProgressRingTrio({ rings = DEFAULT_RINGS, title = "Today's activity", className, ...rest }: ProgressRingTrioProps) {
  const reduced = usePrefersReducedMotion();
  const S = 160;
  const cx = S / 2;
  const cy = S / 2;
  const stroke = 13;
  const gap = 4;

  const computed = useMemo(() => {
    return rings.slice(0, 3).map((r, i) => {
      const radius = S / 2 - stroke / 2 - i * (stroke + gap) - 2;
      const circ = 2 * Math.PI * radius;
      const frac = Math.min(1, Math.max(0, r.goal ? r.value / r.goal : 0));
      const pct = Math.round((r.goal ? r.value / r.goal : 0) * 100);
      return { ...r, radius, circ, frac, pct, color: r.color ?? "var(--accent)" };
    });
  }, [rings]);

  const summary = computed.map((r) => `${r.label} ${r.pct}%`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title}. ${summary}.`}
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

      <div className="flex items-center gap-6">
        <svg viewBox={`0 0 ${S} ${S}`} className="block h-32 w-32 shrink-0 -rotate-90" aria-hidden="true">
          {computed.map((r, i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r.radius} fill="none" stroke={r.color} strokeOpacity="0.18" strokeWidth={stroke} />
              <motion.circle
                cx={cx}
                cy={cy}
                r={r.radius}
                fill="none"
                stroke={r.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={r.circ}
                initial={reduced ? false : { strokeDashoffset: r.circ }}
                animate={{ strokeDashoffset: r.circ * (1 - r.frac) }}
                transition={{ duration: 1.1, delay: reduced ? 0 : i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                strokeDashoffset={r.circ * (1 - r.frac)}
              />
            </g>
          ))}
        </svg>

        <ul className="m-0 flex-1 list-none space-y-2.5 p-0">
          {computed.map((r, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden="true" />
              <span className="flex-1 text-xs font-medium" style={{ color: "var(--text-2, var(--text))" }}>
                {r.label}
              </span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                {r.value}
                <span style={{ color: "var(--text-3)" }}>
                  /{r.goal} {r.unit}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProgressRingTrio;
