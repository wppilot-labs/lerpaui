'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DepthVideoParallaxShowcaseProps {
  className?: string;
}

export const DepthVideoParallaxShowcase: React.FC<DepthVideoParallaxShowcaseProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pX = useMotionValue(0);
  const pY = useMotionValue(0);

  const springX = useSpring(pX, { stiffness: 120, damping: 20 });
  const springY = useSpring(pY, { stiffness: 120, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = (e.clientX - rect.left - width / 2) / (width / 2);
    const yVal = (e.clientY - rect.top - height / 2) / (height / 2);
    
    pX.set(-xVal * 20);
    pY.set(-yVal * 20);
  };

  const handlePointerLeave = () => {
    pX.set(0);
    pY.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Absolute Parallax Depth</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-lg relative my-auto z-0"
      >
        {/* Parallax moving background layer */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-[-20px] bg-gradient-to-tr from-purple-950 via-indigo-900 to-cyan-950 opacity-90 z-0"
        />

        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase font-black">FEATURE</span>
            <Cpu className="w-4 h-4 text-purple-200" />
          </div>

          <div>
            <h4 className="text-xs font-black tracking-wide">Multi-Layer Depth</h4>
            <p className="text-[9px] opacity-80 leading-relaxed mt-1">Visual grid structures shifting at offset spring velocities relative to pointers.</p>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Move pointer over grid to reveal depth</span>
    </div>
  );
};
