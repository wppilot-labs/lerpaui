"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Freq = "daily" | "weekly" | "monthly";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const FREQ: { id: Freq; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

function buildRuleLabel(freq: Freq, interval: number, weekdays: number[]): string {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const intervalLabel = interval === 1 ? "" : ` ${interval}`;
  if (freq === "daily") return `Every${intervalLabel || ""} day${interval > 1 ? "s" : ""}`;
  if (freq === "monthly") return `Every${intervalLabel || ""} month${interval > 1 ? "s" : ""}`;
  const selected = weekdays.sort((a, b) => a - b).map((d) => dayNames[d]);
  if (!selected.length) return `Every${intervalLabel} week${interval > 1 ? "s" : ""}`;
  return `Every${intervalLabel} week${interval > 1 ? "s" : ""} on ${selected.join(", ")}`;
}

function computeMatches(freq: Freq, interval: number, weekdays: number[], start: Date, count: number): Date[] {
  const out: Date[] = [];
  const cursor = new Date(start);
  let safety = 0;
  while (out.length < count && safety < 5000) {
    safety++;
    if (freq === "daily") {
      const diffDays = Math.floor((cursor.getTime() - start.getTime()) / 86400000);
      if (diffDays % interval === 0) out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    } else if (freq === "weekly") {
      const startWeek = Math.floor((cursor.getTime() - start.getTime()) / (7 * 86400000));
      if (startWeek % interval === 0 && (weekdays.length === 0 || weekdays.includes(cursor.getDay()))) {
        out.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    } else {
      const monthsSince = (cursor.getFullYear() - start.getFullYear()) * 12 + (cursor.getMonth() - start.getMonth());
      if (monthsSince % interval === 0 && cursor.getDate() === start.getDate()) {
        out.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return out;
}

export function RecurringEventBuilderPreview({ className }: { className?: string }) {
  const startDate = useMemo(() => new Date(2026, 4, 25), []);
  const [freq, setFreq] = useState<Freq>("weekly");
  const [interval, setInterval] = useState(2);
  const [weekdays, setWeekdays] = useState<number[]>([1, 3]);

  const matches = useMemo(() => computeMatches(freq, interval, weekdays, startDate, 60), [freq, interval, weekdays, startDate]);
  const matchKeys = useMemo(() => new Set(matches.map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)), [matches]);
  const ruleLabel = buildRuleLabel(freq, interval, weekdays);

  const previewMonth = useMemo(() => {
    const m = startDate.getMonth();
    const y = startDate.getFullYear();
    return {
      year: y,
      month: m,
      leading: new Date(y, m, 1).getDay(),
      days: new Date(y, m + 1, 0).getDate(),
    };
  }, [startDate]);

  const toggleWeekday = (d: number) => {
    setWeekdays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-[420px] text-white",
        className
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">RECURRENCE_BUILDER</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Visual rule with live preview</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5">
          {FREQ.map((f) => {
            const active = f.id === freq;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFreq(f.id)}
                className={cn(
                  "relative flex-1 text-[10px] font-mono uppercase py-1.5 rounded-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active ? "text-black" : "text-white/60 hover:text-white"
                )}
                aria-pressed={active}
              >
                {active && (
                  <motion.div
                    layoutId="freq-bg"
                    className="absolute inset-0 rounded-md bg-primary"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 text-[11px] font-mono">
          <label htmlFor="interval-range" className="text-white/60">Every</label>
          <input
            id="interval-range"
            type="range"
            min={1}
            max={6}
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="flex-1 accent-primary cursor-pointer"
          />
          <span className="w-16 text-right text-white">
            {interval} {freq === "daily" ? "day" : freq === "weekly" ? "week" : "month"}{interval > 1 ? "s" : ""}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {freq === "weekly" && (
            <motion.div
              key="weekday-picker"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-7 gap-1">
                {DOW.map((d, i) => {
                  const on = weekdays.includes(i);
                  return (
                    <button
                      key={`dow-${i}`}
                      type="button"
                      onClick={() => toggleWeekday(i)}
                      aria-pressed={on}
                      aria-label={`Toggle ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i]}`}
                      className={cn(
                        "h-7 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        on
                          ? "bg-primary/20 border border-primary/60 text-primary"
                          : "bg-white/[0.02] border border-white/5 text-white/50 hover:text-white"
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 border border-primary/30 text-[10px] font-mono text-primary">
        <Repeat className="w-3 h-3" />
        <span className="truncate">{ruleLabel}</span>
        <Check className="w-3 h-3 ml-auto" />
      </div>

      <div>
        <div className="text-[9px] font-mono uppercase text-white/40 mb-1.5">
          {new Date(previewMonth.year, previewMonth.month).toLocaleDateString("en", { month: "long", year: "numeric" })}
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-[9px] font-mono text-white/40 mb-1">
          {DOW.map((d, i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: previewMonth.leading }).map((_, i) => (
            <div key={`p-${i}`} className="h-7" />
          ))}
          {Array.from({ length: previewMonth.days }).map((_, i) => {
            const day = i + 1;
            const k = `${previewMonth.year}-${previewMonth.month}-${day}`;
            const hit = matchKeys.has(k);
            const isStart = day === startDate.getDate();
            return (
              <div
                key={day}
                aria-label={`${new Date(previewMonth.year, previewMonth.month, day).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}${hit ? " — matches rule" : ""}`}
                className={cn(
                  "relative h-7 rounded-md flex items-center justify-center text-[10px] font-mono transition-colors",
                  isStart
                    ? "bg-primary text-black font-bold"
                    : hit
                      ? "bg-primary/15 border border-primary/30 text-white"
                      : "bg-white/[0.02] border border-white/5 text-white/50"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
