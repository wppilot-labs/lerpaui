"use client";

import React from "react";
import { motion} from "framer-motion";
import { cn } from "../lib/cn";

interface TextRevealShearedMaskProps {
  text?: string;
  className?: string;
}

export function TextRevealShearedMask({
  text = "LAUNCH_ELITE",
  className,
}: TextRevealShearedMaskProps) {
  // Break word into individual character indexes
  const chars = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const charVariants = {
    hidden: { 
      y: 80, 
      rotate: 15,
      skewY: 10,
      opacity: 0 
    },
    visible: {
      y: 0,
      rotate: 0,
      skewY: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 140,
      },
    },
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden select-none",
        className
      )}
      style={{ width: 340, height: 140 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">TYPOGRAPHY_MASK</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Hover to replay reveal</span>
      </div>

      {/* Masked Character Reveal Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="flex items-center gap-1.5 overflow-hidden py-2"
      >
        {chars.map((char, idx) => (
          <div key={idx} className="overflow-hidden inline-block relative py-1">
            <motion.span
              variants={charVariants}
              className="inline-block text-3xl font-extrabold tracking-tighter text-white font-mono"
            >
              {char}
            </motion.span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
