"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Activity, Flame, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

interface HeatmapCell {
  day: number;
  month: string;
  commits: number;
}

export function AnalyticalHeatmapCalendar({ className }: { className?: string }) {
  const [hoveredCell, setHoveredCell] = useState<{ idx: number; rect: DOMRect | null } | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Mock heatmap grid data: 12 months * 7 days rows = 84 blocks
  const cells: HeatmapCell[] = Array.from({ length: 84 }).map((_, idx) => {
    const monthIdx = Math.floor(idx / 7);
    const dayOfWeek = idx % 7;
    // Weighted commits density distribution
    let commits = 0;
    const r = Math.random();
    if (r > 0.8) commits = Math.floor(Math.random() * 8) + 4; // High density
    else if (r > 0.4) commits = Math.floor(Math.random() * 4) + 1; // Medium density
    
    return {
      day: dayOfWeek + 1,
      month: months[monthIdx],
      commits,
    };
  });

  const getCellColor = (commits: number) => {
    if (commits === 0) return "bg-zinc-900 border-zinc-950 hover:bg-zinc-800";
    if (commits <= 2) return "bg-purple-950 border-purple-950/40 text-purple-200 hover:bg-purple-900";
    if (commits <= 4) return "bg-purple-800 border-purple-800/40 text-purple-100 hover:bg-purple-700";
    return "bg-purple-500 border-purple-500/40 text-white hover:bg-purple-400 shadow-sm shadow-purple-500/25";
  };

  const handleMouseEnter = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({ idx, rect });
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[380px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Background glowing particles */}
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Header Panel info */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Productivity Heatmap</h3>
            <p className="text-[10px] text-zinc-400 font-mono">HEATMAP_CALENDAR_V1</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>84_DAY_CYCLE</span>
        </div>
      </div>

      {/* Primary Heatmap Grid Wrapper */}
      <div className="relative z-10 w-full flex flex-col justify-center gap-2">
        {/* Months Label header */}
        <div className="flex justify-between px-1 text-[8px] font-bold font-mono text-zinc-600 uppercase tracking-widest">
          {months.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>

        {/* Heat Grid Blocks matrix */}
        <div className="grid grid-flow-col grid-rows-7 gap-1 w-full bg-white/[0.01] border border-white/5 p-2 rounded-xl">
          {cells.map((cell, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.25, zIndex: 10 }}
              onMouseEnter={(e) => handleMouseEnter(idx, e)}
              onMouseLeave={() => setHoveredCell(null)}
              className={cn(
                "w-[19px] aspect-square rounded-[3px] border transition-all duration-150 cursor-pointer relative",
                getCellColor(cell.commits)
              )}
            />
          ))}
        </div>
      </div>

      {/* Hovering Glassmorphic Tooltip Drawer */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-zinc-950/95 border border-white/15 shadow-xl text-[10px] font-mono text-zinc-300 max-w-[150px] backdrop-blur-2xl"
            style={{
              top: (hoveredCell.rect?.top || 0) - (containerRefRect()?.top || 0) - 50,
              left: (hoveredCell.rect?.left || 0) - (containerRefRect()?.left || 0) - 50,
            }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-white font-bold">{cells[hoveredCell.idx].commits} Commits</span>
            </div>
            <p className="text-[8px] text-zinc-500 uppercase">
              {cells[hoveredCell.idx].month} - Day {cells[hoveredCell.idx].day}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Metrics Indicator */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Less</span>
        <div className="flex gap-1">
          {[0, 2, 4, 8].map((c) => (
            <div key={c} className={cn("w-3.5 h-3.5 rounded-[2px]", getCellColor(c))} />
          ))}
        </div>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">More</span>
      </div>
    </div>
  );

  // Helper helper to get container rectangle
  function containerRefRect() {
    if (typeof window === "undefined") return null;
    const canvasEl = document.querySelector(".w-full.max-w-\\[380px\\]");
    return canvasEl?.getBoundingClientRect() || null;
  }
}
