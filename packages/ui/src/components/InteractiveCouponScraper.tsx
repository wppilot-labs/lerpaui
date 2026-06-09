"use client";

import React, { useState } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { Ticket, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export function InteractiveCouponScraper({ className }: { className?: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-4", className)}>
      <div className="w-full flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Coupon</h3>
          <p className="text-[10px] text-muted-foreground">Tap and scratch ticket to reveal coupon</p>
        </div>
        <Ticket className="w-4 h-4 text-primary" />
      </div>

      <div
        onClick={() => setIsRevealed(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsRevealed(true); } }}
        className="relative w-56 h-28 rounded-xl overflow-hidden border border-border/40 cursor-pointer shadow-inner"
      >
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="scratch"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-neutral-900 flex flex-col items-center justify-center text-center p-4"
            >
              <Sparkles className="w-6 h-6 text-amber-400 mb-1.5 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Scratch Here</span>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center text-center p-4"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Your Coupon Code</span>
              <p className="text-base font-black text-primary font-mono tracking-wider mt-0.5">LAUNCH-400</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
