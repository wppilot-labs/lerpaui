"use client";

import React, { useState } from 'react';
import {motion, useMotionValue, useTransform, useAnimation, type PanInfo } from "framer-motion";
import { Star, Quote, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';


export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface TestimonialStackCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    text: "The minimalist travel parka exceeds expectations. Truly waterproof, packed with modular pockets, and looks ultra sleek. I get questions on it constantly.",
    date: '2 days ago'
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Full Stack Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    text: "Remarkable quality. Sizing fit estimator recommended a size L, and it fits absolutely perfect, accommodating layers underneath. Will buy the olive color too.",
    date: '1 week ago'
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    role: 'Landscape Photographer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    text: "Their customer experience is unmatched. I personal engineered my engraving plate and they formatted it manually. The premium tactile feel of leather is gorgeous.",
    date: '3 weeks ago'
  }
];

export const TestimonialStackCarousel: React.FC<TestimonialStackCarouselProps> = ({
  testimonials = defaultTestimonials,
  className,
  ...props
}) => {
  const [stack, setStack] = useState<Testimonial[]>(testimonials);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Gesture movement values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const controls = useAnimation();

  const handleDragEnd = async (event: unknown, info: PanInfo) => {
    const swipeThreshold = 130;
    const swipeOffset = info.offset.x;

    if (swipeOffset > swipeThreshold) {
      // Swipe Right
      await controls.start({ x: 350, opacity: 0, transition: { duration: 0.2 } });
      cycleStack();
    } else if (swipeOffset < -swipeThreshold) {
      // Swipe Left
      await controls.start({ x: -350, opacity: 0, transition: { duration: 0.2 } });
      cycleStack();
    } else {
      // Snap back
      controls.start({ x: 0, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 250, damping: 20 } });
    }
  };

  const cycleStack = () => {
    // Put top card to bottom
    setStack(prev => {
      const next = [...prev];
      const top = next.shift();
      if (top) next.push(top);
      return next;
    });
    // Reset spring controls for the new top card
    x.set(0);
    controls.set({ x: 0, rotate: 0, opacity: 1 });
  };

  const handleNextBtn = async () => {
    if (prefersReducedMotion) {
      cycleStack();
      return;
    }
    await controls.start({ x: 300, opacity: 0, rotate: 10, transition: { duration: 0.25 } });
    cycleStack();
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-slate-50 dark:bg-zinc-950/40 border border-slate-200/60 dark:border-zinc-900/50 rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center select-none",
        className
      )}
      {...props}
    >
      {/* Testimonial Cards Deck Pile */}
      <div className="relative w-full h-[280px] flex items-center justify-center max-w-sm">
        {stack.map((t, idx) => {
          const isTop = idx === 0;
          
          // Position offset: Cards below index 0 are slightly scaled down and pushed down
          const yOffset = idx * 12;
          const scaleOffset = 1 - idx * 0.05;
          const zIndex = stack.length - idx;
          const cardOpacity = idx > 2 ? 0 : 1 - idx * 0.25;

          return (
            <motion.div
              key={t.id}
              drag={isTop && !prefersReducedMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
              animate={isTop ? controls : {
                y: yOffset,
                scale: scaleOffset,
                opacity: cardOpacity,
              }}
              style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : cardOpacity,
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
                cursor: isTop ? 'grab' : 'auto',
              }}
              whileDrag={{ cursor: 'grabbing' }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className={cn(
                "absolute top-0 w-full rounded-2xl p-6 border shadow-lg bg-white dark:bg-zinc-900 flex flex-col justify-between h-[250px]",
                isTop 
                  ? "border-slate-200/80 dark:border-zinc-800 shadow-slate-200/50 dark:shadow-black/60" 
                  : "border-slate-200/30 dark:border-zinc-800/40 shadow-none pointer-events-none"
              )}
            >
              {/* Card Quote icon & Ratings */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Quote className="w-8 h-8 text-indigo-500/20 fill-indigo-500/5" />
                  
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300 leading-relaxed italic line-clamp-4">
                  &quot;{t.text}&quot;
                </p>
              </div>

              {/* Verified Author detail bottom */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-200/50 dark:border-zinc-800" loading="lazy" decoding="async" />
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-zinc-100">
                      {t.name}
                    </h5>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                      {t.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Swipe Controls Navigation row */}
      <div className="w-full flex items-center justify-between mt-6 px-4">
        <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <RotateCw className="w-3 h-3 animate-spin-slow" />
          <span>Swipe card or drag deck</span>
        </span>

        <button
          onClick={handleNextBtn}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-85 transition-opacity px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60"
        >
          <span>Next Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


// Tactile reduced motion hook helper
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
