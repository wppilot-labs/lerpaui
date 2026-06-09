"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring} from "framer-motion";
import { cn } from "../lib/cn";

export function ScrollTriggerProgressBar({
  className,
  targetContainerRef,
}: {
  className?: string;
  targetContainerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const backupRef = useRef<HTMLDivElement>(null);
  const scrollRef = targetContainerRef || backupRef;

  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
  });

  // Calculate coordinates and percentage
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <div
      ref={backupRef}
      className={cn(
        "relative rounded-2xl w-full h-[200px] border border-white/[0.04] bg-card flex flex-col items-center justify-center p-6 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-0.5">
        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
          Path Tracer
        </span>
        <span className="text-xs font-mono font-bold text-foreground">
          Scroll: {scrollPercent}%
        </span>
      </div>

      {/* SVG Path visual indicator */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="6"
          />
          {/* Animated Glow Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--color-primary, #a855f7)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              pathLength,
            }}
          />
        </svg>

        {/* Center Indicator */}
        <div className="flex flex-col items-center justify-center bg-black/40 w-[84px] h-[84px] rounded-full border border-white/[0.04] shadow-inner">
          <motion.span
            className="text-lg font-extrabold text-foreground tracking-tighter"
            animate={{ scale: scrollPercent > 0 ? 1.05 : 1 }}
          >
            {scrollPercent}%
          </motion.span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground/60">
            Progress
          </span>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-muted-foreground/50 max-w-[180px] text-center leading-relaxed">
        Scroll inside this sandbox or scroll target frame to test.
      </div>
    </div>
  );
}
