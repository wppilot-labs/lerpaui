'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MagneticPortfolioPortalProps {
  className?: string;
}

export const MagneticPortfolioPortal: React.FC<MagneticPortfolioPortalProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const springX = useSpring(mX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mY, { stiffness: 150, damping: 18 });

  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xVal = e.clientX - rect.left - rect.width / 2;
    const yVal = e.clientY - rect.top - rect.height / 2;
    
    // magnetic force distance check
    const dist = Math.sqrt(xVal * xVal + yVal * yVal);
    if (dist < 100) {
      mX.set(xVal * 0.45);
      mY.set(yVal * 0.45);
    } else {
      mX.set(0);
      mY.set(0);
    }
  };

  const handlePointerLeave = () => {
    mX.set(0);
    mY.set(0);
  };

  const handleClick = (e?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e && 'clientX' in e ? e.clientX - rect.left : rect.width / 2;
    const y = e && 'clientY' in e ? e.clientY - rect.top : rect.height / 2;

    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 800);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Magnetic CTA Portal</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); } }}
        className="w-full h-[180px] flex items-center justify-center my-auto cursor-pointer relative z-0"
      >
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full bg-primary/10 pointer-events-none w-12 h-12"
            style={{ left: r.x - 24, top: r.y - 24 }}
          />
        ))}

        <motion.div
          style={{ x: springX, y: springY }}
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-full border border-primary/20 bg-card shadow-2xl flex flex-col items-center justify-center gap-1 border-primary/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          <Sparkles className="w-5 h-5 text-primary group-hover:animate-bounce mt-1" />
          <span className="text-[8px] font-black uppercase tracking-wider">PORTAL</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover close to pull button elastically</span>
    </div>
  );
};
