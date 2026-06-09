"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock, ArrowRight } from "lucide-react";

export function CartAbandonedRecoveryBanner() {
  const [seconds, setSeconds] = useState(599); // 10 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full max-w-md bg-card/45 backdrop-blur-xl border border-violet-500/20 p-4 rounded-xl shadow-lg select-none font-sans text-foreground flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-2.5 relative z-10">
        <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/20">
          <Sparkles className="w-4 h-4 text-violet-400" />
        </div>
        <div className="text-xs">
          <h4 className="font-black leading-none mb-1 text-violet-300">Claim 20% Off Your Cart!</h4>
          <p className="text-[10px] text-muted-foreground/60">Unlock items in your shopping bag now.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
        <span className="flex items-center gap-1 text-[10px] font-mono text-violet-300 font-bold bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(seconds)}
        </span>
        <button className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all">
          <span>Apply (SAVE20)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}