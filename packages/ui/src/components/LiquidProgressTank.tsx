'use client';

import React, { useEffect, useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

export interface LiquidProgressTankProps {
  /** Progress value from 0 to 100 */
  progress?: number;
  /** Additional wrapper class names */
  className?: string;
  /** Height of the tank container, e.g. "h-80" or "h-96" */
  tankHeight?: string;
  /** Width of the tank container, e.g. "w-56" or "w-64" */
  tankWidth?: string;
  /** Tailwind gradient or background classes for primary wave */
  waterColor?: string;
  /** Show the percent label in the center of the tank */
  showPercent?: boolean;
  /** Title label above or inside the tank */
  title?: string;
  /** Shape of the tank: 'circular' or 'rectangular' */
  shape?: 'circular' | 'rectangular';
}

interface Bubble {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

export const LiquidProgressTank: React.FC<LiquidProgressTankProps> = ({
  progress = 65,
  className,
  tankHeight = 'h-80',
  tankWidth = 'w-60',
  waterColor = 'from-teal-400 via-emerald-500 to-emerald-600',
  showPercent = true,
  title,
  shape = 'rectangular',
}) => {
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const prefersReducedMotion = useReducedMotion();
  const uniqueId = useId().replace(/:/g, '');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Generate stable bubbles once on mount
  useEffect(() => {
    const list: Bubble[] = Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 80 + 10, // percentage 10% to 90%
      size: Math.random() * 6 + 4, // size 4px to 10px
      delay: Math.random() * 3, // delay up to 3s
      duration: Math.random() * 4 + 4, // duration 4s to 8s
    }));
    setBubbles(list);
  }, []);

  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      {/* Component Inline Styles for Loop Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wave-slide-1-${uniqueId} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave-slide-2-${uniqueId} {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes bubble-rise-${uniqueId} {
          0% {
            transform: translateY(100%) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0;
          }
        }
        .wave-animate-1-${uniqueId} {
          animation: wave-slide-1-${uniqueId} 12s linear infinite;
        }
        .wave-animate-2-${uniqueId} {
          animation: wave-slide-2-${uniqueId} 8s linear infinite;
        }
        .bubble-${uniqueId} {
          animation: bubble-rise-${uniqueId} var(--bubble-duration) ease-in infinite;
          animation-delay: var(--bubble-delay);
        }
      `,
        }}
      />

      {title && (
        <span className="mb-3 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
          {title}
        </span>
      )}

      {/* Main Glassmorphic Container */}
      <div
        className={cn(
          'relative overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl flex flex-col justify-end transition-all duration-300',
          shape === 'circular' ? 'rounded-full aspect-square' : 'rounded-3xl',
          tankWidth,
          tankHeight
        )}
      >
        {/* Inner Highlight Refraction Rings */}
        <div className="absolute inset-0 rounded-[inherit] border border-white/10 pointer-events-none z-20" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />
        <div className="absolute left-3 top-3 bottom-3 w-1.5 bg-gradient-to-r from-white/15 to-transparent rounded-full opacity-60 pointer-events-none z-20" />

        {/* Dynamic Rising Fluid Layer */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 origin-bottom z-10"
          initial={prefersReducedMotion ? false : { height: '0%' }}
          animate={{ height: `${safeProgress}%` }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 45, damping: 15 }
          }
        >
          {/* Waves Container */}
          <div className="absolute bottom-0 left-0 w-full h-[500px] flex flex-col justify-end">
            {/* SVG Wave Headers */}
            <div className="absolute left-0 right-0 -top-8 h-8 overflow-visible pointer-events-none select-none">
              {/* Back Wave (Deeper, Slower) */}
              <div
                className={cn(
                  'absolute w-[200%] h-full -left-full text-emerald-500/40 dark:text-emerald-400/30',
                  !prefersReducedMotion && `wave-animate-1-${uniqueId}`
                )}
              >
                <svg
                  viewBox="0 0 1200 120"
                  fill="currentColor"
                  className="w-full h-full preserve-3d"
                  preserveAspectRatio="none"
                >
                  <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 L1500,120 L0,120 Z" />
                </svg>
              </div>

              {/* Front Wave (Main Accent, Faster) */}
              <div
                className={cn(
                  'absolute w-[200%] h-full -left-full text-teal-400/80 dark:text-emerald-500/80',
                  !prefersReducedMotion && `wave-animate-2-${uniqueId}`
                )}
              >
                <svg
                  viewBox="0 0 1200 120"
                  fill="currentColor"
                  className="w-full h-full preserve-3d"
                  preserveAspectRatio="none"
                >
                  <path d="M0,50 C150,20 300,80 450,50 C600,20 750,80 900,50 C1050,20 1200,80 1350,50 L1350,120 L0,120 Z" />
                </svg>
              </div>
            </div>

            {/* Solid Water Base */}
            <div
              className={cn(
                'w-full h-[500px] bg-gradient-to-t opacity-90 shadow-inner',
                waterColor
              )}
            >
              {/* Animated Floating Bubbles in the Tank */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {!prefersReducedMotion &&
                  safeProgress > 5 &&
                  bubbles.map((bubble) => (
                    <div
                      key={bubble.id}
                      className={cn(
                        'absolute rounded-full bg-white/20 dark:bg-white/30 backdrop-blur-[1px] border border-white/40 shadow-sm bubble-${uniqueId}'
                      )}
                      style={{
                        left: `${bubble.left}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        bottom: '0px',
                        // @ts-expect-error CSS custom property
                        '--bubble-delay': `${bubble.delay}s`,
                        '--bubble-duration': `${bubble.duration}s`,
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Percentage Display */}
        {showPercent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none select-none">
            <span className="text-4xl font-extrabold tracking-tighter text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] flex items-baseline">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={safeProgress}
                className="tabular-nums"
              >
                {Math.round(safeProgress)}
              </motion.span>
              <span className="text-xl ml-0.5 opacity-80">%</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 mt-1 drop-shadow-sm">
              Liquid Volume
            </span>
          </div>
        )}

        {/* Top Metallic Cap/Reflection */}
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/25 to-transparent border-t border-white/30 rounded-t-[inherit] z-20" />

        {/* Bottom Shadow Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent rounded-b-[inherit] pointer-events-none z-20" />
      </div>

      {/* Small Stand Base for Premium Feel */}
      <div className="w-2/3 h-2 bg-gradient-to-b from-border to-muted-foreground/30 rounded-b-xl shadow-lg border border-t-0 border-white/10 dark:border-white/5 opacity-80" />
    </div>
  );
};
