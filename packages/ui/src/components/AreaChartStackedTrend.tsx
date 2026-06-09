"use client";

import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface StackedTrendSeries {
  label: string;
  /** One value per x position (aligned to `labels`). */
  values: number[];
  /** CSS color; defaults cycle through the theme palette. */
  color?: string;
}

export interface AreaChartStackedTrendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Two or three series, stacked bottom-to-top. Defaults to sample data. */
  series?: StackedTrendSeries[];
  /** X-axis labels. */
  labels?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
}

const PALETTE = ["var(--accent)", "var(--cyan)", "var(--violet)"];

const DEFAULT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const DEFAULT_SERIES: StackedTrendSeries[] = [
  { label: "Desktop", values: [20, 24, 22, 30, 28, 35, 33, 40] },
  { label: "Mobile", values: [14, 16, 19, 18, 24, 26, 30, 34] },
  { label: "Tablet", values: [6, 7, 6, 9, 8, 10, 11, 12] },
];
const W = 320;
const H = 180;
const PAD = { t: 14, r: 8, b: 24, l: 8 };

/**
 * Stacked area chart (2–3 series) with gradient fills and a legend. Areas fade
 * up and the top edge draws in. Renders sample data with no props.
 */
export function AreaChartStackedTrend({
  series = DEFAULT_SERIES,
  labels = DEFAULT_LABELS,
  title = "Traffic by device",
  subtitle = "Sessions (k)",
  className,
  ...rest
}: AreaChartStackedTrendProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");

  const colored = useMemo(
    () => series.map((s, i) => ({ ...s, color: s.color ?? PALETTE[i % PALETTE.length] })),
    [series],
  );

  const { layers, maxTotal } = useMemo(() => {
    const n = labels.length;
    const cumulative = Array.from({ length: n }, () => 0);
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;

    // Find the peak stacked total for scaling.
    let peak = 0;
    for (let i = 0; i < n; i++) {
      let t = 0;
      for (const s of colored) t += s.values[i] ?? 0;
      if (t > peak) peak = t;
    }
    const scale = peak || 1;

    const xAt = (i: number) => PAD.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
    const yAt = (val: number) => PAD.t + ih - (val / scale) * ih;

    const built = colored.map((s) => {
      const topPts: Array<[number, number]> = [];
      const botPts: Array<[number, number]> = [];
      for (let i = 0; i < n; i++) {
        const base = cumulative[i];
        const top = base + (s.values[i] ?? 0);
        botPts.push([xAt(i), yAt(base)]);
        topPts.push([xAt(i), yAt(top)]);
        cumulative[i] = top;
      }
      const topLine = topPts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
      const areaD =
        topLine +
        " " +
        botPts
          .slice()
          .reverse()
          .map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`)
          .join(" ") +
        " Z";
      return { ...s, topLine, areaD };
    });
    return { layers: built, maxTotal: peak };
  }, [colored, labels]);

  const gridY = [0, 0.5, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));
  const tickStep = Math.max(1, Math.ceil(labels.length / 6));
  const summary = colored.map((s) => s.label).join(", ");

  return (
    <div
      role="img"
      aria-label={`${title} stacked area chart, ${subtitle}. Series: ${summary}. Peak total ${maxTotal}.`}
      className={cn(
        "w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]",
        className,
      )}
      style={{ borderColor: "var(--edge)", background: "var(--bg-2)", color: "var(--text)" }}
      {...rest}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>
          {subtitle}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          {layers.map((l, i) => (
            <linearGradient key={i} id={`acst-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={l.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={l.color} stopOpacity="0.12" />
            </linearGradient>
          ))}
        </defs>

        {gridY.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--edge)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        {layers
          .slice()
          .reverse()
          .map((l, ri) => {
            const i = layers.length - 1 - ri;
            return (
              <g key={i}>
                <motion.path
                  d={l.areaD}
                  fill={`url(#acst-${uid}-${i})`}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.3 + i * 0.12, ease: "easeOut" }}
                />
                <motion.path
                  d={l.topLine}
                  fill="none"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: reduced ? 0 : i * 0.12, ease: "easeInOut" }}
                />
              </g>
            );
          })}

        {labels.map((lab, i) =>
          i % tickStep === 0 || i === labels.length - 1 ? (
            <text
              key={i}
              x={PAD.l + (labels.length <= 1 ? (W - PAD.l - PAD.r) / 2 : (i / (labels.length - 1)) * (W - PAD.l - PAD.r))}
              y={H - 7}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-3)"
            >
              {lab}
            </text>
          ) : null,
        )}
      </svg>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 p-0" style={{ listStyle: "none" }}>
        {colored.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
            <span style={{ color: "var(--text-2, var(--text))" }}>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AreaChartStackedTrend;
