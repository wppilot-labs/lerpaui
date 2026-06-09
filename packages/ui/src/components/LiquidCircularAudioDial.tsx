"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "../lib/cn";

export function LiquidCircularAudioDial({
  className,
}: {
  className?: string;
}) {
  const [level, setLevel] = useState(4); // 0 to 8 volume bars
  const [muted, setMuted] = useState(false);

  const handleBarClick = (idx: number) => {
    setLevel(idx + 1);
    setMuted(false);
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const barsCount = 12;

  return (
    <div
      className={cn(
        "relative rounded-2xl w-full max-w-[200px] border border-white/[0.04] bg-card p-5 flex flex-col items-center gap-4 overflow-hidden",
        className
      )}
    >
      <div className="w-full flex items-center justify-between border-b border-white/[0.04] pb-2">
        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
          Volume Segment
        </span>
        <span className="text-[8px] text-muted-foreground/40 font-mono">
          Vol: {muted ? 0 : level * 12.5}%
        </span>
      </div>

      <div className="relative w-28 h-28 flex items-center justify-center select-none">
        {/* Render segmented concentric circles */}
        {Array.from({ length: barsCount }).map((_, idx) => {
          const angle = (idx * 360) / barsCount;
          const isActive = !muted && idx < level;

          return (
            <motion.div
              key={idx}
              onClick={() => handleBarClick(idx)}
              className={cn(
                "absolute w-1.5 h-6 rounded-full cursor-pointer transition-all duration-300 origin-bottom",
                isActive ? "bg-primary" : "bg-white/[0.03] border border-white/[0.04]"
              )}
              style={{
                transform: `rotate(${angle}deg) translateY(-36px)`,
                boxShadow: isActive ? "0 0 8px rgba(var(--primary-rgb), 0.3)" : undefined,
              }}
              whileHover={{ scaleY: 1.25 }}
            />
          );
        })}

        {/* Center control button */}
        <button
          onClick={handleMuteToggle}
          className="w-14 h-14 rounded-full bg-black/40 border border-white/[0.04] hover:border-primary/30 flex items-center justify-center text-muted-foreground/80 hover:text-primary transition-colors cursor-pointer shadow-lg z-10"
        >
          {muted || level === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
        </button>
      </div>
    </div>
  );
}
