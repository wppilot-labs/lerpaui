"use client";

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MagneticMagneticButtonProps {
  label?: string;
  className?: string;
}

export const MagneticMagneticButton: React.FC<MagneticMagneticButtonProps> = ({
  label = "Magnetic Hub",
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull coordinates subtraction
    const pullX = (e.clientX - centerX) * 0.42;
    const pullY = (e.clientY - centerY) * 0.42;

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn('relative p-6 cursor-pointer select-none flex items-center justify-center', className)}
    >
      <motion.button
        type="button"
        style={{ x: springX, y: springY, boxShadow: hovered ? '0 0 15px rgba(var(--primary-rgb), 0.6)' : undefined }}
        className={cn(
          'px-6 py-3 border rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md select-none',
          hovered ? 'bg-primary border-primary text-white' : 'bg-card border-border text-muted-foreground'
        )}
      >
        <Sparkles className={cn('w-4 h-4 shrink-0', hovered && 'animate-spin-slow text-white')} />
        <span>{label}</span>
      </motion.button>
    </div>
  );
};
