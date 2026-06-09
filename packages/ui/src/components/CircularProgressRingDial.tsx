"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function CircularProgressRingDial({
  className,
  min = 0,
  max = 100,
  defaultValue = 45,
  onChange,
}: {
  className?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateAngle = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return 0;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle in radians, then convert to degrees
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Adjust angle so that it starts from the top (90 degrees offset)
    angle = (angle + 90 + 360) % 360;
    return angle;
  };

  const handleUpdate = (clientX: number, clientY: number) => {
    const angle = calculateAngle(clientX, clientY);
    // Convert angle (0-360) to value percentage
    const percent = angle / 360;
    const val = Math.round(min + percent * (max - min));
    setValue(val);
    if (onChange) onChange(val);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleUpdate(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleUpdate(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-bind listeners when drag state changes
  }, [isDragging]);

  const percentage = (value - min) / (max - min);
  const strokeDashoffset = 251.2 - 251.2 * percentage;

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      onMouseDown={handleMouseDown}
      className={cn(
        "relative w-28 h-28 rounded-full border border-white/[0.04] bg-white/[0.01] flex items-center justify-center cursor-pointer select-none",
        className
      )}
    >
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-primary, #a855f7)"
          strokeWidth="6"
          strokeDasharray="251.2"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-75"
        />
      </svg>

      {/* Internal knob */}
      <div className="w-20 h-20 rounded-full bg-card shadow-lg flex flex-col items-center justify-center border border-white/[0.06] select-none pointer-events-none">
        <span className="text-xl font-extrabold text-foreground">{value}</span>
        <span className="text-[7px] uppercase tracking-wider text-muted-foreground/60">
          Rotary Dial
        </span>
      </div>

      {/* Interactive indicator pin dot */}
      <motion.div
        className="absolute w-3.5 h-3.5 bg-primary rounded-full border border-white shadow-md cursor-pointer"
        style={{
          transform: `rotate(${percentage * 360}deg) translateY(-40px)`,
        }}
      />
    </div>
  );
}
