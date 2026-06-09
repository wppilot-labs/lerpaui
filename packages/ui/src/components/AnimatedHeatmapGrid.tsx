"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AnimatedHeatmapGridProps {
  className?: string;
  /** Number of grid rows. */
  rows?: number;
  /** Number of grid columns. */
  cols?: number;
  /** Header label. */
  label?: string;
  /** Singular unit name shown in the hover readout (e.g. "builds", "commits"). */
  unit?: string;
  /** Optional pre-computed values; otherwise a deterministic seed pattern is generated. */
  data?: number[][];
}

function generateDefaultGrid(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const seed = Math.sin(r * 0.6 + c * 0.4) * Math.cos(r * 0.3 - c * 0.5);
      return Math.floor(Math.max(0, seed * 12 + 4));
    })
  );
}

export const AnimatedHeatmapGrid: React.FC<AnimatedHeatmapGridProps> = ({
  className,
  rows = 5,
  cols = 8,
  label = "Activity Grid",
  unit = "builds",
  data,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; count: number } | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const grid = data ?? generateDefaultGrid(rows, cols);
  const colCount = grid[0]?.length ?? cols;

  return (
    <div className={cn('p-5 rounded-2xl border border-border bg-card/85 backdrop-blur-md shadow-lg select-none max-w-[340px] relative', className)}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
          <TrendingUp className="w-3 h-3" />
          <span>Active</span>
        </div>
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(" + colCount + ", minmax(0, 1fr))" }}>
        {grid.map((row, rIdx) => 
          row.map((count, cIdx) => {
            // Pick color opacity depending on commits count
            const bgOpacity = count === 0 ? 0.05 : count < 4 ? 0.25 : count < 8 ? 0.55 : 0.9;
            const bgColor = count === 0 ? 'bg-muted-foreground/20' : 'bg-amber-500';

            return (
              <motion.div
                key={rIdx + "-" + cIdx}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.25, zIndex: 10 }}
                onMouseEnter={() => setHoveredCell({ x: cIdx, y: rIdx, count })}
                onMouseLeave={() => setHoveredCell(null)}
                style={{ opacity: bgOpacity }}
                className={cn('aspect-square rounded-md transition-shadow duration-300 hover:shadow-[0_0_8px_rgba(245,158,11,0.6)] cursor-crosshair', bgColor)}
              />
            );
          })
        )}
      </div>

      {/* Floating coordinates description */}
      <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-[10px] text-muted-foreground font-semibold h-4">
        <AnimatePresence>
          {hoveredCell ? (
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : undefined}
              className="text-foreground font-mono flex items-center gap-1.5"
            >
              <span>Coords: [{hoveredCell.x}, {hoveredCell.y}]</span>
              <span className="text-amber-400 font-bold">• {hoveredCell.count} {unit}</span>
            </motion.span>
          ) : (
            <span>Hover matrix coordinate cells</span>
          )}
        </AnimatePresence>
        <div className="flex gap-1 items-center opacity-65 text-[9px]">
          <span>Less</span>
          <div className="w-2 h-2 rounded bg-amber-500/20" />
          <div className="w-2 h-2 rounded bg-amber-500/60" />
          <div className="w-2 h-2 rounded bg-amber-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
