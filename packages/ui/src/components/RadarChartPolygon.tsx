"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface RadarAxis {
  label: string;
  /** Value on this axis, 0..max. */
  value: number;
}

export interface RadarChartPolygonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 5–6 axes with values. Defaults to a sample skill profile. */
  data?: RadarAxis[];
  /** Scale maximum. */
  max?: number;
  /** Card heading. */
  title?: string;
  /** Polygon stroke / fill color. */
  color?: string;
}

const DEFAULT_DATA: RadarAxis[] = [
  { label: "Speed", value: 80 },
  { label: "Reliability", value: 92 },
  { label: "Comfort", value: 68 },
  { label: "Safety", value: 88 },
  { label: "Economy", value: 74 },
  { label: "Design", value: 84 },
];

/**
 * Radar / spider chart with an animated polygon and axis labels (5–6 axes).
 * Renders a sample profile with no props.
 */
export function RadarChartPolygon({
  data = DEFAULT_DATA,
  max = 100,
  title = "Vehicle rating",
  color = "var(--violet)",
  className,
  ...rest
}: RadarChartPolygonProps) {
  const reduced = usePrefersReducedMotion();
  const S = 240;
  const cx = S / 2;
  const cy = S / 2;
  const R = 88;
  const rings = [0.25, 0.5, 0.75, 1];

  const { axes, polygon } = useMemo(() => {
    const n = Math.max(3, data.length);
    const ax = data.map((d, i) => {
      const ang = (-90 + (360 / n) * i) * (Math.PI / 180);
      const frac = Math.min(1, Math.max(0, d.value / (max || 1)));
      const px = cx + Math.cos(ang) * R * frac;
      const py = cy + Math.sin(ang) * R * frac;
      const lx = cx + Math.cos(ang) * (R + 16);
      const ly = cy + Math.sin(ang) * (R + 16);
      const ex = cx + Math.cos(ang) * R;
      const ey = cy + Math.sin(ang) * R;
      return { ...d, ang, px, py, lx, ly, ex, ey };
    });
    const poly = ax.map((a) => `${a.px.toFixed(2)},${a.py.toFixed(2)}`).join(" ");
    return { axes: ax, polygon: poly };
  }, [data, max, cx, cy]);

  const summary = data.map((d) => `${d.label} ${d.value}`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} radar chart. ${summary}. Out of ${max}.`}
      className={cn(
        "w-full max-w-sm rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <h3 className="mb-2 text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        {title}
      </h3>

      <svg viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full overflow-visible" aria-hidden="true">
        {/* grid rings */}
        {rings.map((rg, i) => (
          <polygon
            key={i}
            points={axes.map((a) => `${cx + Math.cos(a.ang) * R * rg},${cy + Math.sin(a.ang) * R * rg}`).join(" ")}
            fill="none"
            stroke="var(--edge)"
            strokeWidth="1"
          />
        ))}

        {/* spokes */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.ex} y2={a.ey} stroke="var(--edge)" strokeWidth="1" />
        ))}

        {/* data polygon */}
        <motion.polygon
          points={polygon}
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* vertices */}
        {axes.map((a, i) => (
          <motion.circle
            key={i}
            cx={a.px}
            cy={a.py}
            r="2.75"
            fill={color}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : 0.6 }}
          />
        ))}

        {/* axis labels */}
        {axes.map((a, i) => (
          <text
            key={i}
            x={a.lx}
            y={a.ly}
            textAnchor={Math.abs(a.lx - cx) < 6 ? "middle" : a.lx > cx ? "start" : "end"}
            dominantBaseline={a.ly > cy + 6 ? "hanging" : a.ly < cy - 6 ? "auto" : "middle"}
            fontSize="9.5"
            fill="var(--text-3)"
          >
            {a.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default RadarChartPolygon;
