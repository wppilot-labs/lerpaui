"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "../lib/cn";

export function TactileVolumeScrubber({ className }: { className?: string }) {
  const [volume, setVolume] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = Math.min(Math.max(Math.round(((e.clientX - rect.left) / rect.width) * 100), 0), 100);
    setVolume(percent);
  };

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interactive Audio Dial</h3>
          <p className="text-[10px] text-muted-foreground">Scrub volume line filter track</p>
        </div>
        {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-primary" />}
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerMove}
        onPointerMove={(e) => e.buttons === 1 && handlePointerMove(e)}
        className="relative h-4 bg-zinc-950/60 border border-border/40 rounded-xl cursor-ew-resize overflow-hidden flex items-center p-1 w-full"
      >
        <div
          style={{ width: `${volume}%` }}
          className="absolute left-0 top-0 bottom-0 bg-primary/30 border-r border-primary/50"
        />

        <div className="z-10 w-full flex items-center justify-between px-3 text-[9px] font-mono font-bold text-muted-foreground select-none pointer-events-none">
          <span>VOLUME LEVEL</span>
          <span className="text-foreground">{volume}%</span>
        </div>
      </div>
    </div>
  );
}
