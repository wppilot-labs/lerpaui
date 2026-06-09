"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ParallaxSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
}

export interface CinematicParallaxHeroProps {
  slides?: ParallaxSlide[];
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const DEFAULT_SLIDES: ParallaxSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1600&auto=format&fit=crop',
    title: 'SOLITUDE',
    subtitle: 'NATURE SHAPED BY TIME',
    tag: 'EXPLORE / WILDERNESS',
    description: 'Immerse your senses in volcanic black beaches and the endless green horizons of remote shorelines.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    title: 'BRUTALISM',
    subtitle: 'GEOMETRIC SYMMETRY',
    tag: 'DESIGN / ARCHITECTURE',
    description: 'A study of industrial raw form, concrete monolith structures, and structural minimalist shadow lines.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1600&auto=format&fit=crop',
    title: 'CYBERPUNK',
    subtitle: 'NEON METROPOLIS',
    tag: 'FUTURE / METROPOLIS',
    description: 'Experience nocturnal cityscape grids glowing under endless rains, hyper-reflections, and digital dreams.',
  },
];

// Inner helper to render characters sequentially sliding up inside masked spans
const SequentialLetterReveal: React.FC<{ text: string; active: boolean }> = ({ text, active }) => {
  // Split string into characters (preserving spaces)
  const letters = Array.from(text);

  return (
    <span className="inline-flex flex-wrap justify-center md:justify-start">
      {letters.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block w-4 md:w-6" aria-hidden="true">
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={index}
            className="inline-block overflow-hidden relative leading-[0.9] h-[1.1em] md:h-[0.95em]"
          >
            <motion.span
              initial={{ y: '100%' }}
              animate={active ? { y: '0%' } : { y: '100%' }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth easeOutExpo
                delay: index * 0.035,
              }}
              className="inline-block font-extrabold tracking-tighter"
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

export const CinematicParallaxHero: React.FC<CinematicParallaxHeroProps> = ({
  slides = DEFAULT_SLIDES,
  className,
  autoplay = true,
  autoplayInterval = 6500,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection('next');
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setDirection('prev');
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setDirection(index > activeIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setActiveIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(handleNext, autoplayInterval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: handleNext is recreated each render but state deps drive reset
  }, [autoplay, activeIndex, autoplayInterval, isTransitioning]);

  const activeSlide = slides[activeIndex];

  // Visual variants for the slide parallax & blur animation
  const slideVariants = {
    initial: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? '30%' : '-30%',
      opacity: 0,
      scale: 1.15,
      filter: 'blur(20px)',
    }),
    animate: {
      x: '0%',
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 26, mass: 1 },
        scale: { duration: 0.9, ease: 'easeOut' },
        opacity: { duration: 0.65 },
        filter: { duration: 0.7, ease: 'easeInOut' },
      },
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? '-30%' : '30%',
      opacity: 0,
      scale: 1.05,
      filter: 'blur(20px)',
      transition: {
        x: { duration: 0.7, ease: 'easeInOut' },
        scale: { duration: 0.7 },
        opacity: { duration: 0.45 },
        filter: { duration: 0.6 },
      },
    }),
  };

  return (
    <div className={cn('relative w-full h-[650px] md:h-[750px] bg-black overflow-hidden select-none', className)}>
      
      {/* Dynamic Background Image Layers with Deep Blur */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence 
          initial={false} 
          custom={direction} 
          onExitComplete={() => setIsTransitioning(false)}
        >
          <motion.div
            key={activeSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Full-bleed responsive high-definition image */}
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            {/* Cinematic Overlay Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-neutral-950/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-neutral-950/70 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid line layout to elevate creative magazine editorial styling */}
      <div className="absolute inset-0 z-10 grid grid-cols-12 pointer-events-none opacity-20">
        <div className="col-span-3 border-r border-white/20 h-full" />
        <div className="col-span-3 border-r border-white/20 h-full" />
        <div className="col-span-3 border-r border-white/20 h-full" />
        <div className="col-span-3 h-full" />
      </div>

      {/* Slide Foreground Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between px-6 py-8 md:px-16 md:py-16 text-white">
        
        {/* Top Header metadata */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase">LAUNCH PORTFOLIO / VOL. 10</span>
          </div>
          <span className="text-[9px] font-mono tracking-widest bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
            0{activeIndex + 1} — 0{slides.length}
          </span>
        </div>

        {/* Center Editorial Typography */}
        <div className="max-w-2xl text-center md:text-left self-center md:self-start w-full my-auto space-y-4">
          
          {/* Metadata Subtitle tag */}
          <motion.div
            key={`tag-${activeSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-bold text-primary tracking-[0.3em] uppercase"
          >
            {activeSlide.tag}
          </motion.div>

          {/* Sequential Masked Letter Reveal Title */}
          <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter select-text">
            <SequentialLetterReveal 
              text={activeSlide.title} 
              active={!isTransitioning} 
            />
          </h1>

          {/* Secondary Subtitle */}
          <motion.p
            key={`sub-${activeSlide.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-xl font-light text-white/90 tracking-[0.15em] uppercase"
          >
            {activeSlide.subtitle}
          </motion.p>

          {/* Description Block */}
          <motion.p
            key={`desc-${activeSlide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm text-neutral-300 font-normal leading-relaxed max-w-lg"
          >
            {activeSlide.description}
          </motion.p>
        </div>

        {/* Bottom Interactive Navigation & Progress Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full relative z-30">
          
          {/* Magazine Dot Pagination List */}
          <div className="flex gap-2.5 items-center">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="group focus:outline-none p-1"
              >
                <div className="relative w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: activeIndex === idx ? 1 : 0 }}
                    transition={{
                      duration: activeIndex === idx ? autoplayInterval / 1000 : 0.25,
                      ease: 'linear',
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
