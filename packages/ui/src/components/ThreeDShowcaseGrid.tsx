'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ThreeDShowcaseGridProps {
  className?: string;
}

export const ThreeDShowcaseGrid: React.FC<ThreeDShowcaseGridProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);
  
  const springX = useSpring(rotateXVal, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateYVal, { stiffness: 120, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = (e.clientX - rect.left - width / 2) / (width / 2);
    const yVal = (e.clientY - rect.top - height / 2) / (height / 2);
    
    rotateXVal.set(-yVal * 15);
    rotateYVal.set(xVal * 15);
  };

  const handlePointerLeave = () => {
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">3D Perspective Showcase</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ perspective: "1000px" }}
        className="w-full h-[180px] flex items-center justify-center my-auto cursor-crosshair z-0"
      >
        <motion.div
          style={{
            rotateX: springX,
            rotateY: springY,
            transformStyle: "preserve-3d"
          }}
          className="relative w-[230px] h-[140px] rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/60 to-indigo-950/60 p-4 flex flex-col justify-between text-white shadow-2xl overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-4 -mt-4 pointer-events-none" />
          
          <div className="flex justify-between items-start" style={{ transform: "translateZ(40px)" }}>
            <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase font-black">AI PORTFOLIO</span>
            <ArrowUpRight className="w-4 h-4 text-purple-200" />
          </div>

          <div style={{ transform: "translateZ(60px)" }}>
            <h4 className="text-sm font-black tracking-wide">3D Interactive Card</h4>
            <p className="text-[9px] opacity-80 leading-normal mt-1.5">Interactive spring angles tilting elastically following your pointer coordinates.</p>
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Move pointer over grid to tilt 3D</span>
    </div>
  );
};
