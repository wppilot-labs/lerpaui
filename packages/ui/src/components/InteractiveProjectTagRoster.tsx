'use client';

import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Layers, Sparkles, Cpu, Award } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractiveProjectTagRosterProps {
  className?: string;
}

export const InteractiveProjectTagRoster: React.FC<InteractiveProjectTagRosterProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);

  const springX = useSpring(floatX, { stiffness: 150, damping: 18 });
  const springY = useSpring(floatY, { stiffness: 150, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    floatX.set(e.clientX - rect.left - 40); // center preview offset
    floatY.set(e.clientY - rect.top - 40);
  };

  const projects = [
    { title: "Synapse Core", role: "AI ROUTING", icon: Cpu, glow: "bg-purple-500/20 border-purple-500/30" },
    { title: "Ether Matrix", role: "LEDGER SYNC", icon: Layers, glow: "bg-cyan-500/20 border-cyan-500/30" },
    { title: "Vector Vault", role: "CLUSTER DATA", icon: Award, glow: "bg-emerald-500/20 border-emerald-500/30" }
  ];

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredIdx(null)}
      className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none cursor-none', className)}
    >
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Project Tag Roster</span>

      <div className="flex flex-col gap-2 w-full my-auto relative">
        {projects.map((proj, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          return (
            <div
              key={idx}
              onPointerEnter={() => setHoveredIdx(idx)}
              className={cn(
                "p-3 rounded-2xl border flex items-center justify-between transition-all duration-300 relative bg-card/45",
                isHovered ? "border-muted-foreground/30 shadow-md bg-card scale-102" : "border-border/30 opacity-70",
                isAnyHovered && !isHovered ? "opacity-30 scale-98" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <proj.icon className={cn("w-4 h-4 transition-colors", isHovered ? "text-primary" : "text-muted-foreground")} />
                <div className="flex flex-col">
                  <h4 className="text-[10px] font-black tracking-wide text-foreground uppercase">{proj.title}</h4>
                  <span className="text-[7px] font-mono tracking-widest text-muted-foreground uppercase">{proj.role}</span>
                </div>
              </div>
              <Sparkles className={cn("w-3.5 h-3.5 transition-transform duration-300 opacity-60", isHovered ? "rotate-90 scale-110 text-primary opacity-100" : "")} />
            </div>
          );
        })}

        {/* Floating preview portal */}
        {hoveredIdx !== null && (
          <motion.div
            style={{ x: springX, y: springY }}
            className="absolute pointer-events-none w-20 h-20 rounded-2xl border flex flex-col items-center justify-center bg-card shadow-xl overflow-hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-tr", projects[hoveredIdx].glow)} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="z-10 text-foreground"
            >
              {React.createElement(projects[hoveredIdx].icon, { className: "w-6 h-6 text-foreground" })}
            </motion.div>
            <span className="text-[6px] font-mono font-black z-10 mt-1.5 opacity-80 uppercase tracking-widest">PORTAL</span>
          </motion.div>
        )}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover items to summon floating portal cursor</span>
    </div>
  );
};
