"use client";

import React, { useEffect, useState } from 'react';
import { motion} from "framer-motion";
import { Laptop, Shirt, Smartphone, Dribbble, Coffee, Music, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BubbleCategoryItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;
  color: string; // Tailwind background color class, e.g., 'bg-blue-500'
  badge?: string;
  href?: string;
}

export interface CategoryNavigationBubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  categories?: BubbleCategoryItem[];
  onSelect?: (id: string) => void;
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

const DEFAULT_CATEGORIES: BubbleCategoryItem[] = [
  {
    id: 'cat-tech',
    label: 'Tech Gear',
    icon: <Laptop className="w-6 h-6" />,
    color: 'bg-indigo-500 shadow-indigo-500/20 text-white',
    badge: 'New',
  },
  {
    id: 'cat-style',
    label: 'Fashion',
    icon: <Shirt className="w-6 h-6" />,
    color: 'bg-emerald-500 shadow-emerald-500/20 text-white',
  },
  {
    id: 'cat-mobile',
    label: 'Smartphones',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-amber-500 shadow-amber-500/20 text-white',
    badge: 'Hot',
  },
  {
    id: 'cat-active',
    label: 'Sports',
    icon: <Dribbble className="w-6 h-6" />,
    color: 'bg-rose-500 shadow-rose-500/20 text-white',
  },
  {
    id: 'cat-coffee',
    label: 'Cafe Shop',
    icon: <Coffee className="w-6 h-6" />,
    color: 'bg-amber-700 shadow-amber-700/20 text-white',
  },
  {
    id: 'cat-music',
    label: 'Audio',
    icon: <Music className="w-6 h-6" />,
    color: 'bg-violet-500 shadow-violet-500/20 text-white',
    badge: '30% Off',
  },
];

export const CategoryNavigationBubble = React.forwardRef<
  HTMLDivElement,
  CategoryNavigationBubbleProps
>(({ className, categories = DEFAULT_CATEGORIES, onSelect, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Floating coordinates per index to create organic clouds
  const getFloatingParams = (index: number) => {
    if (prefersReducedMotion) return { y: 0 };

    const offsetRange = [4, -5, 6, -4, 5, -6];
    const durationRange = [3, 3.4, 2.8, 3.2, 3.5, 2.9];

    const offset = offsetRange[index % offsetRange.length];
    const duration = durationRange[index % durationRange.length];

    return {
      animate: {
        y: [0, offset, 0],
      },
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    };
  };

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const bubbleVariants = {
    hidden: { scale: 0.4, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 220,
        damping: 15,
      },
    },
  };

  return (
    <div
      ref={ref}
      className={cn('w-full max-w-2xl mx-auto p-6 flex flex-col items-center gap-6 select-none', className)}
      {...props}
    >
      <div className="text-center flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Quick Navigation
        </span>
        <h3 className="text-xl font-black text-foreground">Interactive Categories</h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-lg py-4"
      >
        {categories.map((cat, idx) => {
          const float = getFloatingParams(idx);

          return (
            <motion.div
              key={cat.id}
              variants={bubbleVariants}
              animate={float.animate}
              transition={float.transition}
              className="relative"
            >
              {/* Bubble Button */}
              <motion.button
                onClick={() => onSelect?.(cat.id)}
                whileHover={
                  prefersReducedMotion
                    ? { scale: 1.05 }
                    : {
                        scale: 1.15,
                        rotate: [0, -3, 3, 0],
                        transition: {
                          type: 'spring',
                          stiffness: 400,
                          damping: 14,
                        },
                      }
                }
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center gap-2 shadow-lg border border-white/10 relative transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  cat.color
                )}
              >
                {/* Icon panel */}
                <div className="shrink-0 scale-100 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon ? cat.icon : <Zap className="w-6 h-6" />}
                </div>

                {/* Subtitle label */}
                <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase opacity-90 leading-none">
                  {cat.label}
                </span>
              </motion.button>

              {/* Dynamic Notification badge */}
              {cat.badge && (
                <motion.span
                  initial={prefersReducedMotion ? {} : { scale: 0 }}
                  animate={prefersReducedMotion ? {} : { scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05, type: 'spring', stiffness: 260 }}
                  className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md border border-white/20 select-none pointer-events-none"
                >
                  {cat.badge}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

CategoryNavigationBubble.displayName = 'CategoryNavigationBubble';
