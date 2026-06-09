"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "../lib/cn";

interface SeriesKey {
  id: string;
  label: string;
  data: number[];
  unit?: string;
}

const SERIES: SeriesKey[] = [
  {
    id: "30d",
    label: "30 days",
    data: [62, 64, 61, 65, 68, 67, 70, 69, 72, 71, 74, 73, 75, 76, 78, 77, 80, 82, 81, 83, 85, 84, 86, 88, 87, 89, 91, 90, 92, 94],
  },
  {
    id: "90d",
    label: "90 days",
    data: [55, 57, 56, 58, 60, 62, 61, 64, 66, 65, 68, 70, 69, 71, 73, 72, 75, 77, 76, 79, 81, 80, 82, 85, 84, 87, 89, 88, 91, 94],
  },
  {
    id: "12mo",
    label: "12 months",
    data: [70, 68, 65, 72, 78, 74, 80, 76, 82, 88, 86, 94],
  },
];

const WIDTH = 280;
const HEIGHT = 92;
const PAD = 6;

function buildPath(data: number[]) {
  if (data.length === 0) return { line: "", area: "", points: [] as { x: number; y: number }[] };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const stepX = (WIDTH - PAD * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + (HEIGHT - PAD * 2) * (1 - (v - min) / range),
  }));

  let line = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    line += ` Q ${cx} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }
  const area = `${line} L ${points[points.length - 1].x} ${HEIGHT} L ${points[0].x} ${HEIGHT} Z`;
  return { line, area, points };
}

export interface ReviewSentimentTrendChartProps {
  className?: string;
}

export function ReviewSentimentTrendChart({ className }: ReviewSentimentTrendChartProps) {
  const [activeId, setActiveId] = useState<string>(SERIES[0].id);
  const active = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const { line, area, points } = useMemo(() => buildPath(active.data), [active.data]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const first = active.data[0];
  const last = active.data[active.data.length - 1];
  const delta = last - first;
  const deltaPct = (delta / first) * 100;
  const up = delta >= 0;
  const cur = hoverIdx !== null ? active.data[hoverIdx] : last;
  const hoverPoint = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-3">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SENTIMENT_TREND</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">NLP-scored review polarity · 0-100</span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">{cur}</span>
            <motion.span
              key={`delta-${activeId}`}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5",
                up
                  ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
                  : "text-rose-300 bg-rose-500/10 border-rose-500/25",
              )}
            >
              {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {up ? "+" : ""}
              {deltaPct.toFixed(1)}%
            </motion.span>
          </div>
        </div>
        <div className="flex gap-1 bg-secondary/30 p-0.5 rounded-md border border-white/[0.04]">
          {SERIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveId(s.id);
                setHoverIdx(null);
              }}
              aria-pressed={s.id === activeId}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-all",
                s.id === activeId ? "bg-card text-foreground font-bold" : "text-muted-foreground/60 hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-24 overflow-visible"
          role="img"
          aria-label={`Sentiment trend over ${active.label}, currently ${cur}`}
          onPointerLeave={() => setHoverIdx(null)}
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
            const stepX = (WIDTH - PAD * 2) / Math.max(1, active.data.length - 1);
            const i = Math.max(0, Math.min(active.data.length - 1, Math.round((x - PAD) / stepX)));
            setHoverIdx(i);
          }}
        >
          <defs>
            <linearGradient id="sentArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={up ? "rgb(52 211 153)" : "rgb(244 114 182)"} stopOpacity="0.35" />
              <stop offset="100%" stopColor={up ? "rgb(52 211 153)" : "rgb(244 114 182)"} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={PAD}
              x2={WIDTH - PAD}
              y1={PAD + (HEIGHT - PAD * 2) * t}
              y2={PAD + (HEIGHT - PAD * 2) * t}
              stroke="currentColor"
              className="text-white/[0.05]"
              strokeWidth={1}
            />
          ))}

          <motion.path
            key={`area-${activeId}`}
            d={area}
            fill="url(#sentArea)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            key={`line-${activeId}`}
            d={line}
            fill="none"
            stroke={up ? "rgb(52 211 153)" : "rgb(244 114 182)"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {hoverPoint && (
            <g>
              <line
                x1={hoverPoint.x}
                x2={hoverPoint.x}
                y1={PAD}
                y2={HEIGHT - PAD}
                stroke="currentColor"
                className="text-white/15"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <circle
                cx={hoverPoint.x}
                cy={hoverPoint.y}
                r={3.5}
                fill={up ? "rgb(52 211 153)" : "rgb(244 114 182)"}
                stroke="rgb(10 10 15)"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 font-mono mt-2">
        <span>start · {first}</span>
        <span>peak · {Math.max(...active.data)}</span>
        <span>now · {last}</span>
      </div>
    </div>
  );
}
