"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "../lib/cn";

export function CircularScheduleTimer({ className }: { className?: string }) {
  const [activeHour, setActiveHour] = useState(9);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={cn("w-full max-w-[280px] rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Orbital Clock</h3>
          <p className="text-[10px] text-muted-foreground">Hourly scheduler mapping dial</p>
        </div>
        <Clock className="w-4 h-4 text-primary" />
      </div>

      <div className="relative w-44 h-44 rounded-full border border-border/40 bg-zinc-950/60 flex items-center justify-center shadow-lg">
        {/* Inner Hub */}
        <div className="z-10 w-16 h-16 rounded-full bg-zinc-900 border border-border/60 flex flex-col items-center justify-center text-center shadow-inner">
          <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Selected</span>
          <span className="text-sm font-black text-primary font-mono mt-0.5">{activeHour}:00</span>
        </div>

        {/* Orbit Hours */}
        {hours.map((hour, idx) => {
          const angle = (idx * 30 * Math.PI) / 180 - Math.PI / 2;
          const radius = 64; // distance from center
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const isActive = activeHour === hour;

          return (
            <button
              key={hour}
              onClick={() => setActiveHour(hour)}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              className={cn(
                "absolute h-6.5 w-6.5 rounded-full text-[9px] font-bold font-mono transition-all flex items-center justify-center border cursor-pointer",
                isActive
                  ? "bg-primary border-primary/50 text-white shadow-lg shadow-primary/20 scale-110"
                  : "bg-zinc-900 border-border/30 text-muted-foreground hover:text-foreground hover:bg-zinc-800"
              )}
            >
              {hour}
            </button>
          );
        })}
      </div>
    </div>
  );
}
