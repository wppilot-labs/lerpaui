"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface GaugeZone {
  /** Upper bound of this zone, in value units. */
  upTo: number;
  /** Zone arc color. */
  color: string;
}

export interface SpeedometerGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current reading. Defaults to a sample value. */
  value?: number;
  /** Scale minimum. */
  min?: number;
  /** Scale maximum. */
  max?: number;
  /** Colored zones, ascending by `upTo`. Defaults to mint → amber → pink. */
  zones?: GaugeZone[];
  /** Card heading. */
  title?: string;
  /** Unit suffix for the value label. */
  unit?: string;
}

const W = 240;
const H = 168;
const CX = W / 2;
const CY = 138;
const R = 96;
const STROKE = 16;
// Sweep across a 240° arc, from 210° (lower-left) clockwise to -30° (lower-right).
const START_ANGLE = 210;
const SWEEP = 240;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  // sweep-flag 0 because angles decrease clockwise in this coordinate system
  return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 0 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
}

const DEFAULT_ZONES: GaugeZone[] = [
  { upTo: 50, color: "var(--mint)" },
  { upTo: 80, color: "var(--amber)" },
  { upTo: 100, color: "var(--pink)" },
];

/**
 * Speedometer-style gauge with colored zones and an animated needle that sweeps
 * from zero to the current value. Renders a sample reading with no props.
 */
export function SpeedometerGauge({
  value = 68,
  min = 0,
  max = 100,
  zones = DEFAULT_ZONES,
  title = "Throughput",
  unit = "",
  className,
  ...rest
}: SpeedometerGaugeProps) {
  const reduced = usePrefersReducedMotion();

  const { frac, needleAngle, zoneArcs } = useMemo(() => {
    const span = max - min || 1;
    const f = Math.min(1, Math.max(0, (value - min) / span));
    const angle = START_ANGLE - f * SWEEP;
    let prev = min;
    const arcs = [...zones]
      .sort((a, b) => a.upTo - b.upTo)
      .map((z) => {
        const a0 = START_ANGLE - (Math.min(1, Math.max(0, (prev - min) / span)) * SWEEP);
        const a1 = START_ANGLE - (Math.min(1, Math.max(0, (z.upTo - min) / span)) * SWEEP);
        prev = z.upTo;
        return { d: arc(CX, CY, R, a0, a1), color: z.color };
      });
    return { frac: f, needleAngle: angle, zoneArcs: arcs };
  }, [value, min, max, zones]);

  const needleEnd = polar(CX, CY, R - 14, needleAngle);
  const tail = polar(CX, CY, 14, needleAngle - 180);

  return (
    <div
      role="img"
      aria-label={`${title} speedometer: ${value}${unit} out of ${max}${unit}.`}
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
          {/* track */}
          <path d={arc(CX, CY, R, START_ANGLE, START_ANGLE - SWEEP)} fill="none" stroke="var(--edge)" strokeWidth={STROKE} strokeLinecap="round" />
          {/* colored zones */}
          {zoneArcs.map((z, i) => (
            <motion.path
              key={i}
              d={z.d}
              fill="none"
              stroke={z.color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 0.6, delay: reduced ? 0 : 0.15 + i * 0.12, ease: "easeOut" }}
            />
          ))}

          {/* needle */}
          <motion.g
            initial={reduced ? false : { rotate: SWEEP }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: reduced ? 0 : 0.5 }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <line x1={tail.x} y1={tail.y} x2={needleEnd.x} y2={needleEnd.y} stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
            <circle cx={CX} cy={CY} r="7" fill="var(--bg-2)" stroke="var(--text)" strokeWidth="2.5" />
          </motion.g>

          <text x={CX - R + 4} y={CY + 18} textAnchor="middle" fontSize="9" fill="var(--text-3)">
            {min}
          </text>
          <text x={CX + R - 4} y={CY + 18} textAnchor="middle" fontSize="9" fill="var(--text-3)">
            {max}
          </text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center" style={{ bottom: 6 }}>
          <motion.span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color: "var(--text)" }}
            initial={reduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.8 + frac * 0.2 }}
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

export default SpeedometerGauge;
