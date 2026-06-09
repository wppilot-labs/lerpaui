"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { MapPin, RefreshCw, Compass } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshLocationPinProps {
  onLocationUpdate?: () => Promise<void>;
  initialLocation?: string;
  className?: string;
}

export const PullToRefreshLocationPin: React.FC<PullToRefreshLocationPinProps> = ({
  onLocationUpdate,
  initialLocation = 'Sector 7G-V, Core Sub',
  className,
}) => {
  const [updating, setUpdating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const threshold = 120;

  // Stretches pin position
  const pinY = useTransform(y, [0, threshold], [-15, 20]);
  const pinStretch = useTransform(y, [0, threshold], [1, 1.25]);

  const handleDragEnd = async (_event: unknown, _info: PanInfo) => {
    if (updating) return;
    const currentY = y.get();
    if (currentY > threshold) {
      setUpdating(true);
      y.set(0);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      
      try {
        await onLocationUpdate?.();
        // Simulate coordinates search updates
        setTimeout(() => {
          setCurrentLocation(`Core Grid ${Math.floor(Math.random() * 900 + 100)}-X`);
          setUpdating(false);
        }, 1200);
      } catch (e) {
        setUpdating(false);
      }
    } else {
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full border border-border rounded-2xl bg-secondary/10 overflow-hidden min-h-[220px] select-none flex flex-col justify-end p-5', className)}>
      
      {/* Stretching Pin Track */}
      <div className="absolute inset-0 flex flex-col items-center pt-8 pointer-events-none">
        <motion.div
          style={{ y: pinY, scaleY: pinStretch }}
          className="flex flex-col items-center origin-top text-primary"
        >
          <MapPin className="w-7 h-7" style={{ filter: 'drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.5))' }} />
          <div className="w-1.5 h-6 bg-primary/45 rounded-full mt-[-2px] origin-top scale-y-75" />
        </motion.div>
        <span className="text-[8px] uppercase tracking-widest text-primary/70 font-black pt-16">
          {updating ? 'Updating coordinates' : 'Pull down map pin'}
        </span>
      </div>

      {/* Main Location Content Panel */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 180 }}
        dragElastic={0.15}
        style={{ y: springY }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card rounded-xl border border-border/80 px-4 py-3 flex items-center justify-between shadow-lg cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] uppercase font-bold text-muted-foreground">Active Location</span>
            <span className="text-xs font-black text-foreground">{currentLocation}</span>
          </div>
        </div>
        
        {updating && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
      </motion.div>
    </div>
  );
};
