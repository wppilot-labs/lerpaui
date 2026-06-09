"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Filter } from "lucide-react";
import { cn } from "../lib/cn";

interface Bucket {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
}

const BUCKETS: Bucket[] = [
  { stars: 5, count: 1842 },
  { stars: 4, count: 612 },
  { stars: 3, count: 184 },
  { stars: 2, count: 73 },
  { stars: 1, count: 41 },
];

export interface RatingDistributionInteractiveProps {
  className?: string;
}

export function RatingDistributionInteractive({ className }: RatingDistributionInteractiveProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const total = BUCKETS.reduce((acc, b) => acc + b.count, 0);
  const max = Math.max(...BUCKETS.map((b) => b.count));
  const avg = BUCKETS.reduce((acc, b) => acc + b.stars * b.count, 0) / total;
  const filteredTotal = selected.size === 0 ? total : BUCKETS.filter((b) => selected.has(b.stars)).reduce((a, b) => a + b.count, 0);

  const toggle = (s: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-4">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">RATING_DISTRIBUTION</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Click rows to filter reviews</span>
      </div>

      <div className="flex items-end justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums">{avg.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-white/20",
                )}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono tabular-nums">{total.toLocaleString()} reviews</p>
        </div>
        <motion.div
          key={filteredTotal}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-right"
        >
          <div className="flex items-center gap-1 justify-end mb-0.5">
            <Filter className="w-2.5 h-2.5 text-primary" />
            <span className="text-[9px] uppercase font-bold text-primary tracking-wider">Showing</span>
          </div>
          <span className="text-sm font-bold tabular-nums text-foreground">{filteredTotal.toLocaleString()}</span>
        </motion.div>
      </div>

      <ul className="space-y-1.5" role="group" aria-label="Filter by star rating">
        {BUCKETS.map((b) => {
          const active = selected.has(b.stars);
          const dimmed = selected.size > 0 && !active;
          const pct = (b.count / total) * 100;
          const widthPct = (b.count / max) * 100;
          return (
            <li key={b.stars}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggle(b.stars)}
                className={cn(
                  "w-full flex items-center gap-2.5 p-1.5 rounded-lg group transition-all text-left",
                  active && "bg-primary/[0.08] ring-1 ring-primary/30",
                  !active && "hover:bg-white/[0.03]",
                  dimmed && "opacity-45",
                )}
              >
                <span className="flex items-center gap-0.5 w-6 shrink-0 tabular-nums">
                  <span className="text-[10px] font-bold text-foreground/80">{b.stars}</span>
                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                </span>
                <span className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden relative">
                  <motion.span
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full",
                      active ? "bg-primary" : "bg-yellow-400/70 group-hover:bg-yellow-400",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-9 text-right text-[10px] text-muted-foreground tabular-nums font-mono shrink-0">
                  {pct.toFixed(1)}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected.size > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelected(new Set())}
          className="mt-3 text-[10px] uppercase font-bold text-primary tracking-wider hover:underline focus-visible:underline"
        >
          Clear filter ({selected.size})
        </motion.button>
      )}
    </div>
  );
}
