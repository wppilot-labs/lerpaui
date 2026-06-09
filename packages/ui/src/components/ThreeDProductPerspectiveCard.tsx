"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ThreeDProductPerspectiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  category: string;
  price: string;
  rating?: number;
  description?: string;
  onActionClick?: () => void;
  actionText?: string;
  badge?: string;
}

// Inlined prefers-reduced-motion hook for accessibility support as requested
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

export const ThreeDProductPerspectiveCard = React.forwardRef<
  HTMLDivElement,
  ThreeDProductPerspectiveCardProps
>(({ className, image, title, category, price, rating = 4.5, description, onActionClick, actionText = 'Add to Cart', badge, ...props }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dynamic spring values for cursor tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring options for elastic feel
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Glare overlay position mapping
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], ['0%', '100%']), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], ['0%', '100%']), springConfig);
  const glareOpacity = useSpring(useTransform(x, [-0.5, 0.5], [0.1, 0.4]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalizing mouse relative coordinate from -0.5 to 0.5
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      className={cn('perspective-1000 flex items-center justify-center p-4', className)}
      {...props}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'relative w-full max-w-sm rounded-3xl border border-border bg-card text-card-foreground shadow-xl transition-shadow duration-300 hover:shadow-2xl overflow-hidden group cursor-pointer'
        )}
      >
        {/* Holographic Glare Layer */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 mix-blend-color-dodge rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 60%)`,
              opacity: glareOpacity,
            }}
          />
        )}

        {/* Card Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-primary text-primary-foreground shadow-sm">
            {badge}
          </span>
        )}

        {/* Main Card Content container with 3D translation support */}
        <div style={{ transform: 'translateZ(20px)' }} className="p-5 flex flex-col h-full select-none">
          {/* Image Canvas with 3D Pop Effect */}
          <div className="relative rounded-2xl bg-muted overflow-hidden flex items-center justify-center aspect-square transition-transform duration-300 group-hover:scale-[1.02] shadow-inner">
            <img
              src={image}
              alt={title || ''}
              className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110"
              style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(30px)' }}
              draggable={false}
            />
            {/* Quick Actions overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-background text-foreground rounded-full shadow-md hover:bg-accent transition-colors"
                title="Quick View"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Info section with translation depth */}
          <div className="mt-5 flex-1 flex flex-col" style={{ transform: 'translateZ(15px)' }}>
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {category}
            </span>
            {title && (
              <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground line-clamp-1">
                {title}
              </h3>
            )}

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">({rating})</span>
            </div>

            {description && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Pricing & Call-to-action */}
            <div className="mt-auto pt-5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold">Total Price</span>
                <span className="text-2xl font-black text-foreground">{price}</span>
              </div>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.();
                }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{actionText}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

ThreeDProductPerspectiveCard.displayName = 'ThreeDProductPerspectiveCard';
