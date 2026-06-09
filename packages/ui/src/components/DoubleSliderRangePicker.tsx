"use client";

import React, { useState, useRef } from "react";
import {motion, type PanInfo } from "framer-motion";
import { Filter } from "lucide-react";
import { cn } from "../lib/cn";

export function DoubleSliderRangePicker({ className }: { className?: string }) {
  const [minVal, setMinVal] = useState(20);
  const [maxVal, setMaxVal] = useState(80);
  const containerRef = useRef<HTMLDivElement>(null);

  // Width of track is assumed to be 240px inside container
  const handleMinDrag = (e: unknown, info: PanInfo) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = Math.min(Math.max(Math.round(((info.point.x - rect.left) / rect.width) * 100), 0), maxVal - 5);
    setMinVal(percent);
  };

  const handleMaxDrag = (e: unknown, info: PanInfo) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = Math.min(Math.max(Math.round(((info.point.x - rect.left) / rect.width) * 100), minVal + 5), 100);
    setMaxVal(percent);
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Double Range Slider</h3>
          <p className="text-[10px] text-muted-foreground">Dual-scrubber coordinate filters</p>
        </div>
        <Filter className="w-4 h-4 text-primary" />
      </div>

      <div className="space-y-4">
        {/* The slider range track */}
        <div ref={containerRef} className="relative h-2 bg-zinc-800 rounded-full w-full">
          {/* Active Range Fill */}
          <div
            style={{ left: `${minVal}%`, width: `${maxVal - minVal}%` }}
            className="absolute top-0 bottom-0 bg-primary rounded-full"
          />

          {/* Left Handle */}
          <motion.div
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            onDrag={handleMinDrag}
            style={{ left: `calc(${minVal}% - 8px)` }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary cursor-grab active:cursor-grabbing shadow-md z-20"
          />

          {/* Right Handle */}
          <motion.div
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            onDrag={handleMaxDrag}
            style={{ left: `calc(${maxVal}% - 8px)` }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary cursor-grab active:cursor-grabbing shadow-md z-20"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground pt-2">
          <span>Min: <span className="text-foreground">${minVal * 10}</span></span>
          <span>Max: <span className="text-foreground">${maxVal * 10}</span></span>
        </div>
      </div>
    </div>
  );
}
