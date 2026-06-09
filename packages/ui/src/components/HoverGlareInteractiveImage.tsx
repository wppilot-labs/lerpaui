"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { cn } from "../lib/cn";

export function HoverGlareInteractiveImage({ className }: { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXSpring = useSpring(useTransform(y, [0, 1], [12, -12]), { stiffness: 180, damping: 20 });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-12, 12]), { stiffness: 180, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className={cn("w-full max-w-sm flex flex-col items-center justify-center p-4", className)}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
        className="relative w-56 h-36 rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden shadow-2xl cursor-pointer"
      >
        {/* Dynamic coordinate glowing spotlight reflection glare */}
        <motion.div
          style={{
            left: useTransform(x, [0, 1], ["-20%", "80%"]),
            top: useTransform(y, [0, 1], ["-20%", "80%"]),
          }}
          className="absolute w-32 h-32 rounded-full bg-white/15 blur-xl pointer-events-none"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 select-none">
          <span className="text-[8px] font-bold text-primary/80 uppercase tracking-widest">Interactive Glare</span>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">3D Reflector Panel</h4>
            <p className="text-[9px] text-white/60">Hover and tilt to track coordinate glare</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
