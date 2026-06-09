'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { SlidersHorizontal, Info, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface MatrixCell {
  row: number;
  col: number;
  value: number; // 0 to 100
  label?: string;
}

interface ResponsiveHeatmapMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: string[];
  columns?: string[];
  initialThreshold?: number;
}

const DEFAULT_ROWS = [
  'Database Read',
  'API Request',
  'Cache Lookup',
  'CDN Routing',
  'Auth Validation',
  'SMTP Deliveries',
  'File Operations',
  'Microservice Call',
];

const DEFAULT_COLUMNS = [
  '00:00',
  '03:00',
  '06:00',
  '09:00',
  '12:00',
  '15:00',
  '18:00',
  '21:00',
];

export function ResponsiveHeatmapMatrix({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  initialThreshold = 10,
  className,
  ...props
}: ResponsiveHeatmapMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [threshold, setThreshold] = useState(initialThreshold);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Generate deterministic grid data based on row/column labels
  const cellData = useMemo(() => {
    const list: MatrixCell[] = [];
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < columns.length; c++) {
        // Deterministic but organic mathematical layout values (0 to 100)
        const rawValue = Math.round(
          ((Math.sin(r * 0.8) + Math.cos(c * 1.2) + 2) / 4) * 80 +
          Math.sin((r + c) * 0.5) * 15 +
          5
        );
        const value = Math.max(0, Math.min(100, rawValue));
        list.push({ row: r, col: c, value });
      }
    }
    return list;
  }, [rows, columns]);

  // Map values to Tailwind gradient color classes
  const getCellColor = (value: number, isFiltered: boolean) => {
    if (isFiltered) return 'bg-zinc-900 border-zinc-950 text-zinc-700 opacity-20';

    if (value < 20) return 'bg-zinc-800/80 border-zinc-900 text-zinc-500';
    if (value < 40) return 'bg-purple-950/60 border-purple-900/60 text-purple-400';
    if (value < 65) return 'bg-purple-800/80 border-purple-700/80 text-purple-200';
    if (value < 85) return 'bg-indigo-600/90 border-indigo-500 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.25)]';
    return 'bg-pink-500 border-pink-400 text-white font-extrabold shadow-[0_0_15px_rgba(236,72,153,0.55)]';
  };

  const currentHoveredCellData = useMemo(() => {
    if (!hoveredCell) return null;
    return cellData.find((cell) => cell.row === hoveredCell.r && cell.col === hoveredCell.c);
  }, [hoveredCell, cellData]);

  return (
    <div
      className={cn(
        "relative w-full bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-3xl text-white select-none",
        className
      )}
      {...props}
    >
      {/* SaaS Dashboard Title & Sliders */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full w-fit mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-300">
              CLUSTER PERFORMANCE DENSITY MATRIX
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            SaaS Infrastructure Heatmap
          </h2>
        </div>

        {/* Real-time slider filter threshold */}
        <div className="flex items-center space-x-4 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl min-w-[280px]">
          <SlidersHorizontal className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center text-[10px] font-bold font-mono text-zinc-400 mb-1">
              <span>MIN THRESHOLD FILTER</span>
              <span className="text-indigo-400 font-black">{threshold}%</span>
            </div>
            <input
              type="range"
              aria-label="Minimum threshold filter"
              min="0"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Heatmap Matrix Container */}
      <div className="relative overflow-x-auto pb-4">
        <div className="min-w-[640px] relative">
          
          {/* Header Row: Columns */}
          <div className="grid grid-cols-9 gap-2 mb-2 items-center">
            {/* Top-left corner spacer */}
            <div className="col-span-2 text-[10px] font-bold font-mono text-zinc-600 tracking-wider text-right pr-4">
              OPERATIONS
            </div>
            
            {/* Columns labels */}
            {columns.map((col, cIdx) => {
              const isColHovered = hoveredCell?.c === cIdx;
              return (
                <div
                  key={col}
                  className={cn(
                    "text-center py-2 text-xs font-black font-mono tracking-wider transition-colors duration-300 rounded-md",
                    isColHovered ? "text-indigo-400 bg-zinc-900/80 border border-zinc-800 shadow-[0_0_8px_rgba(99,102,241,0.1)]" : "text-zinc-500"
                  )}
                >
                  {col}
                </div>
              );
            })}
          </div>

          {/* Matrix Grid Rows */}
          <div className="space-y-2">
            {rows.map((row, rIdx) => {
              const isRowHovered = hoveredCell?.r === rIdx;

              return (
                <div
                  key={row}
                  className={cn(
                    "grid grid-cols-9 gap-2 items-center rounded-xl transition-all duration-300 relative border border-transparent",
                    isRowHovered && "bg-zinc-900/40 border-zinc-800/60 shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]"
                  )}
                >
                  {/* Row Label */}
                  <div
                    className={cn(
                      "col-span-2 text-right pr-4 text-xs font-black font-mono tracking-tight transition-colors duration-300 truncate",
                      isRowHovered ? "text-indigo-400" : "text-zinc-400"
                    )}
                  >
                    {row}
                  </div>

                  {/* Row Cells */}
                  {columns.map((_, cIdx) => {
                    const cell = cellData.find((d) => d.row === rIdx && d.col === cIdx);
                    const cellVal = cell ? cell.value : 0;
                    const isFiltered = cellVal < threshold;
                    const isCellHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;
                    const isCrosshairHovered = hoveredCell?.r === rIdx || hoveredCell?.c === cIdx;

                    return (
                      <motion.div
                        key={`${rIdx}-${cIdx}`}
                        onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.12, zIndex: 10 }}
                        className={cn(
                          "relative aspect-square rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-300 text-[10px] font-mono",
                          getCellColor(cellVal, isFiltered),
                          isCrosshairHovered && !isFiltered && "border-indigo-500/30",
                          isCellHovered && "ring-2 ring-indigo-400 border-white/20 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                        )}
                      >
                        {/* Display values inside cell */}
                        {!isFiltered && (
                          <span className={cn(cellVal > 70 ? "text-white font-bold" : "opacity-85")}>
                            {cellVal}
                          </span>
                        )}

                        {/* Trailing Crosshair Neon Glow (Overlay inside crosshair columns/rows) */}
                        {isCrosshairHovered && !isCellHovered && !isFiltered && (
                          <span className="absolute inset-0 bg-indigo-500/10 rounded-lg pointer-events-none animate-pulse" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Stats Details Panel & Interactive Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-zinc-800">
        
        {/* Real-time cell analytics inspector */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-center min-h-[100px]">
          <AnimatePresence mode="wait">
            {currentHoveredCellData ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                <div className="flex justify-between items-center text-xs font-bold font-mono text-zinc-400">
                  <span>METRIC INSPECTOR</span>
                  <span className="text-zinc-600">ID: {currentHoveredCellData.row}-{currentHoveredCellData.col}</span>
                </div>
                <div className="text-sm font-black text-white">
                  {rows[currentHoveredCellData.row]} @ {columns[currentHoveredCellData.col]}
                </div>
                <div className="flex items-center space-x-2 text-lg font-black font-mono">
                  <span className="text-indigo-400">{currentHoveredCellData.value}% load</span>
                  {currentHoveredCellData.value >= 85 ? (
                    <span className="text-xs font-black text-rose-500 bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-md flex items-center space-x-1 font-mono">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>CRITICAL DETECTED</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/15 border border-emerald-400/20 px-2 py-0.5 rounded-md font-mono">
                      STABLE HEALTH
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-500 flex items-center space-x-2 text-xs font-bold font-mono"
              >
                <Info className="w-4 h-4 text-zinc-600" />
                <span>HOVER ANY MATRIX CELL TO INSPECT CRITICAL METRICS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic heatmap legends */}
        <div className="flex flex-col justify-center space-y-2.5">
          <div className="text-[10px] font-bold font-mono tracking-widest text-zinc-500">
            PERFORMANCE LEGEND COLOR SCALE
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-900" />
              <span className="w-5 h-5 rounded bg-purple-950/60 border border-purple-900/60" />
              <span className="w-5 h-5 rounded bg-purple-800/80 border border-purple-700/80" />
              <span className="w-5 h-5 rounded bg-indigo-600 border border-indigo-500" />
              <span className="w-5 h-5 rounded bg-pink-500 border border-pink-400" />
            </div>
            <div className="flex justify-between flex-1 text-[10px] font-bold font-mono text-zinc-400 px-1">
              <span>IDLE (0-20%)</span>
              <span className="text-pink-500">PEAK (85-100%)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
