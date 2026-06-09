"use client";

import React, { useState } from "react";
import { motion} from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export function SwipeSliderSwitchButton({ className }: { className?: string }) {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl flex items-center justify-between", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Interactive Pill Toggle</h3>
        <p className="text-[10px] text-muted-foreground">Drag or tap the spring capsule toggle</p>
      </div>

      <div
        onClick={() => setIsOn(!isOn)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOn(!isOn); } }}
        className={cn(
          "relative w-16 h-8 rounded-full border p-1 cursor-pointer select-none transition-colors duration-250 flex items-center",
          isOn ? "bg-primary border-primary/50" : "bg-zinc-950/60 border-border/40"
        )}
      >
        {/* Glowing aura inside toggle when ON */}
        {isOn && <div className="absolute inset-0 bg-white/10 rounded-full blur-sm" />}

        {/* Sliding circular knob */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="z-10 h-5.5 w-5.5 bg-white rounded-full flex items-center justify-center shadow-lg"
          style={{ x: isOn ? 32 : 0 }}
        >
          <Sparkles className={cn("w-3 h-3 transition-colors", isOn ? "text-primary" : "text-muted-foreground")} />
        </motion.div>
      </div>
    </div>
  );
}
