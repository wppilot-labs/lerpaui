"use client";

import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface RadialGaugeChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. Defaults to a sample score. */
  value?: number;
  /** Scale minimum. */
  min?: number;
  /** Scale maximum. */
  max?: number;
  /** Card heading. */
  title?: string;
  /** Unit suffix for the big value (e.g. "%", " pts"). */
  unit?: string;
  /** Arc color. */
  color?: string;
}

/**
 * Semicircular gauge with an animated arc, a large value label and min/max
 * ticks. Renders a sample reading with no props.
 */
export function RadialGaugeChart({
  value = 72,
  min = 0,
  max = 100,
  title = "Performance score",
  unit = "",
  color = "var(--accent)",
  className,
  ...rest
}: RadialGaugeChartProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const W = 240;
  const H = 140;
  const cx = W / 2;
  const cy = 120;
  const r = 92;
  const stroke = 16;

  const { frac, arcLen, trackPath } = useMemo(() => {
    const span = max - min || 1;
    const f = Math.min(1, Math.max(0, (value - min) / span));
    // Semicircle path from left (180°) to right (0°)
    const start = polar(cx, cy, r, 180);
    const end = polar(cx, cy, r, 0);
    const track = `M${start.x.toFixed(2)},${start.y.toFixed(2)} A${r},${r} 0 0 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
    const len = Math.PI * r; // half circumference
    return { frac: f, arcLen: len, trackPath: track };
  }, [value, min, max, cx, cy, r]);

  return (
    <div
      role="img"
      aria-label={`${title}: ${value}${unit} out of ${max}${unit}.`}
      className={cn(
        "w-full max-w-xs rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <h3 className="mb-1 text-center text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        {title}
      </h3>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`gauge-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>

          <path d={trackPath} fill="none" stroke="var(--edge)" strokeWidth={stroke} strokeLinecap="round" />

          <motion.path
            d={trackPath}
            fill="none"
            stroke={`url(#gauge-${uid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={arcLen}
            initial={reduced ? false : { strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: arcLen * (1 - frac) }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            strokeDashoffset={arcLen * (1 - frac)}
          />

          {/* min / max ticks */}
          <text x={cx - r} y={cy + 16} textAnchor="middle" fontSize="9" fill="var(--text-3)">
            {min}
          </text>
          <text x={cx + r} y={cy + 16} textAnchor="middle" fontSize="9" fill="var(--text-3)">
            {max}
          </text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
          <motion.span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color: "var(--text)" }}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.6 }}
          >
            {value}
            <span className="text-base font-semibold" style={{ color: "var(--text-3)" }}>
              {unit}
            </span>
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

export default RadialGaugeChart;
