'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ArrowRight, RefreshCw, Sparkles, Code } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StackedDepthCardCarouselProps {
  className?: string;
}

export const StackedDepthCardCarousel: React.FC<StackedDepthCardCarouselProps> = ({ className }) => {
  const [cards, setCards] = useState([
    { id: 1, title: "Cognitive Processing Engine", type: "AGENT CORE", info: "99.8% model precision mapping fluid spring networks.", bg: "bg-card border-purple-500/20 shadow-purple-500/5 text-purple-500" },
    { id: 2, title: "Distributed Cluster Orchestration", type: "MESH NET", info: "Scales elastically across multiple edge server shards.", bg: "bg-card border-blue-500/20 shadow-blue-500/5 text-blue-500" },
    { id: 3, title: "Synthesized Vector Shard Array", type: "STORAGE", info: "Instantaneous sub-millisecond similarity index sweeps.", bg: "bg-card border-emerald-500/20 shadow-emerald-500/5 text-emerald-500" },
  ]);

  const cycleCard = () => {
    setCards(prev => {
      const next = [...prev];
      const top = next.shift();
      if (top) next.push(top);
      return next;
    });
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Depth Stack Loop</span>
        <button
          type="button"
          onClick={cycleCard}
          aria-label="Cycle to next card"
          className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 transition-all active:scale-95 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <RefreshCw className="w-3 h-3 animate-spin-slow" aria-hidden="true" />
          <span className="text-[8px] font-black uppercase tracking-wider">Next</span>
        </button>
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {cards.map((card, idx) => {
            const isTop = idx === 0;
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{
                  scale: 1 - idx * 0.05,
                  opacity: 1 - idx * 0.25,
                  y: idx * 10,
                  zIndex: 10 - idx,
                }}
                exit={{ scale: 0.8, opacity: 0, x: 180, rotate: 15 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className={cn('absolute w-[250px] h-[140px] rounded-2xl border bg-card p-4 shadow-lg flex flex-col justify-between cursor-pointer hover:border-primary/45 transition-colors', isTop && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50', card.bg)}
                role={isTop ? 'button' : undefined}
                tabIndex={isTop ? 0 : -1}
                aria-label={isTop ? 'Cycle to next card' : undefined}
                aria-hidden={!isTop}
                onClick={isTop ? cycleCard : undefined}
                onKeyDown={
                  isTop
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          cycleCard();
                        }
                      }
                    : undefined
                }
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{card.type}</span>
                  {card.id === 1 && <Sparkles className="w-3.5 h-3.5" />}
                  {card.id === 2 && <Code className="w-3.5 h-3.5" />}
                  {card.id === 3 && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide text-foreground line-clamp-1">{card.title}</h4>
                  <p className="text-[9px] text-muted-foreground font-medium leading-tight mt-1 line-clamp-2">{card.info}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center z-10">Click topmost card or Next button to cycle</span>
    </div>
  );
};
