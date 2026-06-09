"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef } from 'react';
import { motion, useInView, Variants} from "framer-motion";
import { cn } from '../lib/cn';

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  animationType?: 'rise' | 'rotate' | 'scale' | 'slide-up';
  once?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className,
  charClassName,
  stagger = 0.03,
  duration = 0.5,
  delay = 0,
  animationType = 'rise',
  once = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once, amount: 0.2 });

  // Define motion variants based on animation type
  const getVariants = (): Variants => {
    switch (animationType) {
      case 'rotate':
        return {
          hidden: { rotateX: 90, y: 30, opacity: 0 },
          visible: { rotateX: 0, y: 0, opacity: 1 },
        };
      case 'scale':
        return {
          hidden: { scale: 0.3, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
        };
      case 'slide-up':
        return {
          hidden: { y: '50%', opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
      case 'rise':
      default:
        return {
          hidden: { y: '100%', opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
    }
  };

  const itemVariants = getVariants();

  // Split text into words, then words into characters, keeping layout correct
  const words = text.split(' ');

  // Keep a running global index of characters to apply the correct staggered delay
  let globalCharIndex = 0;

  return (
    <div
      ref={containerRef}
      className={cn('inline-flex flex-wrap overflow-hidden leading-normal', className)}
    >
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        
        return (
          <span
            key={`${word}-${wordIdx}`}
            className="inline-block whitespace-nowrap mr-[0.25em]"
          >
            {chars.map((char) => {
              const charIndex = globalCharIndex++;
              return (
                <span
                  key={charIndex}
                  className="inline-block overflow-hidden vertical-align-bottom"
                >
                  <motion.span
                    variants={itemVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    transition={{
                      duration: duration,
                      delay: delay + charIndex * stagger,
                      ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                    className={cn('inline-block origin-bottom', charClassName)}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
