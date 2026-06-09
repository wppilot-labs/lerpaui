"use client";

import React, { useId, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface LiquidSVGPhotoMorphProps {
  imageUrl?: string;
  className?: string;
}

export const LiquidSVGPhotoMorph: React.FC<LiquidSVGPhotoMorphProps> = ({
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const rawId = useId().replace(/:/g, '');
  const filterId = `goo-${rawId}`;

  return (
    <div className={cn('relative w-64 h-64 border border-border/40 rounded-3xl overflow-hidden shadow-xl bg-card select-none flex items-center justify-center p-3', className)}>
      {/* SVG liquid morph blur filters filter specifications */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full h-full relative cursor-pointer"
        style={{ filter: `url(#${filterId})` }}
      >
        {/* Liquid Organic Blob Frame 1 */}
        <motion.div
          animate={hovered ? {
            borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"]
          } : {
            borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%"
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-primary/20 border border-primary/40 overflow-hidden"
        >
          <img
            src={imageUrl}
            alt="Morphed art"
            className="w-full h-full object-cover transition-transform duration-500 scale-105 hover:scale-115"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Small merging liquid droplet satellite bubble */}
        <motion.div
          animate={hovered ? {
            x: [0, 40, -40, 0],
            y: [0, -50, 40, 0],
          } : {
            x: 0,
            y: 0
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-12 h-12 bg-primary/40 rounded-full blur-[1px] pointer-events-none -z-10 left-[40%] top-[40%]"
        />
      </div>

      <div className="absolute bottom-4 flex items-center gap-1.5 bg-black/50 text-white text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full backdrop-blur pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>Gooey Morph Hover</span>
      </div>
    </div>
  );
};
