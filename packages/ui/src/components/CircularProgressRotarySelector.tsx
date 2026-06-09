"use client";

import React, { useRef, useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface CircularProgressRotarySelectorProps {
  size?: number;
  value?: number; // 0 to 100
  onChange?: (val: number) => void;
  className?: string;
}

export function CircularProgressRotarySelector({
  size = 200,
  value: initialValue = 45,
  onChange,
  className,
}: CircularProgressRotarySelectorProps) {
  const [val, setVal] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = size * 0.4;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (val / 100) * circumference;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only trigger while left-clicking/dragging

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let angleDeg = (angleRad * 180) / Math.PI + 90; // Offset by 90 to start top center

    if (angleDeg < 0) {
      angleDeg += 360;
    }

    const calculatedPercentage = Math.round((angleDeg / 360) * 100);
    setVal(calculatedPercentage);
    if (onChange) onChange(calculatedPercentage);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl p-6 cursor-pointer select-none",
        className
      )}
      style={{ width: size + 40, height: size + 40 }}
    >
      {/* Central Indicator Ring */}
      <svg width={size} height={size} className="transform -rotate-90 select-none">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active glowing indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: "drop-shadow(0 0 6px var(--primary))",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </svg>

      {/* Internal status labeling */}
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono select-none">
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">LEVEL</span>
        <motion.span className="text-3xl font-extrabold text-white tracking-tighter mt-1">
          {val}%
        </motion.span>
        <span className="text-[8px] text-primary/60 font-semibold mt-2 uppercase tracking-wide">DRAG DIAL</span>
      </div>
    </div>
  );
}
