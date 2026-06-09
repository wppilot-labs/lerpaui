"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function KineticTypographyReveal({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center min-h-[140px]", className)}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer select-none space-y-1.5 text-center"
      >
        <motion.h4
          animate={{ scale: isHovered ? 1.06 : 1, color: isHovered ? "var(--color-primary, #3b82f6)" : "var(--color-foreground)" }}
          className="text-lg font-black tracking-widest uppercase transition-colors"
        >
          KINETIC STUDIO
        </motion.h4>
        <motion.p
          animate={{ y: isHovered ? -2 : 0, opacity: isHovered ? 1 : 0.6 }}
          className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest"
        >
          Hover mouse to trigger spring coordinate lift
        </motion.p>
      </div>
    </div>
  );
}
