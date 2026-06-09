"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";
import { cn } from "../lib/cn";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

const HIGHLIGHTS: { month: number; day: number; intensity: number }[] = [
  { month: 0, day: 15, intensity: 2 },
  { month: 1, day: 8, intensity: 3 },
  { month: 2, day: 22, intensity: 1 },
  { month: 3, day: 4, intensity: 2 },
  { month: 4, day: 25, intensity: 3 },
  { month: 5, day: 11, intensity: 1 },
  { month: 6, day: 18, intensity: 2 },
  { month: 8, day: 9, intensity: 3 },
  { month: 9, day: 30, intensity: 2 },
  { month: 11, day: 14, intensity: 1 },
];

interface MonthMeta {
  leading: number;
  days: number;
}

function buildMeta(year: number, month: number): MonthMeta {
  return {
    leading: new Date(year, month, 1).getDay(),
    days: new Date(year, month + 1, 0).getDate(),
  };
}

export function YearOverviewMiniMap({ className }: { className?: string }) {
  const [year, setYear] = useState(2026);
  const [zoomed, setZoomed] = useState<number | null>(null);

  const metas = useMemo(() => MONTHS_SHORT.map((_, m) => buildMeta(year, m)), [year]);
  const highlightMap = useMemo(() => {
    const map = new Map<string, number>();
    HIGHLIGHTS.forEach((h) => map.set(`${h.month}-${h.day}`, h.intensity));
    return map;
  }, []);

  const dotColor = (intensity: number) => {
    if (intensity >= 3) return "bg-primary shadow-[0_0_4px_rgba(201,255,55,0.6)]";
    if (intensity >= 2) return "bg-primary/70";
    return "bg-primary/40";
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[480px] text-white",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">YEAR_MAP</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Click a month to zoom</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous year"
            onClick={() => setYear((y) => y - 1)}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-white/80 w-12 text-center">{year}</span>
          <button
            type="button"
            aria-label="Next year"
            onClick={() => setYear((y) => y + 1)}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {MONTHS_SHORT.map((label, m) => {
          const meta = metas[m];
          const cellCount = meta.leading + meta.days;
          const rows = Math.ceil(cellCount / 7);
          return (
            <motion.button
              key={`${year}-${m}`}
              type="button"
              onClick={() => setZoomed(m)}
              whileHover={{ y: -1 }}
              aria-label={`Zoom into ${MONTHS_FULL[m]} ${year}`}
              className="flex flex-col gap-1 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-[9px] font-mono uppercase text-white/50 text-left">{label}</span>
              <div
                className="grid grid-cols-7 gap-[2px]"
                style={{ gridTemplateRows: `repeat(${rows}, 4px)` }}
              >
                {Array.from({ length: meta.leading }).map((_, i) => (
                  <div key={`p-${i}`} className="w-1 h-1" />
                ))}
                {Array.from({ length: meta.days }).map((_, i) => {
                  const day = i + 1;
                  const intensity = highlightMap.get(`${m}-${day}`);
                  return (
                    <div
                      key={day}
                      className={cn(
                        "w-1 h-1 rounded-sm",
                        intensity ? dotColor(intensity) : "bg-white/10"
                      )}
                    />
                  );
                })}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {zoomed != null && (
          <motion.div
            key={`zoom-${zoomed}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 pt-3 mt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white">
                  {MONTHS_FULL[zoomed]} {year}
                </span>
                <button
                  type="button"
                  onClick={() => setZoomed(null)}
                  aria-label="Close zoom"
                  className="text-[10px] font-mono text-white/50 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:underline"
                >
                  CLOSE
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-white/40 mb-1">
                {DOW.map((d, i) => (
                  <div key={i} className="text-center">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: metas[zoomed].leading }).map((_, i) => (
                  <div key={`pz-${i}`} className="h-7" />
                ))}
                {Array.from({ length: metas[zoomed].days }).map((_, i) => {
                  const day = i + 1;
                  const intensity = highlightMap.get(`${zoomed}-${day}`) ?? 0;
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-label={`${MONTHS_FULL[zoomed]} ${day}, ${year}`}
                      className={cn(
                        "h-7 rounded-md text-[10px] font-mono flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        intensity
                          ? "bg-primary/15 border border-primary/30 text-white"
                          : "bg-white/[0.02] border border-white/5 text-white/60 hover:bg-white/5"
                      )}
                    >
                      <span>{day}</span>
                      {intensity > 0 && (
                        <span className={cn("absolute mt-4 w-1 h-1 rounded-full", dotColor(intensity))} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[9px] font-mono text-white/40">
                <Grid3x3 className="w-3 h-3" />
                <span>{[...highlightMap.keys()].filter((k) => k.startsWith(`${zoomed}-`)).length} events</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
