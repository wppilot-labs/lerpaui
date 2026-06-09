"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, animate} from "framer-motion";
import { Sparkles, Gift } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BundleItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
}

export interface ProductBundleSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  bundleName?: string;
  discountPercentage?: number; // e.g. 15 for 15% discount
  items?: BundleItem[];
  onAddBundleToCart?: (selectedItems: BundleItem[], finalPrice: number) => void;
}

const defaultBundleItems: BundleItem[] = [
  {
    id: 'b1',
    name: 'Tactical Matte Water Flask',
    category: 'Hydration Pack',
    price: 32,
    originalPrice: 42,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'b2',
    name: 'Weatherproof Trail Organizer',
    category: 'Travel Gear',
    price: 48,
    originalPrice: 58,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'b3',
    name: 'Minimalist Aluminum Keyholder',
    category: 'Everyday Carry',
    price: 25,
    originalPrice: 35,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop'
  }
];

// Helper component for hardware-accelerated price count-up
const AnimatedPriceText: React.FC<{ value: number }> = ({ value }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    const controls = animate(prevValueRef.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // premium easeOutQuart
      onUpdate(current) {
        node.textContent = Math.round(current).toString();
      }
    });

    prevValueRef.current = value;
    return () => controls.stop();
  }, [value]);

  return <span ref={spanRef}>{Math.round(value)}</span>;
};

export const ProductBundleSelector: React.FC<ProductBundleSelectorProps> = ({
  bundleName = "Everyday Adventure Starter Kit",
  discountPercentage = 20, // extra 20% off bundles
  items = defaultBundleItems,
  onAddBundleToCart,
  className,
  ...props
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map(item => item.id));
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleToggleItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const selectedItems = items.filter(item => selectedIds.includes(item.id));
  
  // Calculations
  const rawOriginalTotal = selectedItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const rawSubtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const bundleSaving = rawOriginalTotal - rawSubtotal;

  const springTransition = prefersReducedMotion 
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 180, damping: 22, mass: 0.5 };

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 rounded-[32px] p-6 sm:p-8 shadow-xl",
        className
      )}
      {...props}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">{bundleName}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold mt-1">
            Build your own bundle. Check items below to save up to {discountPercentage}% off retail pricing.
          </p>
        </div>

        {/* Highlight Tag */}
        <div className="self-start sm:self-center flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Extra Pack Saving</span>
        </div>
      </div>

      {/* Grid of Bundle Item Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <motion.div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              animate={prefersReducedMotion ? {} : {
                scale: isSelected ? 1.02 : 0.99,
                y: isSelected ? -4 : 0
              }}
              transition={springTransition}
              className={cn(
                "rounded-2xl p-4 bg-white dark:bg-zinc-900 border transition-all duration-350 cursor-pointer select-none relative overflow-hidden",
                isSelected
                  ? "border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20"
                  : "border-slate-200/60 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm"
              )}
            >
              {/* SVG checkmark in corner */}
              <div className="absolute top-3 right-3 z-10">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    isSelected 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-slate-300 dark:border-zinc-700 bg-transparent text-transparent"
                  )}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-3.5 h-3.5 stroke-current stroke-[3]"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <motion.path 
                      d="M20 6L9 17l-5-5" 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isSelected ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>

              {/* Item Image */}
              <div className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Info & Prices */}
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-wider">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 line-clamp-1 mt-0.5">
                  {item.name}
                </h4>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ${item.price}
                  </span>
                  <span className="text-[10px] line-through font-semibold text-slate-400 dark:text-zinc-500">
                    ${item.originalPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Summary Block with Fintech Pricing transitions */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-850 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 justify-center sm:justify-start">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ${rawSubtotal > 0 ? <AnimatedPriceText value={rawSubtotal} /> : '0'}
              </span>
              {bundleSaving > 0 && (
                <span className="text-sm line-through text-slate-400 dark:text-zinc-500 font-bold">
                  ${rawOriginalTotal}
                </span>
              )}
            </div>
            
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">
              {selectedIds.length === 0 
                ? "No items selected. Select packages to build starter kits."
                : `You are saving $${bundleSaving} off regular shelf pricing!`}
            </p>
          </div>
        </div>

        {/* Dynamic button checkout */}
        <button
          type="button"
          onClick={() => onAddBundleToCart && onAddBundleToCart(selectedItems, rawSubtotal)}
          disabled={selectedIds.length === 0}
          className={cn(
            "w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold transition-all text-sm shadow-md",
            selectedIds.length === 0
              ? "bg-slate-100 text-slate-400 border border-slate-200/30 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
              : "bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 active:scale-[0.98]"
          )}
        >
          Add Bundle ({selectedIds.length} Items)
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
