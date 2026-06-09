"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform} from "framer-motion";
import { Heart } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface RollingCustomerCounterProps {
  targetCount?: number;
  className?: string;
}

export const RollingCustomerCounter: React.FC<RollingCustomerCounterProps> = ({
  targetCount = 1420,
  className,
}) => {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Simulated intersection scroll observer trigger
    const timer = setTimeout(() => {
      setCount(targetCount);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetCount]);

  const spring = useSpring(0, prefersReducedMotion ? { duration: 0 } : { stiffness: 45, damping: 15 });
  const display = useTransform(spring, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (prefersReducedMotion) {
      spring.jump(count);
    } else {
      spring.set(count);
    }
  }, [count, spring, prefersReducedMotion]);

  return (
    <div className={cn('p-5 rounded-2xl border border-border bg-card shadow-lg select-none max-w-[280px] text-center backdrop-blur-md bg-card/75 relative overflow-hidden', className)}>
      {/* Background glow highlights */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
        <Heart className="w-4 h-4 text-primary animate-pulse" />
      </div>

      <div className="mb-2">
        <motion.span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
          {display}
        </motion.span>
        <span className="text-primary font-black ml-0.5 text-xl">+</span>
      </div>

      <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none mb-1">Satisfied Developers</h4>
      <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Master components built</span>
    </div>
  );
};
