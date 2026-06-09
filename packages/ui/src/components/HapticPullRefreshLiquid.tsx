"use client";

import React, { useId, useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HapticPullRefreshLiquidProps {
  onRefresh?: () => void;
  className?: string;
}

export const HapticPullRefreshLiquid: React.FC<HapticPullRefreshLiquidProps> = ({
  onRefresh,
  className,
}) => {
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 25 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rawId = useId().replace(/:/g, '');
  const filterId = `liquid-${rawId}`;

  const handleDrag = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 0) {
      y.set(Math.min(100, info.offset.y));
    }
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 80) {
      setIsRefreshing(true);
      onRefresh?.();
      setTimeout(() => setIsRefreshing(false), 2000);
    }
    y.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-between p-4 select-none overflow-hidden', className)}>
      {/* Organic SVG liquid filter morph */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Pull down liquid header */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none flex justify-center z-20"
        style={{ filter: `url(#${filterId})` }}
      >
        <motion.div 
          style={{ height: springY }}
          className="w-20 bg-primary rounded-b-full flex items-center justify-center"
        >
          <RefreshCw className={cn('w-4 h-4 text-primary-foreground', isRefreshing ? 'animate-spin' : '')} />
        </motion.div>
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="w-full flex-1 flex flex-col items-center justify-center bg-card rounded-xl border border-border/80 p-4 shadow-sm cursor-grab active:cursor-grabbing touch-y z-10"
      >
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Gooey Refresh</span>
        <h4 className="text-xs font-black text-foreground">Lerpa UI Refresh Pane</h4>
        <p className="text-[10px] text-muted-foreground text-center mt-2 leading-relaxed">Pull down elastically to trigger liquid gooey refreshing feedback.</p>
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center mt-2">Pull row down to refresh</span>
    </div>
  );
};
