"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue} from "framer-motion";
import { Star, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface GestureRatingStarsProps {
  maxStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
  className?: string;
}

export const GestureRatingStars: React.FC<GestureRatingStarsProps> = ({
  maxStars = 5,
  initialRating = 4.2,
  onChange,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState(initialRating);
  const [isHovered, setIsHovered] = useState(false);
  const _progressWidth = useMotionValue(0);

  const calculateRating = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const rawRating = (x / rect.width) * maxStars;
    const finalRating = Math.max(0.5, Math.min(maxStars, Math.round(rawRating * 2) / 2));
    setRating(finalRating);
    onChange?.(finalRating);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    calculateRating(e.clientX);
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      calculateRating(e.clientX);
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-5 bg-card border border-border rounded-2xl shadow-sm select-none', className)}>
      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-xs text-amber-500 font-bold mb-3 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Slide to rate</span>
      </div>

      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setIsHovered(false)}
        className="flex gap-1.5 cursor-pointer py-2 select-none touch-none"
      >
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starVal = idx + 1;
          const isFull = rating >= starVal;
          const isHalf = !isFull && rating >= starVal - 0.5;
          
          return (
            <motion.div
              key={idx}
              animate={{ 
                scale: isHovered && rating >= starVal - 0.5 ? 1.15 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative text-muted"
            >
              <Star className="w-8 h-8 fill-muted/15 stroke-border" />
              {(isFull || isHalf) && (
                <div 
                  className="absolute inset-0 overflow-hidden text-amber-400 select-none pointer-events-none"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star className="w-8 h-8 fill-amber-400 stroke-amber-500" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-xl font-black text-foreground">{rating.toFixed(1)} <span className="text-xs text-muted-foreground font-semibold">/ {maxStars}</span></h4>
      </div>
    </div>
  );
};
