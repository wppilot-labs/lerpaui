'use client';

import React, { useRef, useState } from 'react';

import { Shield } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HolographicGlareCarouselFrameProps {
  className?: string;
}

export const HolographicGlareCarouselFrame: React.FC<HolographicGlareCarouselFrameProps> = ({ className }) => {
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
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Holographic Glare deck</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg flex items-center justify-center"
      >
        {/* Holographic metallic glare overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.85) 0%, rgba(168,85,247,0.45) 30%, rgba(59,130,246,0.15) 70%, transparent 100%)`,
            }}
          />
        )}

        <div className="w-full h-full p-4 flex flex-col justify-between bg-card text-foreground">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">HOLO SHIELD</span>
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wide">Holographic metallic Glare</h4>
            <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">Metallic reflection vectors tracking cursor pointer positions across glass layouts.</p>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer to trigger holo flare</span>
    </div>
  );
};
