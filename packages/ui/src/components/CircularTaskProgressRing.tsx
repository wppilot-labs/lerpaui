"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export function CircularTaskProgressRing({ className }: { className?: string }) {
  const [activeTaskIndex, setActiveTaskIndex] = useState(2);

  const steps = ["Config", "Design", "Install", "Release"];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Interactive Milestones</h3>
        <p className="text-[10px] text-muted-foreground">Select current pipeline active status</p>
      </div>

      <div className="flex justify-between items-center bg-zinc-950/60 p-3.5 rounded-xl border border-border/30">
        {steps.map((step, idx) => {
          const isPassed = idx <= activeTaskIndex;
          const _isActive = idx === activeTaskIndex;

          return (
            <button
              key={step}
              onClick={() => setActiveTaskIndex(idx)}
              className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <span className="text-[8px] font-bold text-muted-foreground">{step}</span>
              <div className={cn(
                "w-7 h-7 rounded-full border flex items-center justify-center transition-all",
                isPassed
                  ? "bg-primary/20 border-primary text-primary shadow-md shadow-primary/15"
                  : "bg-zinc-900 border-border/40 text-muted-foreground hover:bg-zinc-800"
              )}>
                {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
