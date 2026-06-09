/**
 * Adapted from Aceternity UI — MIT © Manu Arora
 * https://ui.aceternity.com
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className,
  showRadialGradient = true,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-bg duration-300">
      {/* Aurora Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Bands */}
        <div
          className={cn(
            'absolute -inset-[10px] opacity-50 blur-[60px] filter md:blur-[100px]',
            'after:content-[""] after:absolute after:inset-0',
            'after:[background-image:var(--white-gradient)] dark:after:[background-image:var(--dark-gradient)]',
            'after:[background-attachment:fixed] after:mix-blend-difference',
          )}
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 100% 0%, var(--aurora-blue, #38bdf8) 15%, transparent 60%),
              radial-gradient(ellipse at 0% 100%, var(--aurora-green, #10b981) 15%, transparent 60%),
              radial-gradient(ellipse at 100% 100%, var(--aurora-pink, #f43f5e) 15%, transparent 60%),
              radial-gradient(ellipse at 0% 0%, var(--aurora-purple, #a855f7) 15%, transparent 60%)
            `,
            backgroundSize: '300% 300%',
            animation: prefersReducedMotion ? undefined : 'aurora 18s ease-in-out infinite',
            willChange: prefersReducedMotion ? undefined : 'background-position',
          }}
        />

        {/* Dynamic Subtle Grid or Vignette */}
        {showRadialGradient && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, var(--background) 100%)`,
            }}
          />
        )}
      </div>

      {/* Content wrapper */}
      <div className={cn('relative z-20 w-full', className)}>
        {children}
      </div>

      {/* Style definitions for the aurora animations and gradients */}
      {!prefersReducedMotion && (
        <style>{`
          :root {
            --white-gradient: radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(255,255,255,0) 100%);
            --dark-gradient: radial-gradient(circle at 50% 50%, #0c0a09 0%, rgba(12,10,9,0) 100%);
          }
          @keyframes aurora {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      )}
    </main>
  );
};
