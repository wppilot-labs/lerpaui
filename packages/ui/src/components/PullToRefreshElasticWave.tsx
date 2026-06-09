"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshElasticWaveProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefreshElasticWave: React.FC<PullToRefreshElasticWaveProps> = ({
  onRefresh,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const threshold = 120;

  // Stretches Y into SVG height parameters
  const pathD = useTransform(y, [0, threshold], [
    'M 0 0 Q 150 0 300 0 L 300 0 L 0 0 Z',
    'M 0 0 Q 150 80 300 0 L 300 0 L 0 0 Z'
  ]);
  const indicatorY = useTransform(y, [0, threshold], [-20, 20]);
  const indicatorOpacity = useTransform(y, [20, threshold], [0, 1]);

  const handleDrag = (_event: unknown, _info: PanInfo) => {
    if (loading) return;
    const currentY = y.get();
    if (currentY > threshold && !loading) {
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }
  };

  const handleDragEnd = async (_event: unknown, _info: PanInfo) => {
    if (loading) return;
    const currentY = y.get();
    if (currentY >= threshold) {
      setLoading(true);
      y.set(0);
      try {
        await onRefresh();
      } finally {
        setLoading(false);
      }
    } else {
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full overflow-hidden select-none touch-pan-y border border-border rounded-2xl bg-secondary/15', className)}>
      {/* Elastic SVG wave tray */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-20">
        <svg className="w-full h-[120px] fill-primary/10 stroke-primary/30 stroke-[1px]">
          <motion.path d={pathD} />
        </svg>
        <div className="absolute top-6 left-0 right-0 flex justify-center items-center">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : (
            <motion.div
              style={{ y: indicatorY, opacity: indicatorOpacity }}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary tracking-widest"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Pull to refresh</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pullable container content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        dragElastic={0.15}
        style={{ y: springY }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="w-full h-full bg-card min-h-[220px] p-6 relative z-10 cursor-grab active:cursor-grabbing flex flex-col justify-center items-center"
      >
        {children}
      </motion.div>
    </div>
  );
};
