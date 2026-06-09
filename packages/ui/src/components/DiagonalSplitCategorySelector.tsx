"use client";

import React, { useState, useEffect } from 'react';
import { motion} from "framer-motion";
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CategorySplitItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  href?: string;
  colorOverlay?: string; // background Tailwind color class e.g. bg-blue-950/40
}

export interface DiagonalSplitCategorySelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: CategorySplitItem[];
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
}

const DEFAULT_ITEMS: CategorySplitItem[] = [
  {
    id: 'split-1',
    title: 'Precision Tech Gear',
    subtitle: 'ENGINEERED SPEED',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    ctaText: 'Explore Tech',
    colorOverlay: 'from-blue-950/70 via-indigo-900/40 to-transparent'
  },
  {
    id: 'split-2',
    title: 'Minimalist Apparel',
    subtitle: 'ESSENTIAL COMFORT',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
    ctaText: 'Shop Essentials',
    colorOverlay: 'from-rose-950/70 via-stone-900/40 to-transparent'
  }
];

export const DiagonalSplitCategorySelector = React.forwardRef<
  HTMLDivElement,
  DiagonalSplitCategorySelectorProps
>(({ className, items = DEFAULT_ITEMS, ...props }, ref) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Left item polygon clip path based on hover state
  const getLeftClipPath = () => {
    if (prefersReducedMotion) return 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
    if (hoveredIndex === 0) return 'polygon(0 0, 68% 0, 52% 100%, 0 100%)';
    if (hoveredIndex === 1) return 'polygon(0 0, 32% 0, 16% 100%, 0 100%)';
    return 'polygon(0 0, 55% 0, 45% 100%, 0 100%)'; // default mid-diagonal
  };

  // Right item polygon clip path based on hover state
  const getRightClipPath = () => {
    if (prefersReducedMotion) return 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
    if (hoveredIndex === 0) return 'polygon(68% 0, 100% 0, 100% 100%, 52% 100%)';
    if (hoveredIndex === 1) return 'polygon(32% 0, 100% 0, 100% 100%, 16% 100%)';
    return 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)'; // default mid-diagonal
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-4xl mx-auto h-[380px] sm:h-[480px] rounded-[32px] overflow-hidden shadow-xl border border-border bg-black relative select-none group/container',
        className
      )}
      {...props}
    >
      {/* MOBILE LAYER (Renders simple vertical category stack on small screens) */}
      <div className="flex flex-col h-full sm:hidden">
        {items.slice(0, 2).map((item, _idx) => (
          <div key={item.id} className="relative flex-1 flex flex-col justify-end p-5 overflow-hidden group">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            </div>

            {/* Info details */}
            <div className="relative z-10 flex flex-col gap-0.5">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                {item.subtitle}
              </span>
              <h3 className="text-xl font-black text-white leading-tight">
                {item.title}
              </h3>
              <a
                href={item.href || '#'}
                className="mt-2.5 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-md"
              >
                <span>{item.ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP/TABLET DIAGONAL SPLIT SCREEN */}
      <div className="hidden sm:block relative w-full h-full">
        {/* LEFT SPLIT SCREEN */}
        <motion.div
          animate={{
            clipPath: getLeftClipPath(),
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="absolute inset-y-0 left-0 w-full h-full z-10 cursor-pointer overflow-hidden origin-left"
        >
          {/* Inner Parallax Image Content */}
          <motion.div
            animate={{
              scale: hoveredIndex === 0 ? 1.04 : 1,
            }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full"
          >
            <img
              src={items[0].image}
              alt={items[0].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className={cn('absolute inset-0 bg-gradient-to-r', items[0].colorOverlay)} />

            {/* Card Content Details */}
            <div className="absolute bottom-10 left-10 max-w-[280px] md:max-w-sm flex flex-col items-start gap-1 z-20">
              <span className="text-xs font-black tracking-widest text-primary uppercase">
                {items[0].subtitle}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {items[0].title}
              </h3>
              <motion.button
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: hoveredIndex === 0 ? 1.05 : 1,
                }}
                className="mt-4 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-black text-xs shadow-lg hover:bg-slate-50 transition-colors"
              >
                <span>{items[0].ctaText}</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SPLIT SCREEN */}
        <motion.div
          animate={{
            clipPath: getRightClipPath(),
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="absolute inset-y-0 right-0 w-full h-full z-10 cursor-pointer overflow-hidden origin-right"
        >
          {/* Inner Parallax Image Content */}
          <motion.div
            animate={{
              scale: hoveredIndex === 1 ? 1.04 : 1,
            }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full"
          >
            <img
              src={items[1].image}
              alt={items[1].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className={cn('absolute inset-0 bg-gradient-to-l', items[1].colorOverlay)} />

            {/* Card Content Details */}
            <div className="absolute bottom-10 right-10 max-w-[280px] md:max-w-sm flex flex-col items-end text-right gap-1 z-20">
              <span className="text-xs font-black tracking-widest text-primary uppercase">
                {items[1].subtitle}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {items[1].title}
              </h3>
              <motion.button
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: hoveredIndex === 1 ? 1.05 : 1,
                }}
                className="mt-4 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-black text-xs shadow-lg hover:bg-slate-50 transition-colors"
              >
                <span>{items[1].ctaText}</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});

DiagonalSplitCategorySelector.displayName = 'DiagonalSplitCategorySelector';
