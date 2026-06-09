"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TiltGlareProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  price: string;
  category: string;
  badge?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onActionClick?: () => void;
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

export const TiltGlareProductCard = React.forwardRef<
  HTMLDivElement,
  TiltGlareProductCardProps
>(({
  className,
  image,
  title,
  price,
  category,
  badge,
  rarity = 'rare',
  onActionClick,
  ...props
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Mouse coords mapped to -0.5 to 0.5 range
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 140, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);

  // Position of glare overlay
  const glareX = useSpring(useTransform(x, [0, 1], ['0%', '100%']), springConfig);
  const glareY = useSpring(useTransform(y, [0, 1], ['0%', '100%']), springConfig);
  const glareOpacity = useSpring(useTransform(x, [0, 1], [0.15, 0.45]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handlePointerLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Holographic foil configurations per rarity
  const foilThemes = {
    common: {
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,200,200,0.1) 50%, rgba(255,255,255,0.4) 100%)',
      badgeColor: 'bg-slate-500 text-white',
      cardBorder: 'hover:border-slate-400/60',
      shadowColor: 'hover:shadow-slate-400/25',
    },
    rare: {
      gradient: 'linear-gradient(105deg, rgba(6,182,212,0.3) 0%, rgba(59,130,246,0.15) 30%, rgba(139,92,246,0.3) 70%, rgba(6,182,212,0.3) 100%)',
      badgeColor: 'bg-blue-600 text-white',
      cardBorder: 'hover:border-blue-500/60',
      shadowColor: 'hover:shadow-blue-500/25',
    },
    epic: {
      gradient: 'linear-gradient(115deg, rgba(236,72,153,0.35) 0%, rgba(139,92,246,0.2) 40%, rgba(245,158,11,0.35) 80%, rgba(236,72,153,0.35) 100%)',
      badgeColor: 'bg-purple-600 text-white',
      cardBorder: 'hover:border-purple-500/60',
      shadowColor: 'hover:shadow-purple-500/30',
    },
    legendary: {
      gradient: 'linear-gradient(125deg, rgba(245,158,11,0.4) 0%, rgba(6,182,212,0.2) 30%, rgba(16,185,129,0.3) 60%, rgba(245,158,11,0.4) 100%)',
      badgeColor: 'bg-amber-500 text-black font-extrabold',
      cardBorder: 'hover:border-amber-400/80',
      shadowColor: 'hover:shadow-amber-500/40',
    },
  };

  const theme = foilThemes[rarity];

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
          'relative w-full max-w-[320px] aspect-[1/1.4] rounded-3xl border border-border bg-card text-card-foreground p-5 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer',
          theme.cardBorder,
          theme.shadowColor
        )}
      >
        {/* Animated Holographic Glare Shimmer Layer */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: theme.gradient,
              backgroundPosition: `${glareX} ${glareY}`,
              opacity: glareOpacity,
            }}
          />
        )}

        {/* Card Header */}
        <div className="flex justify-between items-center z-20" style={{ transform: 'translateZ(20px)' }}>
          <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase bg-secondary px-2.5 py-0.5 rounded-full">
            {category}
          </span>
          <span className={cn('text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm', theme.badgeColor)}>
            <Sparkles className="w-2.5 h-2.5" />
            {rarity}
          </span>
        </div>

        {/* Image Canvas with Parallax */}
        <div
          className="flex-1 flex items-center justify-center my-4 relative group-hover:scale-[1.03] transition-transform duration-500"
          style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(35px)' }}
        >
          {/* Ambient blur backdrop glow */}
          <div className="absolute inset-0 bg-radial-gradient from-accent/15 to-transparent rounded-full filter blur-xl scale-75 group-hover:scale-100 transition-transform duration-700" />
          <img
            src={image}
            alt={title || ''}
            className="max-h-[160px] w-auto object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Product Details Area */}
        <div className="flex flex-col gap-2 z-20" style={{ transform: 'translateZ(25px)' }}>
          {badge && (
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-primary">
              {badge}
            </span>
          )}
          {title && (
            <h3 className="text-lg font-black tracking-tight text-foreground line-clamp-1">
              {title}
            </h3>
          )}

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/60">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Foil Price</span>
              <span className="text-xl font-extrabold text-foreground">{price}</span>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.();
              }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Acquire</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

TiltGlareProductCard.displayName = 'TiltGlareProductCard';
