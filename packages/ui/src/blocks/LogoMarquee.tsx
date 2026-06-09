"use client";

import React from 'react';
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface LogoItem {
  name: string;
  logo: React.ReactNode;
}

export interface LogoMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  logos?: LogoItem[];
  direction?: 'left' | 'right';
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Hide the side fade masks. */
  noMask?: boolean;
  /** Pause the marquee when hovered. */
  pauseOnHover?: boolean;
}

const defaultLogos: LogoItem[] = [
  { name: 'SkyNet', logo: <span className="font-mono font-black text-xl italic tracking-tighter">SKYNET</span> },
  { name: 'Stark', logo: <span className="font-serif font-bold text-xl uppercase tracking-widest">STARK</span> },
  { name: 'Tyrell', logo: <span className="font-sans font-bold text-lg tracking-wide">TYRELL</span> },
  { name: 'Wayne', logo: <span className="font-mono font-semibold text-lg uppercase tracking-tight">WAYNE</span> },
  { name: 'Cyberdyne', logo: <span className="font-serif font-extrabold text-xl tracking-tighter">CYBERDYNE</span> },
  { name: 'Umbrella', logo: <span className="font-sans font-medium text-lg uppercase tracking-widest">UMBRELLA</span> },
];

export function LogoMarquee({
  logos = defaultLogos,
  direction = 'left',
  speed = 30,
  noMask = false,
  pauseOnHover = false,
  className,
  ...props
}: LogoMarqueeProps) {
  const reduced = usePrefersReducedMotion();
  const safeLogos = logos.length ? logos : defaultLogos;
  // Duplicate logos list to ensure infinite wrapping covers the viewport width
  const doubleLogos = React.useMemo(
    () => [...safeLogos, ...safeLogos, ...safeLogos, ...safeLogos],
    [safeLogos]
  );

  return (
    <div
      className={cn(
        'group relative flex overflow-hidden py-8 bg-background border-y border-border select-none',
        className
      )}
      role="region"
      aria-label="Trusted by"
      {...props}
    >
      {!noMask ? (
        <>
          <div aria-hidden className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div aria-hidden className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </>
      ) : null}

      <motion.div
        animate={
          reduced
            ? { x: 0 }
            : { x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }
        }
        transition={{
          ease: 'linear',
          duration: speed,
          repeat: reduced ? 0 : Infinity,
        }}
        className={cn(
          'flex items-center gap-16 shrink-0 min-w-full',
          pauseOnHover && !reduced && 'group-hover:[animation-play-state:paused]'
        )}
        style={pauseOnHover && !reduced ? { willChange: 'transform' } : undefined}
      >
        {(reduced ? safeLogos : doubleLogos).map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0 grayscale hover:grayscale-0 duration-300"
            aria-label={item.name}
          >
            {item.logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
