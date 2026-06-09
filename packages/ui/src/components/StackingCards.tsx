"use client";

import React from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface StackingCardItem {
  id: string | number;
  title: string;
  description: string;
  bgClass?: string;
  content?: React.ReactNode;
}

interface StackingCardsProps {
  className?: string;
  cards: StackingCardItem[];
  cardTopOffset?: number;
}

export const StackingCards: React.FC<StackingCardsProps> = ({
  className,
  cards,
  cardTopOffset = 80,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn('relative flex flex-col gap-10 w-full max-w-4xl mx-auto py-12', className)}>
      {cards.map((card, i) => {
        // Increment top spacing for each sticky card to create stacked step layers
        const topSpacing = cardTopOffset + i * 24;

        // Calculate scaling/darkening depth factor based on index position
        const scaleFactor = 1 - (cards.length - 1 - i) * 0.02;

        return (
          <div
            key={card.id}
            style={{
              position: 'sticky',
              top: `${topSpacing}px`,
            }}
            className="w-full"
          >
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={prefersReducedMotion ? undefined : { once: true, margin: '-50px' }}
              transition={prefersReducedMotion ? undefined : {
                type: 'spring',
                stiffness: 100,
                damping: 20,
              }}
              style={{
                transformOrigin: 'top center',
                scale: scaleFactor,
              }}
              className={cn(
                'w-full min-h-[280px] rounded-3xl border border-border p-8 shadow-2xl flex flex-col justify-between backdrop-blur-md bg-card/95 text-card-foreground',
                card.bgClass
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                    Step 0{i + 1}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground/60">
                    [0{i + 1}/0{cards.length}]
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 flex-1 flex items-end">
                {card.content || (
                  <div className="h-12 w-full rounded-lg bg-muted/40 animate-pulse border border-border/50" />
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
