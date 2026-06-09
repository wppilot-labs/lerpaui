"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export function HapticDateCalendarPicker({ className }: { className?: string }) {
  const [selectedDate, setSelectedDate] = useState<number | null>(22);
  const [_direction, _setDirection] = useState(0);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Haptic Calendar</h3>
          <p className="text-[10px] text-muted-foreground">Select date with spring transitions</p>
        </div>
        <Calendar className="w-4 h-4 text-primary" />
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-foreground px-1">
        <span>May 2026</span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-zinc-800 border border-border/30 rounded cursor-pointer transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-zinc-800 border border-border/30 rounded cursor-pointer transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[9px] font-bold text-muted-foreground uppercase py-1">
            {d}
          </span>
        ))}

        {daysInMonth.map((day) => {
          const isSelected = selectedDate === day;
          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "h-7 w-7 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer border",
                isSelected
                  ? "bg-primary border-primary/50 text-white shadow-lg shadow-primary/20"
                  : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-900/60"
              )}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
