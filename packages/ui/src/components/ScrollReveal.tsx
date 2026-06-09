"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface ScrollRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  splitBy?: 'words' | 'letters';
}

interface RevealTokenProps {
  token: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  splitBy: 'words' | 'letters';
  wordClassName?: string;
  prefersReducedMotion: boolean;
}

const RevealToken: React.FC<RevealTokenProps> = ({
  token,
  index,
  total,
  scrollYProgress,
  splitBy,
  wordClassName,
  prefersReducedMotion,
}) => {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
  const y = useTransform(scrollYProgress, [start, end], [8, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.98, 1]);

  const isSpace = token === ' ';

  if (prefersReducedMotion) {
    return (
      <span
        key={index}
        className={cn(
          'inline-block origin-bottom-left',
          splitBy === 'words' ? 'mr-[0.25em]' : '',
          isSpace ? 'w-[0.25em]' : '',
          wordClassName
        )}
      >
        {isSpace ? '\u00A0' : token}
      </span>
    );
  }

  return (
    <motion.span
      key={index}
      style={{ opacity, y, scale }}
      className={cn(
        'inline-block origin-bottom-left',
        splitBy === 'words' ? 'mr-[0.25em]' : '',
        isSpace ? 'w-[0.25em]' : '',
        wordClassName
      )}
    >
      {isSpace ? '\u00A0' : token}
    </motion.span>
  );
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  text,
  className,
  wordClassName,
  splitBy = 'words',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 35%'],
  });

  const tokens = splitBy === 'words' ? text.split(' ') : text.split('');

  return (
    <div ref={containerRef} className={cn('relative py-6', className)}>
      <p className="flex flex-wrap font-bold leading-normal">
        {tokens.map((token, i) => (
          <RevealToken
            key={i}
            token={token}
            index={i}
            total={tokens.length}
            scrollYProgress={scrollYProgress}
            splitBy={splitBy}
            wordClassName={wordClassName}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </p>
    </div>
  );
};
