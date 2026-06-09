"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { BellRing, X } from "lucide-react";
import { cn } from "../lib/cn";

export function AmbientGlowToast({
  className,
}: {
  className?: string;
}) {
  const [active, setActive] = useState(false);

  const handleShow = () => {
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 4500);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <button
        onClick={handleShow}
        className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
      >
        Trigger Active Notification
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl p-[1.5px] overflow-hidden bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.35)] w-80 max-w-full"
          >
            {/* Animated active glow segment */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-primary/5 to-purple-500/20 opacity-80 blur-md pointer-events-none" />

            <div className="relative rounded-2xl bg-card p-4.5 z-10 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-0.5">
                  <BellRing className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-[11px] uppercase font-bold tracking-wider text-foreground">
                    Build Dispatched
                  </h5>
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-0.5">
                    Pipeline #1042 successfully initiated production compile.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive(false)}
                className="p-1 rounded-lg hover:bg-white/[0.04] text-muted-foreground/30 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
