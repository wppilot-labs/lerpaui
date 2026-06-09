"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export function LiquidProgressRadialRing({ className }: { className?: string }) {
  const [progress, setProgress] = useState(70);

  // SVG parameters for radial circle
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-4", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Liquid Radial</h3>
          <p className="text-[10px] text-muted-foreground">Circular SVG progress indicators</p>
        </div>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-zinc-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Foreground progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary transition-all duration-300"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Value Label inside */}
        <div className="absolute text-base font-black text-foreground font-mono select-none">
          {progress}%
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}
