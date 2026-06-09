"use client";

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** SVG blob morphing through four organic shapes via path interpolation. */
export interface MorphingBlobShapeProps {
  className?: string;
  size?: number;
  colors?: [string, string];
  duration?: number;
}

const BLOBS = [
  'M421,317.5Q414,385,346,420.5Q278,456,205,432Q132,408,99,340Q66,272,98,202Q130,132,201,99Q272,66,344,99Q416,132,422,201.5Q428,250,421,317.5Z',
  'M435,322Q414,394,344,420Q274,446,202,427Q130,408,89,343Q48,278,86,206Q124,134,196,99Q268,64,341,98Q414,132,432,201Q450,250,435,322Z',
  'M409,313Q401,376,338,407Q275,438,205,428Q135,418,93,342Q51,266,89,196Q127,126,200,98Q273,70,348,99Q423,128,422,201Q421,274,409,313Z',
  'M428,308Q406,366,348,402Q290,438,219,431Q148,424,95,365Q42,306,77,232Q112,158,189,104Q266,50,343,93Q420,136,434,202Q448,268,428,308Z',
];

export const MorphingBlobShape: React.FC<MorphingBlobShapeProps> = ({
  className,
  size = 360,
  colors = ['var(--accent)', 'rgb(124,58,237)'],
  duration = 9,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const gradId = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`mb-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
        <filter id={`mbb-${gradId}`}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <motion.path
        fill={`url(#mb-${gradId})`}
        initial={{ d: BLOBS[0] }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                d: [...BLOBS, BLOBS[0]],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        d={BLOBS[0]}
        filter={`url(#mbb-${gradId})`}
      />
    </svg>
  );
};
