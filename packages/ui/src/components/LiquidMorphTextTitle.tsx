"use client";

import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';

export interface LiquidMorphTextTitleProps {
  /** Array of words to morph between */
  words: string[];
  /** Duration of pause between words in milliseconds, default 3000 */
  interval?: number;
  /** Optional container class names */
  className?: string;
  /** Extra styling class for text element, e.g. "text-6xl font-black" */
  textClassName?: string;
}

export const LiquidMorphTextTitle: React.FC<LiquidMorphTextTitleProps> = ({
  words,
  interval = 3000,
  className,
  textClassName,
}) => {
  const [index, setIndex] = useState(0);
  const filterId = useId().replace(/:/g, '');

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  if (!words || words.length === 0) return null;

  return (
    <div className={cn("flex flex-col items-center justify-center py-6 select-none", className)}>
      
      {/* Hidden Liquid Morph Blur SVG Filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <defs>
          <filter id={`liquid-goo-${filterId}`}>
            {/* Soften edges with large blur */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            {/* Boost contrast to form hard fluid blobs */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 18 -7" 
              result="goo" 
            />
            {/* Composite original graphic to retain razor-sharp details if overlapping */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Morph Title Wrapper */}
      <div 
        className="relative flex items-center justify-center text-center select-none"
        style={{
          // Apply custom morph filter
          filter: `url(#liquid-goo-${filterId})`,
          WebkitFilter: `url(#liquid-goo-${filterId})`,
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.h1
            key={`morph-${index}`}
            initial={{ 
              opacity: 0, 
              scale: 0.75, 
              y: -10,
              filter: 'blur(8px)' 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              filter: 'blur(0px)' 
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.25, 
              y: 10,
              filter: 'blur(10px)' 
            }}
            transition={{
              // Custom premium elastic spring bezier
              duration: 0.9,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className={cn(
              "text-4xl md:text-6xl font-black bg-gradient-to-r from-primary via-emerald-400 to-teal-500 bg-clip-text text-transparent select-none pb-2",
              textClassName
            )}
          >
            {words[index]}
          </motion.h1>
        </AnimatePresence>
      </div>
    </div>
  );
};
