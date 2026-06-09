'use client';

import React, { useRef, useState } from 'react';
import { Sparkles, Terminal, Shield } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DottedGridProfileBackgroundProps {
  className?: string;
}

export const DottedGridProfileBackground: React.FC<DottedGridProfileBackgroundProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Dotted Grid Matrix</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg flex flex-col justify-between p-4 my-auto border border-border/30 group"
      >
        {/* Interactive Warp Dotted Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-35">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotPattern23" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-muted-foreground/60" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern23)" />
            {isHovered && (
              <circle 
                cx={coords.x} 
                cy={coords.y} 
                r="45" 
                fill="none" 
                stroke="url(#dotRadialGlow)" 
                strokeWidth="1.5" 
                className="stroke-primary/30"
              />
            )}
            <defs>
              <radialGradient id="dotRadialGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="flex justify-between items-start z-10">
          <div className="w-8 h-8 rounded-xl bg-secondary border border-border/40 flex items-center justify-center text-foreground">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[7.5px] font-mono tracking-widest bg-white/5 border border-border/40 px-2 py-0.5 rounded text-foreground/80 uppercase font-black">CORE DEV</span>
        </div>

        <div className="z-10 flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">COMPILER LEAD</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Builds automated pipeline compilers and glowing laser coordinate matrices.
          </p>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border/20 pt-2 mt-1 z-10">
          <Shield className="w-3 h-3 text-muted-foreground" />
          <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          <Sparkles className="w-3.5 h-3.5 text-primary ml-auto opacity-70 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Move cursor to warp coordinate grid</span>
    </div>
  );
};
