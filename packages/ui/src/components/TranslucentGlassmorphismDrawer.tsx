"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Sparkles, X, LayoutTemplate } from "lucide-react";
import { cn } from "../lib/cn";

interface TranslucentGlassmorphismDrawerProps {
  className?: string;
}

export function TranslucentGlassmorphismDrawer({ className }: TranslucentGlassmorphismDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between border border-white/5 bg-zinc-950/40 rounded-2xl p-6 shadow-2xl overflow-hidden font-sans select-none",
        className
      )}
      style={{ width: 340, height: 260 }}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">BOTTOM_DRAWER</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Click toggle to trigger bottom sheet</span>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-12 h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wide flex items-center gap-2 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-103"
      >
        <LayoutTemplate className="w-3.5 h-3.5" />
        Open Bottom Sheet
      </button>

      <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-auto">
        GESTURE_DRAG_SAFE
      </div>

      {/* Drawer Slide-up Sheet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 cursor-pointer"
            />

            {/* Bottom Sheet Modal Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 60 || velocity.y > 400) {
                  setIsOpen(false);
                }
              }}
              className="absolute bottom-0 left-0 right-0 h-44 bg-zinc-950/95 border-t border-white/10 rounded-t-2xl p-4 flex flex-col justify-between z-35 select-none shadow-[0_-10px_35px_rgba(0,0,0,0.5)]"
            >
              {/* Grab Bar handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full self-center cursor-row-resize" />

              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    LAUNCH_SECURE_COMPOSITOR
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  </span>
                  <span className="text-[8px] font-mono text-white/40">Drag down this sheet to close/dismiss</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 rounded-lg bg-zinc-900 border border-white/10 text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Sheet Body details */}
              <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                This responsive gestural sheet mimics native bottom dialogs, utilizing inertial drag triggers and elastic velocity damping parameters.
              </p>

              <div className="text-[7px] font-mono text-white/30 uppercase tracking-widest mt-2">
                PORT_OS_SECURE // READY
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
