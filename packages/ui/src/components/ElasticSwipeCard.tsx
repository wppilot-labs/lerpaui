"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo, useReducedMotion } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ElasticSwipeCardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const ElasticSwipeCard: React.FC<ElasticSwipeCardProps> = ({
  title = "Sleek Gesture Card",
  subtitle = "Swipe elastically or throw right/left",
  image,
  onSwipeLeft,
  onSwipeRight,
  className,
}) => {
  const [dismissed, setDismissed] = useState<'left' | 'right' | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 25 });

  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x > 140) {
      setDismissed('right');
      onSwipeRight?.();
    } else if (info.offset.x < -140) {
      setDismissed('left');
      onSwipeLeft?.();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    setDismissed(null);
    x.set(0);
    y.set(0);
  };

  if (dismissed) {
    return (
      <div className={cn('relative w-full max-w-[280px] h-[340px] border border-border bg-card shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 p-4 select-none', className)}>
        <span className={cn('text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full',
          dismissed === 'right' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-500 border border-rose-500/25'
        )}>
          {dismissed === 'right' ? 'Approved' : 'Dismissed'}
        </span>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Card</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      drag={prefersReducedMotion ? false : true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.4}
      style={{ x: springX, y: springY, rotate, opacity }}
      onDragEnd={handleDragEnd}
      className={cn('relative w-full max-w-[280px] h-[340px] bg-card border border-border shadow-xl rounded-2xl cursor-grab active:cursor-grabbing overflow-hidden select-none', className)}
    >
      {/* Swipe Badges Overlay */}
      <motion.div 
        style={{ opacity: likeOpacity }} 
        className="absolute top-4 left-4 z-20 border-2 border-emerald-500 rounded-lg px-2.5 py-0.5 text-emerald-500 text-xs font-black uppercase tracking-widest rotate-[-12deg]"
      >
        LIKE
      </motion.div>

      <motion.div 
        style={{ opacity: nopeOpacity }} 
        className="absolute top-4 right-4 z-20 border-2 border-rose-500 rounded-lg px-2.5 py-0.5 text-rose-500 text-xs font-black uppercase tracking-widest rotate-[12deg]"
      >
        NOPE
      </motion.div>

      {/* Body contents */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 z-10" />
      
      {image ? (
        <img src={image} alt="Swipe Card" className="w-full h-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center p-6 border-b border-border/20">
          <Heart className="w-16 h-16 text-primary/40 animate-pulse" />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-5 z-20 text-white">
        <h4 className="text-base font-black truncate">{title}</h4>
        <p className="text-xs text-white/70 mt-1 truncate">{subtitle}</p>
        
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => { setDismissed('left'); onSwipeLeft?.(); }}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-rose-400 hover:bg-white/25 active:scale-90 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Like"
            onClick={() => { setDismissed('right'); onSwipeRight?.(); }}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 hover:bg-white/25 active:scale-90 transition-all"
          >
            <Heart className="w-4 h-4 fill-emerald-400/20" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
