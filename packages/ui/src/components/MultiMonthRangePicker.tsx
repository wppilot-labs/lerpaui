"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";
import { cn } from "../lib/cn";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthGrid {
  year: number;
  month: number;
  leading: number;
  days: number;
}

function buildMonth(year: number, month: number): MonthGrid {
  return {
    year,
    month,
    leading: new Date(year, month, 1).getDay(),
    days: new Date(year, month + 1, 0).getDate(),
  };
}

function dayKey(year: number, month: number, day: number): number {
  return year * 10000 + month * 100 + day;
}

export function MultiMonthRangePicker({ className }: { className?: string }) {
  const [anchor, setAnchor] = useState(() => new Date(2026, 4, 1));
  const [start, setStart] = useState<number | null>(dayKey(2026, 4, 12));
  const [end, setEnd] = useState<number | null>(dayKey(2026, 5, 4));
  const [hover, setHover] = useState<number | null>(null);

  const left = useMemo(() => buildMonth(anchor.getFullYear(), anchor.getMonth()), [anchor]);
  const right = useMemo(() => {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
    return buildMonth(d.getFullYear(), d.getMonth());
  }, [anchor]);

  const previewEnd = end ?? hover;
  const rangeStart = start;
  const rangeEnd = previewEnd && rangeStart ? (previewEnd >= rangeStart ? previewEnd : rangeStart) : null;
  const rangeLow = previewEnd && rangeStart ? Math.min(previewEnd, rangeStart) : rangeStart;

  const inRange = useCallback(
    (k: number) => {
      if (rangeLow == null || rangeEnd == null) return false;
      return k >= rangeLow && k <= rangeEnd;
    },
    [rangeLow, rangeEnd]
  );

  const handlePick = (k: number) => {
    if (start == null || (start != null && end != null)) {
      setStart(k);
      setEnd(null);
      return;
    }
    if (k < start) {
      setEnd(start);
      setStart(k);
    } else {
      setEnd(k);
    }
  };

  const shift = (dir: -1 | 1) => {
    setAnchor((a) => new Date(a.getFullYear(), a.getMonth() + dir, 1));
  };

  const nightsLabel =
    start && end
      ? Math.abs(
          Math.floor(
            (new Date(Math.floor(end / 10000), Math.floor((end % 10000) / 100), end % 100).getTime() -
              new Date(Math.floor(start / 10000), Math.floor((start % 10000) / 100), start % 100).getTime()) /
              86400000
          )
        )
      : 0;

  const renderMonth = (g: MonthGrid) => (
    <div className="flex-1">
      <div className="text-center text-[11px] font-semibold tracking-wider uppercase text-white/70 mb-2">
        {MONTHS[g.month]} {g.year}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-[9px] font-mono uppercase text-white/40 mb-1">
        {DOW.map((d, i) => (
          <div key={`${g.year}-${g.month}-h-${i}`} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: g.leading }).map((_, i) => (
          <div key={`pad-${g.year}-${g.month}-${i}`} className="h-7" />
        ))}
        {Array.from({ length: g.days }).map((_, i) => {
          const day = i + 1;
          const k = dayKey(g.year, g.month, day);
          const isStart = start === k;
          const isEnd = end === k || (!end && hover === k && start != null);
          const within = inRange(k);
          const isEdge = isStart || isEnd;
          const dateLabel = `${MONTHS[g.month]} ${day}, ${g.year}`;
          return (
            <div
              key={k}
              className="relative h-7 flex items-center justify-center"
              onMouseEnter={() => start != null && !end && setHover(k)}
              onMouseLeave={() => setHover(null)}
            >
              {within && !isEdge && (
                <div className="absolute inset-y-1 inset-x-0 bg-primary/15" />
              )}
              {within && isStart && (
                <div className="absolute inset-y-1 right-0 left-1/2 bg-primary/15" />
              )}
              {within && isEnd && start !== end && (
                <div className="absolute inset-y-1 left-0 right-1/2 bg-primary/15" />
              )}
              <motion.button
                type="button"
                onClick={() => handlePick(k)}
                whileTap={{ scale: 0.9 }}
                aria-label={dateLabel}
                aria-selected={isEdge}
                className={cn(
                  "relative z-10 w-7 h-7 rounded-full text-[11px] font-mono flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isEdge
                    ? "bg-primary text-black font-bold"
                    : within
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {day}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[560px] text-white",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">MULTI_MONTH_RANGE</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Hover preview across months</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {renderMonth(left)}
        <div className="w-px bg-white/5" />
        {renderMonth(right)}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-white/60">
          <CalendarRange className="w-3.5 h-3.5 text-primary" />
          <span>
            {start
              ? new Date(Math.floor(start / 10000), Math.floor((start % 10000) / 100), start % 100).toLocaleDateString("en", { month: "short", day: "numeric" })
              : "Pick start"}
            {" → "}
            {end
              ? new Date(Math.floor(end / 10000), Math.floor((end % 10000) / 100), end % 100).toLocaleDateString("en", { month: "short", day: "numeric" })
              : hover && start != null
                ? new Date(Math.floor(hover / 10000), Math.floor((hover % 10000) / 100), hover % 100).toLocaleDateString("en", { month: "short", day: "numeric" })
                : "Pick end"}
          </span>
        </div>
        <span className="text-white/40">{nightsLabel} nights</span>
      </div>
    </div>
  );
}
