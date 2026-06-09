"use client";

import React, { useState, useEffect } from 'react';
import { motion} from "framer-motion";
import { RotateCw, ShoppingCart, Check, Info } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface FlipCardProductVerticalProps extends React.HTMLAttributes<HTMLDivElement> {
  frontImage: string;
  frontTitle: string;
  frontCategory: string;
  frontPrice: string;
  backTitle?: string;
  backDescription?: string;
  backSpecs?: ProductSpec[];
  actionText?: string;
  onActionClick?: () => void;
  trigger?: 'hover' | 'click';
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

export const FlipCardProductVertical = React.forwardRef<
  HTMLDivElement,
  FlipCardProductVerticalProps
>(({
  className,
  frontImage,
  frontTitle,
  frontCategory,
  frontPrice,
  backTitle,
  backDescription,
  backSpecs = [
    { label: 'Brand', value: 'Lerpa UI Premium' },
    { label: 'Material', value: 'Carbon Fiber & Alloy' },
    { label: 'Weight', value: '180g (Ultra Light)' },
    { label: 'Warranty', value: '2 Years Manufacturer' }
  ],
  actionText = 'Quick Purchase',
  onActionClick,
  trigger = 'hover',
  ...props
}, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Handle pointer interactions based on trigger type
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsFlipped(false);
    }
  };

  const handleAction = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setIsAdded(true);
    onActionClick?.();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-[340px] aspect-[4/5] perspective-2000 select-none',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className="relative w-full h-full duration-500 transform-style-3d"
        animate={{
          rotateX: prefersReducedMotion ? 0 : (isFlipped ? 180 : 0),
        }}
        transition={prefersReducedMotion ? { duration: 0 } : {
          type: 'spring',
          stiffness: 120,
          damping: 20,
          mass: 0.8,
        }}
      >
        {/* FRONT SIDE */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border bg-card p-5 shadow-lg flex flex-col justify-between overflow-hidden',
            prefersReducedMotion && isFlipped && 'hidden'
          )}
        >
          {/* Top category & Flip Icon Indicator */}
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase bg-muted px-2.5 py-1 rounded-md">
              {frontCategory}
            </span>
            <button
              type="button"
              aria-label="Flip for specifications"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              title="Flip for specifications"
            >
              <RotateCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Product Image Canvas */}
          <div className="flex-1 flex items-center justify-center py-4 relative group">
            <div className="absolute inset-0 bg-radial-gradient from-accent/10 to-transparent rounded-full filter blur-xl scale-75 group-hover:scale-100 transition-transform duration-700" />
            <img
              src={frontImage}
              alt={frontTitle || ''}
              className="max-h-[170px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              draggable={false}
            />
          </div>

          {/* Title & Price Footer */}
          <div className="mt-auto pt-3 border-t border-border/60">
            {frontTitle && (
              <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
                {frontTitle}
              </h3>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-primary">{frontPrice}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium bg-secondary px-2 py-0.5 rounded-md">
                <Info className="w-3.5 h-3.5" />
                {trigger === 'click' ? 'Click to flip' : 'Hover to flip'}
              </span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border bg-card p-5 shadow-lg flex flex-col justify-between overflow-hidden',
            prefersReducedMotion ? (!isFlipped && 'hidden') : 'rotate-x-180'
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border/80 pb-3">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Technical Specifications
              </span>
              {(backTitle || frontTitle) && (
                <h4 className="text-base font-bold text-foreground line-clamp-1">
                  {backTitle || frontTitle}
                </h4>
              )}
            </div>
            <button
              type="button"
              aria-label="Return to image"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              title="Return to image"
            >
              <RotateCw className="w-4 h-4 rotate-180" aria-hidden="true" />
            </button>
          </div>

          {/* Details / Specifications list */}
          <div className="flex-1 flex flex-col justify-center gap-3 py-4">
            {backDescription && (
              <p className="text-xs text-muted-foreground leading-relaxed text-center mb-1">
                {backDescription}
              </p>
            )}
            <div className="space-y-2">
              {backSpecs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted transition-colors"
                >
                  <span className="font-semibold text-muted-foreground">{spec.label}</span>
                  <span className="font-bold text-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-action Footer */}
          <div className="mt-auto">
            <motion.button
              type="button"
              tabIndex={0}
              onClick={handleAction}
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAction(e); } }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300',
                isAdded
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{actionText}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

FlipCardProductVertical.displayName = 'FlipCardProductVertical';
