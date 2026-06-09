"use client";

import React, { useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

export function AnalyticalSalesHeatmap({ className }: { className?: string }) {
  const [activeCell, setActiveCell] = useState<{ week: number; day: number; val: number } | null>(null);

  // Generate simple grid of 12 weeks x 5 days
  const grid = Array.from({ length: 12 }, (_, week) =>
    Array.from({ length: 5 }, (_, day) => ({
      week,
      day,
      val: Math.floor(Math.random() * 5),
    }))
  );

  const getIntensityClass = (val: number) => {
    if (val === 0) return "bg-zinc-900 border-zinc-800/80";
    if (val === 1) return "bg-primary/20 border-primary/30";
    if (val === 2) return "bg-primary/40 border-primary/50";
    if (val === 3) return "bg-primary/60 border-primary/70";
    return "bg-primary border-primary/80 shadow-[0_0_8px_var(--color-primary)]";
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Activity Analytics</h3>
          <p className="text-[10px] text-muted-foreground">Productivity contributions heatmap grid</p>
        </div>
        <TrendingUp className="w-4 h-4 text-primary" />
      </div>

      <div className="flex gap-1.5 p-2 bg-zinc-950/60 rounded-xl border border-border/30 overflow-x-auto">
        {grid.map((weekData, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {weekData.map((cell, dIdx) => (
              <div
                key={dIdx}
                onMouseEnter={() => setActiveCell(cell)}
                onMouseLeave={() => setActiveCell(null)}
                className={cn(
                  "w-3.5 h-3.5 rounded border transition-all duration-150 cursor-pointer",
                  getIntensityClass(cell.val)
                )}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="text-[10px] font-bold text-muted-foreground h-4 flex items-center justify-center">
        {activeCell ? (
          <span className="text-primary uppercase tracking-widest">
            Week {activeCell.week + 1}, Day {activeCell.day + 1} — {activeCell.val * 3} Contributions
          </span>
        ) : (
          <span className="uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hover cells for transaction details
          </span>
        )}
      </div>
    </div>
  );
}
