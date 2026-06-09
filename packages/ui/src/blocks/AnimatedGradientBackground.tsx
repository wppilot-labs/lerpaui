"use client";

import React from 'react';
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface AnimatedGradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Toggle motion globally. Reduced-motion users always get a static gradient. */
  animate?: boolean;
  /** Minimum height of the section. */
  minHeight?: number | string;
  /** Show a subtle 1px grid overlay. */
  showGrid?: boolean;
  /** Tint blur intensity in px. */
  blur?: number;
}

export function AnimatedGradientBackground({
  children,
  animate = true,
  minHeight = 400,
  showGrid = true,
  blur = 80,
  className,
  ...props
}: AnimatedGradientBackgroundProps) {
  const reduced = usePrefersReducedMotion();
  const motionOn = animate && !reduced;
  const blurPx = `${blur}px`;

  return (
    <div
      className={cn(
        'relative overflow-hidden w-full bg-background transition-colors duration-500 flex items-center justify-center',
        className
      )}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
      {...props}
    >
      {/* Aurora blur nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <motion.div
          animate={
            motionOn
              ? {
                  x: [0, 40, -20, 0],
                  y: [0, -50, 30, 0],
                  scale: [1, 1.2, 0.9, 1],
                }
              : {}
          }
          transition={{
            duration: 15,
            repeat: motionOn ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-sky-500/20"
          style={{ filter: `blur(${blurPx})` }}
        />

        <motion.div
          animate={
            motionOn
              ? {
                  x: [0, -50, 30, 0],
                  y: [0, 40, -40, 0],
                  scale: [1, 0.9, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: 18,
            repeat: motionOn ? Infinity : 0,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-[30%] -right-[10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20"
          style={{ filter: `blur(${blurPx})` }}
        />

        <motion.div
          animate={
            motionOn
              ? {
                  x: [0, 30, -30, 0],
                  y: [0, 30, 50, 0],
                  scale: [1, 1.1, 0.85, 1],
                }
              : {}
          }
          transition={{
            duration: 20,
            repeat: motionOn ? Infinity : 0,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute -bottom-[20%] left-[20%] w-[55%] aspect-square rounded-full bg-gradient-to-tr from-violet-500/15 to-emerald-500/15"
          style={{ filter: `blur(${parseInt(String(blur)) + 10}px)` }}
        />
      </div>

      {/* Grid Overlay */}
      {showGrid ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.008)_1px,transparent_1px)] opacity-60 z-[1] pointer-events-none"
        />
      ) : null}

      {/* Content wrapper */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
