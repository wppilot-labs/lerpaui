"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface WeekEvent {
  id: string;
  weekOffset: number;
  dayIdx: number;
  title: string;
  color: "primary" | "violet" | "cyan" | "amber";
}

const SAMPLE: WeekEvent[] = [
  { id: "w1", weekOffset: 0, dayIdx: 1, title: "Standup", color: "primary" },
  { id: "w2", weekOffset: 0, dayIdx: 1, title: "Design review", color: "violet" },
  { id: "w3", weekOffset: 0, dayIdx: 3, title: "Customer demo", color: "cyan" },
  { id: "w4", weekOffset: 0, dayIdx: 4, title: "1:1 Lin", color: "amber" },
  { id: "w5", weekOffset: 0, dayIdx: 5, title: "Beer + ship", color: "primary" },
  { id: "w6", weekOffset: 1, dayIdx: 0, title: "Quarterly plan", color: "violet" },
  { id: "w7", weekOffset: 1, dayIdx: 2, title: "Pair with Mia", color: "cyan" },
  { id: "w8", weekOffset: 1, dayIdx: 4, title: "Launch deck", color: "amber" },
  { id: "w9", weekOffset: -1, dayIdx: 3, title: "Retro", color: "primary" },
  { id: "w10", weekOffset: -1, dayIdx: 5, title: "Offsite prep", color: "violet" },
];

const COLOR_CHIP: Record<WeekEvent["color"], string> = {
  primary: "bg-primary/15 border-primary/40 text-primary",
  violet: "bg-violet-500/15 border-violet-400/40 text-violet-300",
  cyan: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300",
  amber: "bg-amber-500/15 border-amber-400/40 text-amber-200",
};

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function WeekStripScheduler({ className }: { className?: string }) {
  const today = useMemo(() => new Date(2026, 4, 25), []);
  const baseWeekStart = useMemo(() => startOfWeek(today), [today]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>("2026-5-25");

  const visibleStart = useMemo(() => addDays(baseWeekStart, weekOffset * 7), [baseWeekStart, weekOffset]);
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(visibleStart, i)), [visibleStart]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, WeekEvent[]>();
    SAMPLE.filter((e) => e.weekOffset === weekOffset).forEach((e) => {
      const key = `${e.weekOffset}-${e.dayIdx}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [weekOffset]);

  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[560px] text-white overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">WEEK_STRIP</span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">Scroll between weeks</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Jump to current week"
            onClick={() => setWeekOffset(0)}
            className="px-2 py-1 rounded-md border border-white/10 hover:bg-white/5 text-[10px] font-mono cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            TODAY
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="text-[10px] font-mono text-white/50 flex items-center gap-1.5">
        <Calendar className="w-3 h-3" />
        Week of {visibleStart.toLocaleDateString("en", { month: "short", day: "numeric" })}
      </div>

      <div className="relative h-[220px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={weekOffset}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="grid grid-cols-7 gap-1 h-full"
          >
            {days.map((d, i) => {
              const key = `${weekOffset}-${i}`;
              const dk = dayKey(d);
              const events = eventsByDay.get(key) ?? [];
              const isToday = d.toDateString() === today.toDateString();
              const isSelected = selectedDay === dk;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(dk)}
                  aria-label={d.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative flex flex-col gap-1 p-1.5 rounded-lg border text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                      ? "bg-white/[0.06] border-white/15"
                      : "bg-white/[0.015] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9px] font-mono uppercase text-white/40">{DOW[i].slice(0, 1)}</span>
                    <span
                      className={cn(
                        "text-sm font-mono font-bold",
                        isToday ? "text-primary" : "text-white/90"
                      )}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                  {isToday && (
                    <motion.div
                      layoutId="today-bar"
                      className="absolute top-0 left-1 right-1 h-px bg-primary"
                      transition={{ type: "spring", stiffness: 280, damping: 30 }}
                    />
                  )}
                  <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                    {events.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          "text-[8px] font-mono leading-tight px-1 py-0.5 rounded border truncate",
                          COLOR_CHIP[e.color]
                        )}
                      >
                        {e.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <span className="text-[8px] font-mono text-white/40 px-1">+{events.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
