'use client';

import React, { useState } from 'react';

import { Linkedin, User, MessageSquare } from 'lucide-react';
import { cn } from '../lib/cn';

export interface NeumorphicOutsetTeamCardProps {
  className?: string;
}

export const NeumorphicOutsetTeamCard: React.FC<NeumorphicOutsetTeamCardProps> = ({ className }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Neumorphic Outset Team Card</span>

      <div 
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        className={cn(
          "w-full h-[180px] my-auto rounded-3xl cursor-pointer p-4 flex flex-col justify-between transition-all duration-300 border border-white/5",
          isPressed 
            ? "bg-card shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.03),_inset_3px_3px_8px_rgba(0,0,0,0.6)]" 
            : "bg-card shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),_4px_4px_12px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="flex justify-between items-start w-full">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
            <User className="w-4 h-4 text-foreground/80" />
          </div>
          <span className="text-[8px] font-mono tracking-widest bg-white/5 border border-border/40 px-2 py-0.5 rounded text-muted-foreground uppercase font-black">TACTILE</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">COMPILER ARCHITECTURE</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Directs tactile responsive visual assets and compiler configuration layers.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
          <div className="flex gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-foreground/80 hover:text-primary transition-colors cursor-pointer" />
            <MessageSquare className="w-3.5 h-3.5 text-foreground/80 hover:text-primary transition-colors cursor-pointer" />
          </div>
          <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click and hold card to depress tactile surface elastically</span>
    </div>
  );
};
