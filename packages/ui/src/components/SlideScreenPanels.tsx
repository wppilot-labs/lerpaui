'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SlidePanelItem {
  id: string | number;
  title: string;
  subtitle?: string;
  category?: string;
  description: string;
  imageLeft: string;
  imageRight: string;
  accentColor?: string;
}

interface SlideScreenPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  slides?: SlidePanelItem[];
  panels?: {
    id: string | number;
    title: string;
    subtitle?: string;
    category?: string;
    description?: string;
    image?: string;
    imageLeft?: string;
    imageRight?: string;
    accentColor?: string;
  }[];
  orientation?: 'horizontal' | 'vertical';
  autoPlay?: boolean;
  interval?: number;
}

export function SlideScreenPanels({
  slides: slidesProp,
  panels,
  orientation = 'vertical',
  autoPlay = false,
  interval = 5000,
  className,
  ...props
}: SlideScreenPanelsProps) {
  const slides = React.useMemo(() => {
    if (slidesProp) return slidesProp;
    if (panels) {
      return panels.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category || 'Portfolio',
        description: p.description || 'Premium design and split-screen parallax movement.',
        imageLeft: p.imageLeft || p.image || '',
        imageRight: p.imageRight || p.image || '',
        accentColor: p.accentColor,
      }));
    }
    return [];
  }, [slidesProp, panels]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef<number | null>(null);

  const total = slides.length;

  const handleNext = () => {
    if (isAnimating) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleNext/handlePrev recreated each render; state deps trigger re-bind
  }, [currentIndex, isAnimating]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: handleNext recreated each render, currentIndex drives reset
  }, [autoPlay, interval, currentIndex]);

  // Touch and drag swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const pos = orientation === 'horizontal' ? e.touches[0].clientX : e.touches[0].clientY;
    touchStart.current = pos;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const pos = orientation === 'horizontal' ? e.touches[0].clientX : e.touches[0].clientY;
    const diff = touchStart.current - pos;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      touchStart.current = null;
    }
  };

  const currentSlide = slides[currentIndex];
  const accent = currentSlide?.accentColor || 'var(--color-primary-500, #a855f7)';

  // Panel slide variants based on direction
  const isVertical = orientation === 'vertical';

  const leftPanelVariants = {
    initial: (dir: number) => ({
      y: isVertical ? (dir > 0 ? '100%' : '-100%') : 0,
      x: !isVertical ? (dir > 0 ? '-100%' : '100%') : 0,
      opacity: 0.8,
    }),
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 26, stiffness: 120, mass: 1 },
    },
    exit: (dir: number) => ({
      y: isVertical ? (dir > 0 ? '-100%' : '100%') : 0,
      x: !isVertical ? (dir > 0 ? '100%' : '-100%') : 0,
      opacity: 0.8,
      transition: { type: 'spring', damping: 26, stiffness: 120, mass: 1 },
    }),
  };

  const rightPanelVariants = {
    initial: (dir: number) => ({
      y: isVertical ? (dir > 0 ? '-100%' : '100%') : 0,
      x: !isVertical ? (dir > 0 ? '100%' : '-100%') : 0,
      opacity: 0.8,
    }),
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 26, stiffness: 120, mass: 1 },
    },
    exit: (dir: number) => ({
      y: isVertical ? (dir > 0 ? '100%' : '-100%') : 0,
      x: !isVertical ? (dir > 0 ? '-100%' : '100%') : 0,
      opacity: 0.8,
      transition: { type: 'spring', damping: 26, stiffness: 120, mass: 1 },
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full h-[600px] md:h-[800px] bg-zinc-950 text-white overflow-hidden rounded-2xl border border-zinc-800 select-none",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      {...props}
    >
      <AnimatePresence initial={false} custom={direction} onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 grid grid-cols-1 md:grid-cols-2"
          onAnimationStart={() => setIsAnimating(true)}
        >
          {/* Left Panel - Slides DOWN/LEFT */}
          <motion.div
            custom={direction}
            variants={leftPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-1/2 md:h-full w-full overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800"
          >
            <img
              src={currentSlide.imageLeft}
              alt={`${currentSlide.title} visual left`}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            {/* Visual Portfolio Tag */}
            <div className="absolute top-6 left-6 z-10 flex items-center space-x-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: accent }}
              />
              <span className="text-xs uppercase tracking-widest text-zinc-300 font-semibold font-mono">
                {currentSlide.category || 'Portfolio'}
              </span>
            </div>
          </motion.div>

          {/* Right Panel - Slides UP/RIGHT (Opposite Direction) */}
          <motion.div
            custom={direction}
            variants={rightPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-1/2 md:h-full w-full overflow-hidden"
          >
            <img
              src={currentSlide.imageRight}
              alt={`${currentSlide.title} visual right`}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Center Content Card - Hoverable & Interactive */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end md:justify-center items-start p-6 md:p-12 z-20">
        <motion.div
          key={`text-${currentIndex}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 150, delay: 0.15 }}
          className="pointer-events-auto max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl relative group"
        >
          {currentSlide.subtitle && (
            <span className="text-sm font-semibold tracking-wider font-mono opacity-80" style={{ color: accent }}>
              {currentSlide.subtitle}
            </span>
          )}
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1 mb-4 leading-tight tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 font-sans">
            {currentSlide.description}
          </p>

          <a
            href="#explore"
            className="inline-flex items-center space-x-2 text-sm font-bold text-white group-hover:underline uppercase tracking-wider"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-4">
        {/* Indicators */}
        <div className="flex space-x-1.5 mr-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className="h-1.5 rounded-full transition-all duration-300 pointer-events-auto"
              style={{
                width: idx === currentIndex ? 24 : 8,
                backgroundColor: idx === currentIndex ? accent : 'rgba(255,255,255,0.25)',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-white pointer-events-auto"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-white pointer-events-auto"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
