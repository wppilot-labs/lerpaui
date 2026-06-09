"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CartItemSwipeQuantityProps {
  id: string;
  name: string;
  price?: number;
  initialQty?: number;
  onQtyChange?: (id: string, qty: number) => void;
  className?: string;
}

export const CartItemSwipeQuantity: React.FC<CartItemSwipeQuantityProps> = ({
  id,
  name,
  price = 29,
  initialQty = 1,
  onQtyChange,
  className,
}) => {
  const [qty, setQty] = useState(initialQty);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const threshold = 70;

  const bgRightOpacity = useTransform(x, [0, threshold], [0.1, 0.9]);
  const bgLeftOpacity = useTransform(x, [-threshold, 0], [0.9, 0.1]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX > threshold) {
      setQty(prev => {
        const next = prev + 1;
        onQtyChange?.(id, next);
        return next;
      });
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    } else if (currentX < -threshold) {
      setQty(prev => {
        const next = Math.max(1, prev - 1);
        onQtyChange?.(id, next);
        return next;
      });
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
    x.set(0);
  };

  return (
    <div className={cn('relative overflow-hidden w-full rounded-xl border border-border bg-card shadow-sm select-none', className)}>
      {/* Background controllers */}
      <div className="absolute inset-0 flex justify-between select-none pointer-events-none">
        {/* Left: Decrement */}
        <motion.div 
          style={{ opacity: bgLeftOpacity }}
          className="flex items-center justify-start bg-rose-500/10 text-rose-400 px-6 w-1/2 h-full rounded-l-xl"
        >
          <Minus className="w-5 h-5" />
        </motion.div>

        {/* Right: Increment */}
        <motion.div 
          style={{ opacity: bgRightOpacity }}
          className="flex items-center justify-end bg-emerald-500/10 text-emerald-400 px-6 w-1/2 ml-auto h-full rounded-r-xl"
        >
          <Plus className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Main Draggable Foreground */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.12}
        style={{ x: springX }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">{name}</span>
            <span className="text-[9px] text-muted-foreground font-semibold mt-0.5">${price} x {qty}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mr-2">Swipe left/right</span>
          <span className="text-sm font-black text-foreground font-mono bg-secondary/80 px-2 py-0.5 rounded-lg border border-border/40">{qty}</span>
        </div>
      </motion.div>
    </div>
  );
};
