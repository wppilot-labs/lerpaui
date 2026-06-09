"use client";

import React, { useState } from 'react';
import {motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Quote, ChevronRight, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TestimonialCard {
  id: string;
  author: string;
  role: string;
  content: string;
}

export interface InfiniteStackedCardsProps {
  className?: string;
  /** Testimonial cards to cycle through. */
  cards?: TestimonialCard[];
  /** Header label. */
  label?: string;
}

const DEFAULT_CARDS: TestimonialCard[] = [
  { id: "1", author: "Sarah Jenkins", role: "Senior Engineer", content: "The component catalog delivers exceptional speed. Integrating complex flows takes seconds now." },
  { id: "2", author: "Devon Carter", role: "UX Designer", content: "Concentric rings, fluid loaders, and morph grids represent excellent visual craft." },
  { id: "3", author: "Marc Dupont", role: "Engineering Lead", content: "The CLI has saved us hundreds of engineering hours compiling registry components." }
];

export const InfiniteStackedCards: React.FC<InfiniteStackedCardsProps> = ({
  className,
  cards: initialCards = DEFAULT_CARDS,
  label = "Card Stack Loop",
}) => {
  const [cards, setCards] = useState<TestimonialCard[]>(initialCards);

  const swipeX = useMotionValue(0);
  const swipeRotate = useTransform(swipeX, [-150, 150], [-25, 25]);
  const swipeOpacity = useTransform(swipeX, [-150, -50, 0, 50, 150], [0, 0.9, 1, 0.9, 0]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      // Pop card away
      setCards(prev => {
        const next = [...prev];
        const popped = next.shift();
        if (popped) next.push(popped); // loop back
        return next;
      });
    }
  };

  const handleReset = () => {
    setCards(initialCards);
  };

  return (
    <div className={cn('w-full max-w-[340px] flex flex-col items-center gap-4 select-none relative', className)}>
      <div className="flex items-center justify-between w-full pb-2 border-b border-border/40 mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Quote className="w-4 h-4 text-primary" />
          {label}
        </span>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset card stack"
          className="p-1 border border-border bg-secondary/60 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <RefreshCcw className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center">
        {cards.slice(0, 3).reverse().map((card, index, arr) => {
          const isTop = index === arr.length - 1;
          const offsetScale = 1 - (arr.length - 1 - index) * 0.05;
          const offsetY = (arr.length - 1 - index) * 12;

          return (
            <motion.div
              key={card.id}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: -180, right: 180 }}
              style={isTop ? { x: swipeX, rotateZ: swipeRotate, opacity: swipeOpacity, zIndex: 10 } : { scale: offsetScale, y: offsetY, zIndex: index }}
              onDragEnd={isTop ? handleDragEnd : undefined}
              transition={isTop ? { type: 'spring', stiffness: 350, damping: 20 } : { duration: 0.3 }}
              className="absolute w-full p-5 border border-border/80 bg-card rounded-2xl shadow-xl flex flex-col justify-between cursor-grab active:cursor-grabbing backdrop-blur-md select-none h-full"
            >
              <p className="text-[10.5px] text-muted-foreground leading-relaxed italic">
                {"\"" + card.content + "\""}
              </p>
              <div className="flex justify-between items-end border-t border-border/40 pt-3">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-foreground">{card.author}</span>
                  <span className="text-[8.5px] text-primary uppercase font-bold tracking-widest mt-0.5">{card.role}</span>
                </div>
                {isTop && (
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-0.5">
                    Swipe x
                    <ChevronRight className="w-3 h-3 animate-ping" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
