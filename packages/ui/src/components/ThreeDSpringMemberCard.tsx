'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Sparkles, Award, MessageSquare } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ThreeDSpringMemberCardProps {
  className?: string;
}

export const ThreeDSpringMemberCard: React.FC<ThreeDSpringMemberCardProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xOffset = e.clientX - rect.left - rect.width / 2;
    const yOffset = e.clientY - rect.top - rect.height / 2;

    // tilt coordinates mapped to 3D degree rotation
    rotateX.set(-yOffset / 6);
    rotateY.set(xOffset / 6);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">3D Spring Member Card</span>

      <div 
        className="w-full h-[180px] my-auto cursor-crosshair flex items-center justify-center [perspective:1000px]"
      >
        <motion.div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
          className="relative w-full h-full border border-border rounded-2xl bg-card shadow-xl p-4 flex flex-col justify-between bg-gradient-to-tr from-card to-secondary/20"
        >
          {/* Subtle metallic diagonal sheen */}
          <div 
            style={{ transform: "translateZ(30px)" }}
            className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay"
          />

          <div 
            style={{ transform: "translateZ(40px)" }}
            className="flex justify-between items-start w-full z-10"
          >
            <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-primary/10">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[8px] font-mono tracking-widest bg-white/5 px-2 py-0.5 rounded border border-border/40 uppercase">EXPERT</span>
          </div>

          <div 
            style={{ transform: "translateZ(50px)" }}
            className="flex flex-col z-10"
          >
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">OPERATIONS</span>
            <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
            <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">
              Manages cloud clusters, edge nodes, and elastic Kubernetes compilers.
            </p>
          </div>

          <div 
            style={{ transform: "translateZ(35px)" }}
            className="flex items-center justify-between border-t border-border/20 pt-2 mt-1 z-10"
          >
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Move cursor on card to tilt elastically</span>
    </div>
  );
};
