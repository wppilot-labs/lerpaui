"use client";

import React, { useRef } from 'react';
import { motion, useInView} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SplitTextCharacterSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  duration?: number;
  stagger?: number;
  delay?: number;
  once?: boolean;
  direction?: 'up' | 'down';
  characterClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export const SplitTextCharacterSlider: React.FC<SplitTextCharacterSliderProps> = ({
  text,
  duration = 0.8,
  stagger = 0.03,
  delay = 0,
  once = true,
  direction = 'up',
  characterClassName,
  as: Component = 'div',
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once, amount: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: {
      y: prefersReducedMotion ? 0 : direction === 'up' ? '100%' : '-100%',
      opacity: prefersReducedMotion ? 0 : 1,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Ultra smooth easeOutExpo
      },
    },
  };

  return (
    <Component
      ref={containerRef}
      className={cn('flex flex-wrap items-center justify-start leading-none', className)}
      {...props}
    >
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]"
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex overflow-hidden py-[0.1em] whitespace-nowrap">
            {word.split('').map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={letterVariants}
                className={cn(
                  'inline-block origin-bottom transform-gpu text-foreground',
                  characterClassName
                )}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Component>
  );
};
