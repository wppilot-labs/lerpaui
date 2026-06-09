'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Database, Terminal, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SkewedCard {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind skew utility (e.g. `skew-y-3` or `-skew-y-3`). */
  skew: string;
}

export interface SkewedGalleryCarouselRowProps {
  className?: string;
  /** Cards to display in the skewed gallery. */
  cards?: SkewedCard[];
  /** Header label. */
  label?: string;
  /** Initially focused card. */
  defaultIndex?: number;
}

const DEFAULT_CARDS: SkewedCard[] = [
  { title: "Suite", desc: "Adaptive parameter tuning grids.", icon: Sparkles, skew: "skew-y-3" },
  { title: "Node", desc: "Secure mesh-sharding ledger.", icon: Terminal, skew: "-skew-y-3" },
  { title: "Index", desc: "High-performance vector matrices.", icon: Database, skew: "skew-y-3" },
  { title: "Deploy", desc: "Distributed edge server hooks.", icon: Globe, skew: "-skew-y-3" },
];

export const SkewedGalleryCarouselRow: React.FC<SkewedGalleryCarouselRowProps> = ({
  className,
  cards = DEFAULT_CARDS,
  label = "Skewed Perspective Deck",
  defaultIndex = 0,
}) => {
  const [activeIdx, setActiveIdx] = useState(defaultIndex);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex gap-2 items-center justify-center w-full h-[180px] overflow-visible">
        {cards.map((card, idx) => {
          const isActive = idx === activeIdx;
          return (
            <motion.div
              key={idx}
              onClick={() => {
                setActiveIdx(idx);
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
              }}
              whileHover={{ scale: 1.05 }}
              animate={{
                scale: isActive ? 1.08 : 0.92,
                rotate: isActive ? 0 : 3,
                zIndex: isActive ? 10 : 1,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className={cn('relative w-14 h-[140px] rounded-xl border bg-card border-border hover:border-primary/45 p-2 flex flex-col justify-between cursor-pointer transition-colors shadow-md overflow-hidden shrink-0', 
                isActive ? '' : card.skew
              )}
            >
              <div className="flex justify-center mt-1">
                <card.icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
              </div>

              {isActive ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-0.5 text-center mt-auto"
                >
                  <h5 className="text-[8.5px] font-black tracking-wide text-foreground line-clamp-1">{card.title}</h5>
                  <p className="text-[7.5px] text-muted-foreground leading-tight line-clamp-2">{card.desc}</p>
                </motion.div>
              ) : (
                <div className="text-[8px] text-muted-foreground/60 font-black text-center mt-auto">
                  0{idx + 1}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click skewed cards to straighten & inspect</span>
    </div>
  );
};
