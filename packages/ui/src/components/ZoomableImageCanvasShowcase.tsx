"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "../lib/cn";

export function ZoomableImageCanvasShowcase({ className }: { className?: string }) {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 2));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const resetScale = () => setScale(1);

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border/30">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Canvas Zoom</h3>
          <p className="text-[10px] text-muted-foreground">Dynamic coordinates magnifier sheet</p>
        </div>
        <Maximize2 className="w-4 h-4 text-primary" />
      </div>

      <div className="relative w-full h-[120px] bg-zinc-950/60 border border-border/40 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
        {/* Zoomable mock artwork frame */}
        <div
          style={{ transform: `scale(${scale})` }}
          className="transition-transform duration-200 w-24 h-16 rounded-lg bg-gradient-to-br from-primary to-emerald-400 opacity-80 border border-white/20 flex items-center justify-center"
        >
          <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">Mock Art</span>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={zoomOut}
          className="p-1.5 bg-zinc-900 border border-border/30 hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetScale}
          className="px-3 py-1 bg-zinc-900 border border-border/30 hover:bg-zinc-800 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          Reset
        </button>
        <button
          onClick={zoomIn}
          className="p-1.5 bg-zinc-900 border border-border/30 hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
