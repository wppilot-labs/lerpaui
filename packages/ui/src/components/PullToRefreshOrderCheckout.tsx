"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshOrderCheckoutProps {
  onCheckoutComplete?: () => Promise<void>;
  children?: React.ReactNode;
  className?: string;
}

export const PullToRefreshOrderCheckout: React.FC<PullToRefreshOrderCheckoutProps> = ({
  onCheckoutComplete,
  children,
  className,
}) => {
  const [status, setStatus] = useState<'idle' | 'pulling' | 'processing' | 'success'>('idle');
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 350, damping: 25 });
  const threshold = 110;

  const pullOpacity = useTransform(y, [0, threshold], [0.3, 1]);
  const pullScale = useTransform(y, [0, threshold], [0.7, 1.25]);

  const handleDrag = (_event: unknown, info: PanInfo) => {
    if (status === 'processing' || status === 'success') return;
    if (info.offset.y > 0) {
      setStatus('pulling');
      y.set(info.offset.y * 0.4);
    }
  };

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    if (status === 'processing' || status === 'success') return;
    const currentY = y.get();

    if (currentY > threshold) {
      setStatus('processing');
      y.set(65);

      // Place simulated checkout order
      setTimeout(async () => {
        if (onCheckoutComplete) await onCheckoutComplete();
        setStatus('success');
        y.set(65);

        // Reset to idle after delay
        setTimeout(() => {
          setStatus('idle');
          y.set(0);
        }, 2200);
      }, 2000);
    } else {
      setStatus('idle');
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[340px] border border-border rounded-2xl bg-card overflow-hidden shadow-lg select-none', className)}>
      
      {/* Dynamic Pull Checkout Header */}
      <div className="absolute inset-x-0 top-0 overflow-hidden flex items-center justify-center text-center select-none pointer-events-none" style={{ height: 65 }}>
        <AnimatePresence mode="wait">
          {status === 'pulling' && (
            <motion.div 
              style={{ opacity: pullOpacity, scale: pullScale }}
              className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <ShoppingBag className="w-4 h-4 animate-bounce" />
              <span>Pull to place order</span>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Processing order...</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Order Confirmed!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Draggable viewport panel */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 250 }}
        dragElastic={0.15}
        style={{ y: springY }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card p-5 cursor-grab active:cursor-grabbing border-t border-border/40 min-h-36 flex flex-col justify-center text-center"
      >
        {children || (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-foreground">Complete Simulated Checkout</span>
            <span className="text-[9px] text-muted-foreground uppercase font-semibold">Pull down screen bounds to trigger simulated checkout completion</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
