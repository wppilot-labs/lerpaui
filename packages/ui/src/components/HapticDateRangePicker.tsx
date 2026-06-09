"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

export function HapticDateRangePicker({ className }: { className?: string }) {
  const [startDate, setStartDate] = useState<number | null>(10);
  const [endDate, setEndDate] = useState<number | null>(20);
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const month = "May";
  const year = 2026;
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const totalDays = 31;
  const startDayIndex = 5; // Starts on Friday

  const handleDateClick = (day: number) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const isSelected = (day: number) => startDate === day || endDate === day;

  const isInRange = (day: number) => {
    if (startDate && endDate) {
      return day > startDate && day < endDate;
    }
    if (startDate && hoveredDate) {
      return day > startDate && day < hoveredDate;
    }
    return false;
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setHoveredDate(null);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[340px] rounded-2xl bg-zinc-950/80 border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl select-none text-white",
        className
      )}
    >
      {/* Background Neon Trail */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <CalendarIcon className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">{month} {year}</h3>
            <p className="text-[10px] text-zinc-400 font-mono">HAPTIC_RANGE_PICKER_V1</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white active:scale-90 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Week headers */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx}>{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-y-1">
          {/* Empty spacer frames */}
          {Array.from({ length: startDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8" />
          ))}

          {/* Date cells */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const day = idx + 1;
            const selected = isSelected(day);
            const inRange = isInRange(day);
            const isStart = startDate === day;
            const isEnd = endDate === day;

            return (
              <div
                key={`day-${day}`}
                className="relative h-8 flex items-center justify-center"
                onMouseEnter={() => !endDate && setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Elastic Range highlight connection path */}
                {inRange && (
                  <motion.div
                    layoutId="range-bg"
                    className="absolute inset-y-1 inset-x-0 bg-violet-500/20 border-y border-violet-500/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Left curve cap for Range Start */}
                {isStart && endDate && (
                  <div className="absolute inset-y-1 right-0 left-1/2 bg-violet-500/20 pointer-events-none" />
                )}

                {/* Right curve cap for Range End */}
                {isEnd && startDate && (
                  <div className="absolute inset-y-1 left-0 right-1/2 bg-violet-500/20 pointer-events-none" />
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all duration-150 cursor-pointer z-10",
                    selected
                      ? "bg-violet-600 border-violet-500 text-white font-bold shadow-md shadow-violet-500/20"
                      : inRange
                      ? "border-transparent text-violet-300"
                      : "bg-transparent border-transparent text-zinc-300 hover:text-white"
                  )}
                >
                  {day}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Range Display Output Summary */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div>
          <span className="text-[9px] text-zinc-500 block mb-0.5">CHECK_IN</span>
          <p className="text-white font-bold">{startDate ? `May ${startDate}, 2026` : "--"}</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-zinc-500 block mb-0.5">CHECK_OUT</span>
          <p className="text-white font-bold">{endDate ? `May ${endDate}, 2026` : "--"}</p>
        </div>
      </div>
    </div>
  );
}
