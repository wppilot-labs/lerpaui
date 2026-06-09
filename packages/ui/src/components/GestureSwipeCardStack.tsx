"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Tinder-style stacked cards: drag past threshold flings, next card rises. */
export interface SwipeCard {
  id: string | number;
  title?: string;
  subtitle?: string;
  image?: string;
  content?: React.ReactNode;
}

export interface GestureSwipeCardStackProps {
  cards?: SwipeCard[];
  className?: string;
  onSwipe?: (card: SwipeCard, dir: 'left' | 'right') => void;
  threshold?: number;
}

const DEFAULT_CARDS: SwipeCard[] = [
  { id: 1, title: 'Aurora Nights', subtitle: 'Drag to swipe' },
  { id: 2, title: 'Magnetic Pulse', subtitle: 'Or click below' },
  { id: 3, title: 'Liquid Geometry', subtitle: 'Cards stack in depth' },
  { id: 4, title: 'Holographic Foil', subtitle: 'And rotate' },
];

interface CardLayerProps {
  card: SwipeCard;
  index: number;
  total: number;
  onLeave: (dir: 'left' | 'right') => void;
  threshold: number;
  reduced: boolean;
}

const CardLayer: React.FC<CardLayerProps> = ({ card, index, total, onLeave, threshold, reduced }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -threshold, 0, threshold, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, threshold], [0, 1]);
  const nopeOpacity = useTransform(x, [-threshold, 0], [1, 0]);

  const isTop = index === 0;
  const scale = 1 - index * 0.04;
  const yOffset = index * 14;

  return (
    <motion.div
      drag={isTop && !reduced ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > threshold) {
          onLeave(info.offset.x > 0 ? 'right' : 'left');
        }
      }}
      initial={false}
      animate={{ scale, y: yOffset }}
      exit={{
        x: x.get() > 0 ? 600 : -600,
        rotate: x.get() > 0 ? 30 : -30,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: total - index,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-2xl active:cursor-grabbing"
    >
      {card.image && (
        <img
          src={card.image}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
        />
      )}
      <div className="relative flex h-full flex-col justify-end">
        <span className="text-xs uppercase tracking-[0.2em] opacity-60">Card {String(card.id)}</span>
        {card.title && <h3 className="mt-1 text-3xl font-semibold">{card.title}</h3>}
        {card.subtitle && <p className="mt-1 text-sm opacity-70">{card.subtitle}</p>}
        {card.content}
      </div>
      {isTop && !reduced && (
        <>
          <motion.span
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute right-6 top-6 rounded-md border-2 border-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400"
          >
            Like
          </motion.span>
          <motion.span
            style={{ opacity: nopeOpacity }}
            className="pointer-events-none absolute left-6 top-6 rounded-md border-2 border-rose-400 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-400"
          >
            Nope
          </motion.span>
        </>
      )}
    </motion.div>
  );
};

export const GestureSwipeCardStack: React.FC<GestureSwipeCardStackProps> = ({
  cards = DEFAULT_CARDS,
  className,
  onSwipe,
  threshold = 120,
}) => {
  const reduced = usePrefersReducedMotion();
  const [stack, setStack] = useState(cards);

  const handleLeave = (dir: 'left' | 'right') => {
    const top = stack[0];
    if (!top) return;
    onSwipe?.(top, dir);
    setStack((s) => s.slice(1));
  };

  return (
    <div className={cn('relative h-96 w-72', className)}>
      <AnimatePresence initial={false}>
        {stack
          .slice(0, 3)
          .map((c, i) => (
            <CardLayer
              key={c.id}
              card={c}
              index={i}
              total={Math.min(stack.length, 3)}
              onLeave={handleLeave}
              threshold={threshold}
              reduced={reduced}
            />
          ))
          .reverse()}
      </AnimatePresence>
      {stack.length === 0 && (
        <div className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-[var(--border)] text-sm opacity-60">
          No more cards
        </div>
      )}
    </div>
  );
};
