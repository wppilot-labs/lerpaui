"use client";

import React from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface FullscreenGridCurtainGateProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean; // If true, the gate is open (content revealed). If false, curtains are closed (covering screen).
  panelsCount?: number; // Number of vertical sliding curtain panels
  direction?: 'up' | 'down' | 'alternate'; // Direction curtains slide to open
  stagger?: number; // Delay between panel openings
  curtainBgClass?: string; // Background color class for the panels
  onTransitionEnd?: () => void; // Optional callback after opening completes
}

export const FullscreenGridCurtainGate: React.FC<FullscreenGridCurtainGateProps> = ({
  isOpen,
  panelsCount = 6,
  direction = 'alternate',
  stagger = 0.08,
  curtainBgClass = 'bg-neutral-950',
  onTransitionEnd,
  className,
  children,
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Create an array of panel indexes
  const panels = Array.from({ length: panelsCount });

  // Curtain panel movement animations
  const panelVariants = {
    initial: {
      y: '0%',
      opacity: 1,
    },
    exit: (index: number) => {
      if (prefersReducedMotion) {
        return {
          opacity: 0,
          transition: {
            duration: 0.5,
            delay: index * 0.03,
            ease: 'easeInOut',
          },
        };
      }

      // Determine sliding exit path based on settings
      let targetY = '-100%';
      if (direction === 'down') {
        targetY = '100%';
      } else if (direction === 'alternate') {
        targetY = index % 2 === 0 ? '-100%' : '100%';
      }

      return {
        y: targetY,
        transition: {
          duration: 0.9,
          ease: [0.85, 0, 0.15, 1], // High-inertia cubic bezier
          delay: index * stagger,
        },
      };
    },
  };

  return (
    <div className={cn('relative w-full h-full', className)} {...props}>
      {/* Underlying Page Content */}
      <div className="relative z-0 w-full h-full">{children}</div>

      {/* Sliding Gate Curtain Overlay */}
      <AnimatePresence
        onExitComplete={() => {
          if (onTransitionEnd) onTransitionEnd();
        }}
      >
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 0 : 1 }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 z-50 flex pointer-events-auto overflow-hidden"
          >
            {panels.map((_, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={panelVariants}
                initial="initial"
                exit="exit"
                className={cn('h-full flex-grow border-r border-white/5 transform-gpu', curtainBgClass)}
                style={{
                  width: `${100 / panelsCount}%`,
                }}
              >
                {/* Visual loading/intro lines or brand elements can sit inside the curtains */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
