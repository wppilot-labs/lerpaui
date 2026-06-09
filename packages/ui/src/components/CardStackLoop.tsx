"use client";

import React, { useState, useEffect } from 'react';
import {motion, AnimatePresence, useMotionValue, type PanInfo } from "framer-motion";
import { cn } from '../lib/cn';
import { Layers } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';

interface CardStackLoopProps {
  cards: React.ReactNode[];
  className?: string;
  visibleCount?: number; // How many cards visible in background
  offsetDistance?: number; // Vertical offset of each stacked card (px)
  scaleFactor?: number; // Scaling down factor per level deep
}

export const CardStackLoop: React.FC<CardStackLoopProps> = ({
  cards: initialCards,
  className,
  visibleCount = 3,
  offsetDistance = 12,
  scaleFactor = 0.06,
}) => {
  const [cards, setCards] = useState<React.ReactNode[]>(initialCards);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Synchronize internal state with changes in props
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const _rotateX = useMotionValue(0);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (prefersReducedMotion) return;
    const threshold = 120;
    const velocityThreshold = 500;

    // Swipe away horizontally or vertically. Let's do horizontal/vertical combo or swipe up/down.
    // Let's support swiping in any direction, primarily vertical or horizontal.
    const isSwipeAway =
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.offset.y) > threshold ||
      Math.abs(info.velocity.x) > velocityThreshold ||
      Math.abs(info.velocity.y) > velocityThreshold;

    if (isSwipeAway) {
      // Rotate top card to bottom
      setCards((prev) => {
        const next = [...prev];
        const top = next.shift();
        if (top) next.push(top);
        return next;
      });
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center min-h-[380px] w-full max-w-md mx-auto select-none',
        className
      )}
    >
      <div className="relative w-full h-[280px]">
        <AnimatePresence mode="popLayout">
          {cards.slice(0, visibleCount).map((card, index) => {
            const isTop = index === 0;

            // Stack styling computations
            // Bottom cards are offset downward and scaled down
            const translateY = index * offsetDistance;
            const scale = 1 - index * scaleFactor;
            const zIndex = visibleCount - index;

            return (
              <motion.div
                key={index}
                style={{
                  transformOrigin: 'top center',
                  zIndex,
                }}
                className={cn(
                  "absolute inset-0 w-full h-full rounded-2xl border border-border bg-card shadow-lg flex items-center justify-center p-4",
                  isTop ? "cursor-grab active:cursor-grabbing border-primary" : "pointer-events-none"
                )}
                animate={{
                  y: translateY,
                  scale: scale,
                  opacity: index < visibleCount ? 1 - index * 0.25 : 0,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : {
                  type: 'spring',
                  stiffness: 320,
                  damping: 28,
                  mass: 0.8,
                }}
                drag={isTop && !prefersReducedMotion}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                whileDrag={prefersReducedMotion ? undefined : { scale: 1.02, zIndex: 100 }}
              >
                <div className="w-full h-full relative">
                  {card}

                  {isTop && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/10 text-primary pointer-events-none animate-pulse">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
