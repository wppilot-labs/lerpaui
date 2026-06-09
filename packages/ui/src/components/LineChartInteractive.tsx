'use client';

import React, { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface LineChartInteractiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Numeric series to plot. Defaults to a sample trend. */
  data?: number[];
  /** X-axis labels, aligned to data points. */
  labels?: string[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Line + dot color. */
  color?: string;
  /** Unit suffix shown in tooltip values. */
  unit?: string;
}

const DEFAULT_DATA = [28, 35, 31, 44, 39, 52, 48, 61, 57];
const DEFAULT_LABELS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8', 'Wk 9'];
const W = 320;
const H = 170;
const PAD = { t: 14, r: 12, b: 24, l: 12 };

/**
 * Line chart with dots, gridlines and a keyboard-accessible hover tooltip.
 * Each data point is a focusable element with an accessible name; a visually
 * hidden table provides a non-visual fallback. Renders sample data with no props.
 */
export function LineChartInteractive({
  data = DEFAULT_DATA,
  labels = DEFAULT_LABELS,
  title = 'Active users',
  subtitle = 'Weekly',
  color = 'var(--cyan)',
  unit = '',
  className,
  ...rest
}: LineChartInteractiveProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');
  const [active, setActive] = useState<number | null>(null);

  const { linePath, points, max, min } = useMemo(() => {
    const series = data.length ? data : [0];
    const lo = Math.min(...series);
    const hi = Math.max(...series);
    const range = hi - lo || 1;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const pts = series.map((v, i) => {
      const x = PAD.l + (series.length === 1 ? iw / 2 : (i / (series.length - 1)) * iw);
      const y = PAD.t + ih - ((v - lo) / range) * ih;
      return { x, y, v };
    });
    const ld = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
    return { linePath: ld, points: pts, max: hi, min: lo };
  }, [data]);

  const gridY = [0, 0.5, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));
  const tickStep = Math.max(1, Math.ceil(labels.length / 6));
  const cur = active != null ? points[active] : null;

  return (
    <div
      className={cn(
        'w-full max-w-md rounded-2xl border p-5 [font-family:var(--font-sans)]',
        className
      )}
      style={{ borderColor: 'var(--edge)', background: 'var(--bg-2)', color: 'var(--text)' }}
      {...rest}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          {subtitle}
        </span>
      </div>

      <div className="relative">
        <div
          role="img"
          aria-label={`${title} line chart, ${subtitle}. Ranges from ${min}${unit} to ${max}${unit} across ${data.length} points.`}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <filter id={`lci-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {gridY.map((y, i) => (
              <line
                key={i}
                x1={PAD.l}
                y1={y}
                x2={W - PAD.r}
                y2={y}
                stroke="var(--edge)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            ))}

            <motion.path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />

            {cur && (
              <line
                x1={cur.x}
                y1={PAD.t}
                x2={cur.x}
                y2={H - PAD.b}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            )}

            {points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={active === i ? 5 : 3}
                fill={active === i ? color : 'var(--bg-2)'}
                stroke={color}
                strokeWidth="1.75"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.9 }}
                style={active === i ? { filter: `url(#lci-glow-${uid})` } : undefined}
              />
            ))}

            {cur && (
              <text
                x={cur.x}
                y={cur.y - 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight={700}
                fill="var(--text)"
              >
                {cur.v}
                {unit}
              </text>
            )}

            {labels.map((lab, i) =>
              i % tickStep === 0 || i === labels.length - 1 ? (
                <text
                  key={i}
                  x={points[i]?.x ?? 0}
                  y={H - 7}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--text-3)"
                >
                  {lab}
                </text>
              ) : null
            )}
          </svg>
        </div>

        {/* Keyboard / pointer hit targets with accessible names (siblings of the img, not descendants) */}
        <ul
          className="absolute inset-x-0 top-0 m-0 flex h-full list-none p-0"
          aria-label={`${title} data points`}
        >
          {points.map((p, i) => (
            <li key={i} className="flex-1">
              <button
                type="button"
                className="block h-full w-full cursor-pointer rounded outline-none focus-visible:ring-2"
                style={{ background: 'transparent', border: 'none', padding: 0, color }}
                aria-label={`${labels[i] ?? `Point ${i + 1}`}: ${p.v}${unit}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Non-visual data fallback */}
      <table className="sr-only">
        <caption>
          {title} — {subtitle}
        </caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={i}>
              <th scope="row">{labels[i] ?? `Point ${i + 1}`}</th>
              <td>
                {p.v}
                {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LineChartInteractive;
