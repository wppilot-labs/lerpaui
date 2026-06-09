"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshFoilGlareProps {
  onRefresh?: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefreshFoilGlare: React.FC<PullToRefreshFoilGlareProps> = ({
  onRefresh,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 220, damping: 22 });
  const threshold = 110;

  // Sweep coordinates for holo glare sheen
  const glareX = useTransform(y, [0, threshold], ['-150%', '150%']);
  const indicatorOpacity = useTransform(y, [20, threshold], [0, 0.9]);

  const handleDragEnd = async (_event: unknown, _info: PanInfo) => {
    if (loading) return;
    const currentY = y.get();
    if (currentY > threshold) {
      setLoading(true);
      y.set(0);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      
      try {
        await onRefresh?.();
      } finally {
        setLoading(false);
      }
    } else {
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full overflow-hidden select-none border border-border rounded-2xl bg-secondary/5', className)}>
      {/* Background Foil Glare sweeps */}
      <div className="absolute inset-x-0 top-0 h-[60px] pointer-events-none overflow-hidden z-20">
        <motion.div
          style={{ x: glareX }}
          className="absolute inset-y-0 w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {loading ? (
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <motion.div
              style={{ opacity: indicatorOpacity }}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase text-primary tracking-widest"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
              <span>Holographic Pull</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pullable body */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 180 }}
        dragElastic={0.15}
        style={{ y: springY }}
        onDragEnd={handleDragEnd}
        className="w-full bg-card min-h-[220px] p-6 relative z-10 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center border-t border-border/30 shadow-inner"
      >
        {children}
      </motion.div>
    </div>
  );
};
