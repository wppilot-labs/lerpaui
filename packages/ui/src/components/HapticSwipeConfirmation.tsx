"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence} from "framer-motion";
import { ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

export function HapticSwipeConfirmation({ className, onConfirm }: { className?: string; onConfirm?: () => void }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  // Max width of swipe is container width minus handle width (50px) and padding (8px)
  const _xRange = [0, 240];
  const opacity = useTransform(x, [0, 180], [1, 0]);
  const progressWidth = useTransform(x, [0, 240], ["0%", "100%"]);

  const handleDragEnd = () => {
    if (x.get() >= 220) {
      setIsConfirmed(true);
      if (onConfirm) onConfirm();
    } else {
      x.set(0);
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    x.set(0);
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Haptic Action Slider</h3>
        <p className="text-[10px] text-muted-foreground">Swipe handle to execute secure operation</p>
      </div>

      <div
        ref={containerRef}
        className="relative h-12 bg-zinc-950/60 rounded-xl border border-border/40 flex items-center p-1 overflow-hidden"
      >
        {/* Dynamic progress highlight */}
        <motion.div
          style={{ width: progressWidth }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary/30 to-emerald-500/30 opacity-70"
        />

        <AnimatePresence>
          {!isConfirmed ? (
            <>
              {/* Sliding instruction text */}
              <motion.span
                style={{ opacity }}
                className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider uppercase select-none pointer-events-none"
              >
                Swipe to Confirm
              </motion.span>

              {/* Drag Handle */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 236 }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ x }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="z-10 h-10 w-10 bg-primary border border-primary/40 hover:bg-primary/95 rounded-lg flex items-center justify-center text-white cursor-grab active:cursor-grabbing shadow-lg shadow-primary/20"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-between px-4 w-full"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Action Authorized
                </span>
              </div>
              <button
                onClick={handleReset}
                className="p-1 hover:bg-zinc-800/80 border border-border/30 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
