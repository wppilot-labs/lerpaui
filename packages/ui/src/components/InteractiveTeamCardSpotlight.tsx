'use client';

import React, { useRef, useState } from 'react';

import { Sparkles, Linkedin, Github, Mail, Shield } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractiveTeamCardSpotlightProps {
  className?: string;
}

export const InteractiveTeamCardSpotlight: React.FC<InteractiveTeamCardSpotlightProps> = ({ className }) => {
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
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Interactive Card Spotlight</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg flex flex-col justify-between p-4 my-auto"
      >
        {/* Soft radial glare tracking pointer */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.7) 0%, rgba(139,92,246,0.3) 25%, rgba(59,130,246,0.15) 60%, transparent 100%)`,
            }}
          />
        )}

        <div className="flex justify-between items-start z-10 w-full">
          <div className="w-10 h-10 rounded-xl bg-secondary border border-border/40 flex items-center justify-center text-foreground">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex gap-1">
            <button type="button" aria-label="LinkedIn profile" className="p-1 rounded bg-secondary border border-border/40 hover:text-primary transition-colors cursor-pointer">
              <Linkedin className="w-3 h-3" />
            </button>
            <button type="button" aria-label="GitHub profile" className="p-1 rounded bg-secondary border border-border/40 hover:text-primary transition-colors cursor-pointer">
              <Github className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="z-10 flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-muted-foreground uppercase">CYBER SECURITY</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Spearheads edge security compiler matrix grids and distributed ledger firewalls.
          </p>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border/20 pt-2 mt-1 z-10">
          <Mail className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
          <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          <Sparkles className="w-3 h-3 text-primary ml-auto opacity-70" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer to trigger dynamic spotlight glare</span>
    </div>
  );
};
