"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef } from 'react';
import { motion, useInView} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface BlurTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  animateBy?: 'words' | 'letters';
  blurAmount?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className,
  wordClassName,
  animateBy = 'words',
  blurAmount = '12px',
  stagger = 0.05,
  duration = 0.6,
  delay = 0,
  once = true,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(containerRef, { once, amount: 0.15 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = animateBy === 'words' ? text.split(' ') : text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      filter: prefersReducedMotion ? 'blur(0px)' : `blur(${blurAmount})`,
      y: prefersReducedMotion ? 0 : 10,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier for smooth motion
      },
    },
  };

  return (
    <motion.p
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn('inline-flex flex-wrap leading-relaxed', className)}
    >
      {items.map((item, index) => {
        // If animating by words, add a space after each word.
        // If animating by letters, handle space character to avoid layout shifts.
        const isSpace = item === ' ';
        
        return (
          <motion.span
            key={index}
            variants={childVariants}
            className={cn(
              'inline-block',
              animateBy === 'words' ? 'mr-[0.25em]' : '',
              isSpace ? 'w-[0.25em]' : '',
              wordClassName
            )}
          >
            {isSpace ? '\u00A0' : item}
          </motion.span>
        );
      })}
    </motion.p>
  );
};
