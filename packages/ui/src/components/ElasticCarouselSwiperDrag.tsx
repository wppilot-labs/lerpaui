'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Cpu, Sparkles, Layers } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CarouselCard {
  /** Card title (large heading). */
  title: string;
  /** Short body description. */
  desc: string;
  /** Pill label shown at the top of the card. */
  category: string;
  /** Tailwind `from-* to-*` gradient classes (without the `bg-gradient-to-br` prefix). */
  color: string;
}

export interface ElasticCarouselSwiperDragProps {
  className?: string;
  /** Carousel cards. */
  cards?: CarouselCard[];
  /** Small label above the carousel. */
  label?: string;
  /** Index of the card shown first. */
  defaultIndex?: number;
}

const DEFAULT_CARDS: CarouselCard[] = [
  { title: "Performance", desc: "Real-time adaptive tuning for production workloads.", category: "Core", color: "from-purple-600 to-indigo-600" },
  { title: "Gateway", desc: "Instant sync with pipeline-parallel request flow.", category: "Network", color: "from-blue-600 to-cyan-600" },
  { title: "Mesh", desc: "Dynamic cluster distribution and routing.", category: "Infrastructure", color: "from-emerald-600 to-teal-600" },
  { title: "Storage", desc: "Sub-millisecond reads across distributed indices.", category: "Data", color: "from-orange-600 to-red-600" },
];

export const ElasticCarouselSwiperDrag: React.FC<ElasticCarouselSwiperDragProps> = ({
  className,
  cards = DEFAULT_CARDS,
  label = "Elastic Drag Swiper",
  defaultIndex = 0,
}) => {
  const [activeIdx, setActiveIdx] = useState(defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 22 });
  const prefersReducedMotion = useReducedMotion();

  const cardWidth = 240;
  const gap = 16;
  const maxDrag = -((cards.length - 1) * (cardWidth + gap));

  const handleDrag = (_e: unknown, info: PanInfo) => {
    let newX = x.get() + info.delta.x;
    if (newX > 0) {
      newX = newX * 0.35; // elastic pull resistance
    } else if (newX < maxDrag) {
      const over = newX - maxDrag;
      newX = maxDrag + over * 0.35; // elastic pull resistance
    }
    x.set(newX);
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const currentX = x.get();
    const velocity = info.velocity.x;
    const projectedTarget = currentX + velocity * 0.12;
    let targetIdx = Math.round(-projectedTarget / (cardWidth + gap));
    targetIdx = Math.max(0, Math.min(cards.length - 1, targetIdx));
    
    x.set(-targetIdx * (cardWidth + gap));
    setActiveIdx(targetIdx);
  };

  const shiftSlide = (dir: 'prev' | 'next') => {
    const nextIdx = dir === 'prev' ? activeIdx - 1 : activeIdx + 1;
    if (nextIdx >= 0 && nextIdx < cards.length) {
      x.set(-nextIdx * (cardWidth + gap));
      setActiveIdx(nextIdx);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={activeIdx === 0}
            onClick={() => shiftSlide('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={activeIdx === cards.length - 1}
            onClick={() => shiftSlide('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full h-[180px] overflow-visible flex items-center">
        <motion.div
          drag="x"
          style={{ x: springX }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="flex gap-4 cursor-grab active:cursor-grabbing touch-none"
        >
          {cards.map((card, idx) => {
            const isFocus = idx === activeIdx;
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isFocus ? 1.02 : 0.94,
                  opacity: isFocus ? 1 : 0.65,
                }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 20 }}
                className={cn('w-[240px] h-[160px] rounded-2xl bg-gradient-to-br p-4 flex flex-col justify-between text-white shadow-xl relative shrink-0 overflow-hidden', card.color)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-4 -mt-4 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">{card.category}</span>
                  {idx === 0 && <Cpu className="w-4 h-4 text-purple-200" />}
                  {idx === 1 && <Layers className="w-4 h-4 text-cyan-200" />}
                  {idx === 2 && <Sparkles className="w-4 h-4 text-teal-200" />}
                  {idx === 3 && <Layers className="w-4 h-4 text-red-200" />}
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wide">{card.title}</h4>
                  <p className="text-[10px] text-white/80 font-medium leading-tight mt-1 line-clamp-2">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="w-full flex justify-center gap-1.5 z-10">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={cn('h-1.5 rounded-full transition-all duration-300', 
              idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  );
};
