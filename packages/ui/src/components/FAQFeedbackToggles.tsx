"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FAQFeedbackTogglesProps {
  onFeedbackSelect?: (val: boolean) => void;
  className?: string;
}

export const FAQFeedbackToggles: React.FC<FAQFeedbackTogglesProps> = ({
  onFeedbackSelect,
  className,
}) => {
  const [clicked, setClicked] = useState<'yes' | 'no' | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const handleAction = (val: 'yes' | 'no') => {
    setClicked(val);
    onFeedbackSelect?.(val === 'yes');

    if (val === 'yes') {
      // Trigger spring-loaded coordinate particles
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: -10 - Math.random() * 40
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 800);
    }
  };

  return (
    <div className={cn('p-4 border border-border bg-card shadow-sm rounded-2xl select-none max-w-[280px] w-full flex flex-col items-center gap-3 relative overflow-hidden backdrop-blur-md bg-card/75', className)}>
      <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest">Was this helpful?</span>

      <div className="flex gap-3 relative">
        {/* Confetti micro-particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 0.5, x: p.x, y: p.y }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute w-2 h-2 rounded-full bg-primary pointer-events-none"
              style={{ left: '30%', top: '30%' }}
            />
          ))}
        </AnimatePresence>

        <motion.button
          type="button"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          onClick={() => handleAction('yes')}
          className={cn(
            'px-3.5 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer',
            clicked === 'yes' ? 'bg-primary border-primary text-white' : 'bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
          )}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Yes</span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          onClick={() => handleAction('no')}
          className={cn(
            'px-3.5 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer',
            clicked === 'no' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-card border-border hover:border-rose-400 text-muted-foreground hover:text-foreground'
          )}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>No</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {clicked === 'yes' && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[8px] text-emerald-400 font-extrabold uppercase tracking-widest mt-1 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Thank you for your feedback!</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
