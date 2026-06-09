"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Sparkles, MessageSquare, Flame, Bell } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FloatingActionBubbleNavProps {
  onActionSelect?: (action: string) => void;
  className?: string;
}

export const FloatingActionBubbleNav: React.FC<FloatingActionBubbleNavProps> = ({
  onActionSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const actions = [
    { id: 'ai', icon: Sparkles, color: 'bg-indigo-600', label: 'AI Helper' },
    { id: 'chat', icon: MessageSquare, color: 'bg-emerald-600', label: 'Support' },
    { id: 'trending', icon: Flame, color: 'bg-rose-600', label: 'Stats' },
    { id: 'alerts', icon: Bell, color: 'bg-amber-600', label: 'Alerts' }
  ];

  return (
    <div className={cn('relative flex flex-col items-center select-none', className)}>
      {/* Orbital Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 flex flex-col gap-3 items-center">
            {actions.map((act, index) => {
              const Icon = act.icon;
              return (
                <motion.button
                  type="button"
                  key={act.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: prefersReducedMotion ? { duration: 0 } : { delay: index * 0.05, type: 'spring', stiffness: 200, damping: 15 }
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.5,
                    transition: prefersReducedMotion ? { duration: 0 } : { delay: (actions.length - 1 - index) * 0.03, duration: 0.15 }
                  }}
                  onClick={() => {
                    onActionSelect?.(act.id);
                    setIsOpen(false);
                  }}
                  aria-label={act.label}
                  className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all', act.color)}
                  title={act.label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        type="button"
        layout
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close actions menu' : 'Open actions menu'}
        aria-expanded={isOpen}
        className="w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-primary/95 active:scale-95 transition-all"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 250, damping: 18 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};
