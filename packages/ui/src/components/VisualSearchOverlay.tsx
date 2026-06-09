"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Search, X, Flame, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface VisualCategory {
  id: string;
  name: string;
  count: number;
  image: string;
  colorHex?: string;
}

export interface VisualSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: VisualCategory[];
  onSearchSubmit?: (query: string) => void;
}

const defaultCategories: VisualCategory[] = [
  {
    id: 's1',
    name: 'Tactical Outerwear',
    count: 24,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'All-Terrain Sneakers',
    count: 16,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Everyday Travel Packs',
    count: 12,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 's4',
    name: 'Minimalist Accessories',
    count: 32,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop'
  }
];

export const VisualSearchOverlay: React.FC<VisualSearchOverlayProps> = ({
  isOpen,
  onClose,
  categories = defaultCategories,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  // Stagger variants for categories
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed inset-0 z-50 overflow-y-auto flex flex-col items-center justify-start",
            "bg-zinc-950/80 dark:bg-zinc-950/90 backdrop-blur-2xl px-4 md:px-8 py-[10vh]"
          )}
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors outline-none"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Box Input Bar */}
          <div className="w-full max-w-2xl text-center mb-12">
            <motion.form
              onSubmit={handleSubmit}
              initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative w-full flex items-center bg-white/10 border border-white/15 focus-within:border-indigo-500/80 rounded-2xl p-2 pl-4 shadow-xl backdrop-blur-md"
            >
              <Search className="w-5 h-5 text-white/50" />
              <input
                type="text"

                placeholder="Search collection, outerwear, sneakers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 text-white placeholder-white/40 px-3 py-3 text-sm font-semibold tracking-wide"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-white/90 transition-all flex items-center gap-1.5"
              >
                <span>Find</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-bold text-white/50">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Hot Searches:
              </span>
              {['Waterproof flask', 'Beanie', 'Runner'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Image Category Tags sliding with staggered transitions */}
          <div className="w-full max-w-3xl">
            <h3 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase mb-5">
              Explore Visual Categories
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {categories.map((c) => (
                <motion.div
                  key={c.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -4 }}
                  className="group rounded-2xl overflow-hidden aspect-[4/3] relative cursor-pointer border border-white/5 bg-zinc-900 shadow-md flex items-end p-4"
                >
                  {/* Background Image */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.7] group-hover:brightness-[0.6]"
                  />

                  {/* Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Category description content overlays */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white leading-tight">
                        {c.name}
                      </h4>
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">
                        {c.count} items
                      </span>
                    </div>
                    
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
