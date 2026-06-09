"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { cn } from "../lib/cn";

export function AmbientGlowModalSheet({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Ambient Modal Drawer</h3>
        <p className="text-[10px] text-muted-foreground">Drawer modal overlay showing glowing halos</p>
      </div>

      <div className="py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-primary text-xs font-bold transition-all cursor-pointer shadow-lg"
        >
          <Maximize2 className="w-4 h-4" />
          Launch Panel
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 cursor-pointer"
            />

            {/* Glowing Panel Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute left-0 right-0 bottom-0 bg-zinc-950 border-t border-border/40 p-5 z-40 rounded-t-2xl flex flex-col space-y-4 shadow-2xl overflow-hidden"
            >
              {/* Blurred background aura inside modal */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-primary/25 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-2 border-b border-border/30 z-10">
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Ambient Studio</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-zinc-900 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 z-10">
                <h4 className="text-sm font-bold text-foreground">Interactive Overlay Console</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  This modal features real-time backdrop blur filters and underlying spring-positioned vector spotlights.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
