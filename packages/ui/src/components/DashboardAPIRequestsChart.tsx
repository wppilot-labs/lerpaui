"use client";

import React, { useState } from "react";
import { Terminal } from "lucide-react";

export function DashboardAPIRequestsChart() {
  const [range, setRange] = useState("24h");

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API load load chart</span>
        </div>
        <div className="flex gap-1 bg-secondary/30 p-0.5 rounded-lg border border-white/[0.04]">
          {["1h", "24h"].map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                range === item ? "bg-card text-foreground" : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-16 flex items-end justify-between gap-1 pt-4 border-b border-white/[0.04]">
          <div className="w-full bg-violet-500/20 h-[30%]" />
          <div className="w-full bg-violet-500/40 h-[45%]" />
          <div className="w-full bg-violet-500/70 h-[80%]" />
          <div className="w-full bg-violet-500/95 h-[95%]" />
          <div className="w-full bg-violet-500/30 h-[50%]" />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Avg load: <span className="font-bold text-foreground">84.2 requests/s</span></span>
          <span className="text-emerald-400 font-bold">● Live Monitoring</span>
        </div>
      </div>
    </div>
  );
}