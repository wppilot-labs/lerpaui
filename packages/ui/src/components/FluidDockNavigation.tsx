"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Home, Settings, Search, User, MessageSquare, Bell } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FluidDockNavigationProps {
  className?: string;
}

export const FluidDockNavigation: React.FC<FluidDockNavigationProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const items = [
    { icon: Home, label: "Home" },
    { icon: Search, label: "Search" },
    { icon: MessageSquare, label: "Chat" },
    { icon: Bell, label: "Alerts" },
    { icon: User, label: "Profile" },
    { icon: Settings, label: "Config" }
  ];

  return (
    <div className={cn('p-3 rounded-2xl border border-border bg-card/85 backdrop-blur-md shadow-lg select-none flex items-center justify-center gap-3.5', className)}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isHovered = hoveredIdx === idx;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;

        // Proximity scale triggers depending on proximity
        const scaleVal = isHovered ? 1.35 : isNeighbor ? 1.15 : 1.0;
        const yVal = isHovered ? -12 : isNeighbor ? -5 : 0;

        return (
          <div 
            key={idx}
            className="relative"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <motion.button
              type="button"
              aria-label={item.label}
              animate={prefersReducedMotion ? undefined : { scale: scaleVal, y: yVal }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 20 }}
              className={cn(
                'w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm cursor-pointer transition-colors',
                isHovered ? 'bg-primary border-primary text-white' : 'bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
            </motion.button>

            {/* Label pill overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, y: 5, x: '-50%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-black/85 backdrop-blur-sm text-white border border-white/10 rounded-lg text-[8.5px] font-extrabold uppercase tracking-wider font-mono whitespace-nowrap pointer-events-none"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
