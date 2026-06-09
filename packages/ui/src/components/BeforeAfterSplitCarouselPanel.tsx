'use client';

import React, { useState, useRef } from 'react';

import { cn } from '../lib/cn';

export interface BeforeAfterSplitCarouselPanelProps {
  className?: string;
}

export const BeforeAfterSplitCarouselPanel: React.FC<BeforeAfterSplitCarouselPanelProps> = ({ className }) => {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xVal = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (xVal / rect.width) * 100));
    setSplit(percentage);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Swipe Compare Carousel</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-ew-resize shadow-md"
      >
        {/* Before Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-4 flex flex-col justify-between text-white select-none">
          <div>
            <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">BEFORE ENGINE</span>
            <h4 className="text-xs font-black tracking-wide mt-2">Legacy Sync core</h4>
          </div>
          <p className="text-[9px] leading-relaxed opacity-85">Slow loading static indexes compiling CPU resources with high cache latencies.</p>
        </div>

        {/* After Layer (Clipped) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-teal-900/70 to-emerald-950/70 p-4 flex flex-col justify-between text-white select-none pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${split}% 0, ${split}% 100%, 0 100%)` }}
        >
          <div>
            <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">AFTER MATRIX</span>
            <h4 className="text-xs font-black tracking-wide mt-2 text-emerald-300">Modern Sync Matrix</h4>
          </div>
          <p className="text-[9px] leading-relaxed text-emerald-100 opacity-90">Accelerated vector pipeline sync, drawing instant layout assets with 120FPS GPU blurs.</p>
        </div>

        {/* Separator Handle */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary/80 z-10 pointer-events-none"
          style={{ left: `${split}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border border-white flex items-center justify-center shadow-md">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Move pointer over canvas to slide partition</span>
    </div>
  );
};
