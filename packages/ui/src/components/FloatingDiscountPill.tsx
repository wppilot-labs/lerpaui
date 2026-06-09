"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FloatingDiscountPillProps {
  discountCode?: string;
  percentage?: number;
  className?: string;
}

export const FloatingDiscountPill: React.FC<FloatingDiscountPillProps> = ({
  discountCode = "SUMMER26",
  percentage = 20,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn('fixed bottom-6 right-6 z-40 select-none cursor-pointer', className)}
        >
          {/* Metallic foil glare loops background */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-pink-500/25 to-amber-500/25 blur-md rounded-full transition-opacity duration-300',
            hovered ? 'opacity-100' : 'opacity-30'
          )} />

          <motion.div
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            className="relative px-4 py-2 border border-primary/30 rounded-full bg-card/85 backdrop-blur-md shadow-xl flex items-center gap-2.5 overflow-hidden"
          >
            {/* Glare sweep sheen */}
            <motion.div
              animate={hovered && !prefersReducedMotion ? { x: ['-100%', '200%'] } : {}}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none translate-x-[-100%]"
            />

            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col">
              <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Limited discount</span>
              <span className="text-[10px] text-foreground font-black uppercase tracking-wider mt-0.5 flex items-center gap-1">
                {discountCode} <span className="text-primary">(-{percentage}%)</span>
              </span>
            </div>
            
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 animate-bounce" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
