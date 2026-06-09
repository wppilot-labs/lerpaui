'use client';

import React, { useRef, useState } from 'react';

import { Linkedin, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TiltGlareTeamCardProps {
  className?: string;
}

export const TiltGlareTeamCard: React.FC<TiltGlareTeamCardProps> = ({ className }) => {
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
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Metallic Glare Profile</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg flex items-center justify-center my-auto"
      >
        {/* Holographic color-shifting metallic glare sweeps across card based on coordinates */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.95) 0%, rgba(236,72,153,0.55) 25%, rgba(59,130,246,0.35) 60%, transparent 100%)`,
            }}
          />
        )}

        <div className="w-full h-full p-4 flex flex-col justify-between bg-card/45 text-foreground z-10">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-mono tracking-widest bg-secondary/80 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">METALLIC GLINT</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          
          <div className="flex flex-col mt-4">
            <span className="text-[7.5px] font-mono tracking-widest text-purple-400 uppercase font-bold">OPERATIONS</span>
            <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
            <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
              Sweeps holographic glares diagonally across visual profile layouts.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
            <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
            <Linkedin className="w-3.5 h-3.5 text-foreground/80 hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer to sweep holographic glare reflection</span>
    </div>
  );
};
