"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo, AnimatePresence } from 'framer-motion';
import { Flame, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TinderCard {
  id: string;
  name: string;
  desc: string;
}

export interface TinderStackCardProps {
  /** Cards to render in the stack. Resetting restores this list. */
  cards?: TinderCard[];
  /** Header label. */
  label?: string;
  /** Called when a card is swiped in either direction. */
  onAction?: (action: 'like' | 'dislike', card: TinderCard) => void;
  className?: string;
}

const DEFAULT_CARDS: TinderCard[] = [
  { id: '1', name: 'Adaptive Streams', desc: 'Deploy auto-scaled compute grids.' },
  { id: '2', name: 'Dynamic Waves', desc: 'Fluid layouts tracking content ratios.' },
  { id: '3', name: 'Proximity Docks', desc: 'Smoothly expanding layout controls.' },
];

export const TinderStackCard: React.FC<TinderStackCardProps> = ({
  cards: initialCards = DEFAULT_CARDS,
  label = "Throw Stack Card",
  onAction,
  className,
}) => {
  const [cards, setCards] = useState<TinderCard[]>(initialCards);

  const handleSwipe = (id: string, action: 'like' | 'dislike') => {
    const swiped = cards.find(c => c.id === id);
    setCards(prev => prev.filter(c => c.id !== id));
    if (swiped) onAction?.(action, swiped);
  };

  const reset = () => {
    setCards(initialCards);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 border border-border rounded-2xl p-4 flex flex-col justify-between overflow-hidden select-none', className)}>
      <div className="flex items-center gap-1.5 border-b border-border/40 pb-2 z-10">
        <Flame className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center my-3">
        <AnimatePresence>
          {cards.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="text-xs font-bold text-foreground">Stack Empty</span>
              <button 
                onClick={reset}
                className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline"
              >
                Refill Stack
              </button>
            </motion.div>
          ) : (
            cards.map((card, idx) => {
              const isFront = idx === cards.length - 1;
              const scale = 1 - (cards.length - 1 - idx) * 0.05;
              const yOffset = (cards.length - 1 - idx) * 8;

              return (
                <TinderCardItem
                  key={card.id}
                  card={card}
                  isFront={isFront}
                  scale={scale}
                  yOffset={yOffset}
                  onSwipe={(action) => handleSwipe(card.id, action)}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface TinderCardItemProps {
  card: { id: string; name: string; desc: string };
  isFront: boolean;
  scale: number;
  yOffset: number;
  onSwipe: (action: 'like' | 'dislike') => void;
}

const TinderCardItem: React.FC<TinderCardItemProps> = ({
  card,
  isFront,
  scale,
  yOffset,
  onSwipe,
}) => {
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x > 130) {
      onSwipe('like');
    } else if (info.offset.x < -130) {
      onSwipe('dislike');
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      style={{ x: springX, rotate, opacity }}
      onDragEnd={handleDragEnd}
      animate={{
        scale,
        y: isFront ? 0 : yOffset,
        zIndex: isFront ? 10 : 0,
      }}
      className={cn('absolute w-full h-[180px] bg-card border border-border rounded-xl shadow-lg p-4 flex flex-col justify-between',
        isFront ? 'cursor-grab active:cursor-grabbing border-primary/20' : 'opacity-50 pointer-events-none'
      )}
    >
      <div>
        <h4 className="text-xs font-black text-foreground">{card.name}</h4>
        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
      </div>

      {isFront && (
        <div className="flex justify-between items-center">
          <ThumbsDown className="w-4 h-4 text-rose-500 opacity-40 animate-pulse" />
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Flick card left/right</span>
          <ThumbsUp className="w-4 h-4 text-emerald-500 opacity-40 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
};
