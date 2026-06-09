"use client";

import React, { useState } from "react";

import { Clock } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveTimeSelector({ className }: { className?: string }) {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);

  const incrementHour = () => setHour((prev) => (prev % 12) + 1);
  const decrementHour = () => setHour((prev) => (prev === 1 ? 12 : prev - 1));

  const incrementMinute = () => setMinute((prev) => (prev + 5) % 60);
  const decrementMinute = () => setMinute((prev) => (prev === 0 ? 55 : prev - 5));

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Time Drum</h3>
          <p className="text-[10px] text-muted-foreground">Tactile hour and minute stepper selector</p>
        </div>
        <Clock className="w-4 h-4 text-primary" />
      </div>

      <div className="flex items-center gap-6 bg-zinc-950/60 border border-border/30 rounded-2xl p-4 w-full justify-center">
        {/* Hour Drum */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={incrementHour}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ▲
          </button>
          <div className="text-2xl font-mono font-bold text-primary select-none px-2.5">
            {hour.toString().padStart(2, "0")}
          </div>
          <button
            onClick={decrementHour}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ▼
          </button>
        </div>

        <span className="text-2xl font-bold text-muted-foreground">:</span>

        {/* Minute Drum */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={incrementMinute}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ▲
          </button>
          <div className="text-2xl font-mono font-bold text-primary select-none px-2.5">
            {minute.toString().padStart(2, "0")}
          </div>
          <button
            onClick={decrementMinute}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
