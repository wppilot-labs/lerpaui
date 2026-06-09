"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

export function LiquidBlobMorphBackground({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden relative min-h-[140px]", className)}>
      {/* Liquid morphing visual blob behind content */}
      <motion.div
        animate={{
          scale: isHovered ? 1.3 : 1,
          rotate: isHovered ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-primary/20 blur-2xl pointer-events-none"
      />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="z-10 cursor-pointer space-y-1 w-full"
      >
        <span className="text-[8px] font-bold text-primary/80 uppercase tracking-widest">Liquid Backdrop</span>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Fluid Morph Blobs</h4>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Hover here to expand underlying SVG blur-filters in the background space.
        </p>
      </div>
    </div>
  );
}
