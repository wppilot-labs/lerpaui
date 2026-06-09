"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';

export interface DiagonalCurtainGateProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onComplete?: () => void;
  curtainColor?: string;
  accentColor?: string;
  transitionDuration?: number;
  children?: React.ReactNode;
}

export const DiagonalCurtainGate: React.FC<DiagonalCurtainGateProps> = ({
  isOpen,
  onComplete,
  curtainColor = 'bg-neutral-950', // dark default
  accentColor = 'bg-primary', // highlight accent line
  transitionDuration = 0.85,
  children,
  className,
  ...props
}) => {
  // Callback when transition completes
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, transitionDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete, transitionDuration]);

  // Variant configs for diagonal sliding splits
  // Top-Left curtain slides out to -100% X and -100% Y
  const topLeftVariants = {
    closed: {
      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
      x: 0,
      y: 0,
    },
    open: {
      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
      x: '-100%',
      y: '-100%',
    },
  };

  // Bottom-Right curtain slides out to 100% X and 100% Y
  const bottomRightVariants = {
    closed: {
      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
      x: 0,
      y: 0,
    },
    open: {
      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
      x: '100%',
      y: '100%',
    },
  };

  return (
    <div className={cn('relative w-full h-full overflow-hidden select-none', className)} {...props}>
      {/* Underlying Content (visible after gates slide open) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
        className="w-full h-full pointer-events-auto select-text"
      >
        {children}
      </motion.div>

      {/* Gate curtains overlay */}
      <AnimatePresence>
        {!isOpen && (
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center">
            {/* Top-Left Diagonal Curtain Panel */}
            <motion.div
              variants={topLeftVariants}
              initial="closed"
              animate="closed"
              exit="open"
              transition={{
                duration: transitionDuration,
                ease: [0.76, 0, 0.24, 1], // Custom cubic-bezier for snappy slide
              }}
              className={cn('absolute inset-0 w-full h-full pointer-events-auto', curtainColor)}
            >
              {/* Highlight accent separator border along diagonal */}
              <div
                className={cn(
                  'absolute bottom-0 right-0 h-1 w-[142%] origin-bottom-right rotate-45 translate-y-[2px]',
                  accentColor
                )}
              />
            </motion.div>

            {/* Bottom-Right Diagonal Curtain Panel */}
            <motion.div
              variants={bottomRightVariants}
              initial="closed"
              animate="closed"
              exit="open"
              transition={{
                duration: transitionDuration,
                ease: [0.76, 0, 0.24, 1],
              }}
              className={cn('absolute inset-0 w-full h-full pointer-events-auto', curtainColor)}
            >
              {/* Secondary accent separator line */}
              <div
                className={cn(
                  'absolute top-0 left-0 h-1 w-[142%] origin-top-left rotate-45 -translate-y-[2px]',
                  accentColor
                )}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
