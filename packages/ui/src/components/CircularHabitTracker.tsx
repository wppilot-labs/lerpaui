"use client";

import React, { useState } from "react";
import { Check, Flame } from "lucide-react";
import { cn } from "../lib/cn";

interface HabitDay {
  day: string;
  done: boolean;
}

export function CircularHabitTracker({ className }: { className?: string }) {
  const [habitDays, setHabitDays] = useState<HabitDay[]>([
    { day: "M", done: true },
    { day: "T", done: true },
    { day: "W", done: false },
    { day: "T", done: true },
    { day: "F", done: false },
    { day: "S", done: false },
    { day: "S", done: false },
  ]);

  const toggleDay = (idx: number) => {
    const updated = [...habitDays];
    updated[idx].done = !updated[idx].done;
    setHabitDays(updated);
  };

  const completedCount = habitDays.filter(h => h.done).length;

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Habit Tracker</h3>
          <p className="text-[10px] text-muted-foreground">Toggle daily status milestone rings</p>
        </div>
        <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
          <Flame className="w-4 h-4 animate-bounce" />
          <span>{completedCount} Day Streak</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-zinc-950/60 p-3 rounded-xl border border-border/30">
        {habitDays.map((h, idx) => (
          <button
            key={idx}
            onClick={() => toggleDay(idx)}
            className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <span className="text-[8px] font-bold text-muted-foreground">{h.day}</span>
            <div className={cn(
              "w-7 h-7 rounded-full border flex items-center justify-center transition-all",
              h.done
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10"
                : "bg-zinc-900 border-border/40 text-muted-foreground hover:bg-zinc-800"
            )}>
              {h.done ? <Check className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
