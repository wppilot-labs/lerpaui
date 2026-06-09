"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DiagonalSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  bgOverlay?: string; // Optional tailwind overlay class like 'bg-black/40'
}

export interface DiagonalSlidingSliderFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: DiagonalSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const DiagonalSlidingSliderFrame: React.FC<DiagonalSlidingSliderFrameProps> = ({
  slides,
  autoplay = true,
  autoplayInterval = 5000,
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const prefersReducedMotion = usePrefersReducedMotion();
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlide = () => {
    setDirection('next');
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (autoplay && slides.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoplayInterval);
    }
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetAutoplay defined inline; deps drive intentional reset
  }, [activeIndex, autoplay, autoplayInterval, slides.length]);

  // Premium 45-degree diagonal clipping mask paths
  // Next: sweeps from top-right (polygon(100% 0, 100% 0, 100% 100%, 100% 100%)) to full, then exits bottom-left
  // Prev: sweeps from bottom-left (polygon(0 100%, 0 100%, 0 0, 0 0)) to full, then exits top-right
  const clipVariants = {
    initial: (dir: 'next' | 'prev') => ({
      clipPath: prefersReducedMotion
        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        : dir === 'next'
        ? 'polygon(120% 0%, 120% 0%, 100% 100%, 100% 100%)'
        : 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)',
      opacity: prefersReducedMotion ? 0 : 1,
    }),
    animate: {
      clipPath: 'polygon(-20% 0%, 120% 0%, 120% 100%, -20% 100%)',
      opacity: 1,
      transition: {
        duration: 0.95,
        ease: [0.25, 1, 0.5, 1], // smooth custom ease-out
      },
    },
    exit: (dir: 'next' | 'prev') => ({
      clipPath: prefersReducedMotion
        ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        : dir === 'next'
        ? 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)'
        : 'polygon(120% 0%, 120% 0%, 100% 100%, 100% 100%)',
      opacity: prefersReducedMotion ? 0 : 1,
      transition: {
        duration: 0.95,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeIndex];

  return (
    <div
      className={cn(
        'relative h-[550px] w-full overflow-hidden rounded-3xl border border-border bg-background shadow-2xl',
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={clipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 h-full w-full transform-gpu"
        >
          {/* Background Image with Zoom effect */}
          <motion.div
            initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />

          {/* Dark Overlay gradient for readable text */}
          <div className={cn('absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent', currentSlide.bgOverlay)} />

          {/* Slide Text Content */}
          <div className="absolute bottom-16 left-12 right-12 z-10 text-white max-w-2xl">
            <motion.span
              initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2 inline-block"
            >
              {currentSlide.subtitle || 'Premium Collection'}
            </motion.span>
            <motion.h2
              initial={{ y: prefersReducedMotion ? 0 : 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
            >
              {currentSlide.title}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Controls */}
      <div className="absolute right-8 bottom-12 z-20 flex items-center gap-3">
        <button
          onClick={() => {
            prevSlide();
            resetAutoplay();
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous Slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => {
            nextSlide();
            resetAutoplay();
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next Slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Dots Indicator */}
      <div className="absolute left-12 bottom-8 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > activeIndex ? 'next' : 'prev');
              setActiveIndex(idx);
              resetAutoplay();
            }}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
