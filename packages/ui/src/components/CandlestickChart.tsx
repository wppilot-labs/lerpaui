"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface Candle {
  /** Opening price. */
  o: number;
  /** Highest price. */
  h: number;
  /** Lowest price. */
  l: number;
  /** Closing price. */
  c: number;
  /** Optional period label (e.g. a date). */
  label?: string;
}

export interface CandlestickChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** OHLC candles. Defaults to a sample price series. */
  data?: Candle[];
  /** Card heading. */
  title?: string;
  /** Short caption under the title. */
  subtitle?: string;
  /** Color for up (close ≥ open) candles. */
  upColor?: string;
  /** Color for down (close < open) candles. */
  downColor?: string;
}

const DEFAULT_DATA: Candle[] = [
  { o: 30, h: 38, l: 28, c: 36 },
  { o: 36, h: 40, l: 33, c: 34 },
  { o: 34, h: 35, l: 26, c: 28 },
  { o: 28, h: 33, l: 27, c: 32 },
  { o: 32, h: 44, l: 31, c: 42 },
  { o: 42, h: 46, l: 39, c: 40 },
  { o: 40, h: 41, l: 32, c: 34 },
  { o: 34, h: 39, l: 33, c: 38 },
  { o: 38, h: 52, l: 37, c: 50 },
  { o: 50, h: 54, l: 46, c: 48 },
  { o: 48, h: 50, l: 41, c: 44 },
  { o: 44, h: 58, l: 43, c: 56 },
];
const W = 320;
const H = 180;
const PAD = { t: 14, r: 8, b: 16, l: 8 };

/**
 * Financial OHLC candlestick chart with wicks and bodies that grow in from the
 * baseline, colored by direction. Renders a sample series with no props.
 */
export function CandlestickChart({
  data = DEFAULT_DATA,
  title = "AAPL",
  subtitle = "Daily OHLC",
  upColor = "var(--mint)",
  downColor = "var(--pink)",
  className,
  ...rest
}: CandlestickChartProps) {
  const reduced = usePrefersReducedMotion();

  const { candles, hi, lo } = useMemo(() => {
    const series = data.length ? data : [{ o: 0, h: 1, l: 0, c: 0 }];
    const top = Math.max(...series.map((d) => d.h));
    const bot = Math.min(...series.map((d) => d.l));
    const range = top - bot || 1;
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const slot = iw / series.length;
    const bw = Math.min(16, slot * 0.6);
    const yOf = (v: number) => PAD.t + ih - ((v - bot) / range) * ih;
    const arr = series.map((d, i) => {
      const cx = PAD.l + slot * i + slot / 2;
      const up = d.c >= d.o;
      const bodyTop = yOf(Math.max(d.o, d.c));
      const bodyBot = yOf(Math.min(d.o, d.c));
      return {
        cx,
        x: cx - bw / 2,
        w: bw,
        wickTop: yOf(d.h),
        wickBot: yOf(d.l),
        bodyTop,
        bodyH: Math.max(1.5, bodyBot - bodyTop),
        up,
        color: up ? upColor : downColor,
      };
    });
    return { candles: arr, hi: top, lo: bot };
  }, [data, upColor, downColor]);

  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => PAD.t + t * (H - PAD.t - PAD.b));

  return (
    <div
      role="img"
      aria-label={`${title} candlestick chart, ${subtitle}. ${data.length} candles, range ${lo} to ${hi}.`}
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

        {candles.map((cn2, i) => (
          <motion.g
            key={i}
            initial={reduced ? false : { opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${cn2.cx}px ${(cn2.wickBot + cn2.wickTop) / 2}px` }}
          >
            <line x1={cn2.cx} y1={cn2.wickTop} x2={cn2.cx} y2={cn2.wickBot} stroke={cn2.color} strokeWidth="1.5" strokeLinecap="round" />
            <rect x={cn2.x} y={cn2.bodyTop} width={cn2.w} height={cn2.bodyH} rx="1.5" fill={cn2.color} fillOpacity={cn2.up ? 0.9 : 0.65} stroke={cn2.color} strokeWidth="1" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default CandlestickChart;
