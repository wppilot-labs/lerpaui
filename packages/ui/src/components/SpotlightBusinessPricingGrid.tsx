'use client';

import React, { useRef, useState } from 'react';

import { Check, Star, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SpotlightBusinessPricingGridProps {
  className?: string;
}

export const SpotlightBusinessPricingGrid: React.FC<SpotlightBusinessPricingGridProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xVal = ((e.clientX - rect.left) / rect.width) * 100;
    const yVal = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x: xVal, y: yVal });
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Spotlight Pricing Block</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border/30 rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg flex flex-col justify-between p-4 my-auto group"
      >
        {/* Soft radial glare tracking pointer */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.75) 0%, rgba(139,92,246,0.3) 25%, rgba(59,130,246,0.15) 60%, transparent 100%)`,
            }}
          />
        )}

        <div className="flex justify-between items-start z-10 w-full">
          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">ENTERPRISE CLOUD</span>
            <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Scale Package</h4>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary text-[8px] font-black uppercase">
            <Star className="w-2.5 h-2.5 fill-primary" />
            <span>POPULAR</span>
          </div>
        </div>

        <div className="z-10 flex items-baseline mt-2">
          <span className="text-2xl font-black text-foreground">$149</span>
          <span className="text-[8px] font-mono text-muted-foreground ml-1.5 uppercase">/MONTH</span>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/20 pt-2.5 mt-1 z-10">
          <div className="flex items-center gap-1.5 text-[8.5px] text-muted-foreground">
            <Check className="w-3 h-3 text-primary shrink-0" />
            <span>20 dynamic compile server chains</span>
          </div>
          <div className="flex items-center gap-1.5 text-[8.5px] text-muted-foreground">
            <Check className="w-3 h-3 text-primary shrink-0" />
            <span>Unlimited context token sync streams</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 z-10 text-[7px] font-mono text-muted-foreground">
          <span>Cancel anytime elastically</span>
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer to slide pricing spotlight</span>
    </div>
  );
};
