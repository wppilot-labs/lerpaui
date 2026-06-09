'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Layers, RefreshCw, Cpu, Activity } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FlipCard {
  title: string;
  category: string;
  front: string;
  back: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CardDepthFlipCarouselFrameProps {
  className?: string;
  /** Cards to display in the carousel. */
  cards?: FlipCard[];
  /** Header label. */
  label?: string;
}

const DEFAULT_CARDS: FlipCard[] = [
  { title: "Compute", category: "Core", front: "Adaptive parameter tuning layers.", back: "Processing metrics: 99.8% precision with calibrated spring logic.", icon: Cpu },
  { title: "Gateway", category: "Network", front: "Secure distributed mesh pipelines.", back: "Latency: 1.2ms proxy nodes with elastic client backups.", icon: Layers },
  { title: "Vector Store", category: "Data", front: "Sub-millisecond similarity index vault.", back: "Capacity: 100M active vectors indexed in cluster matrices.", icon: Activity },
];

export const CardDepthFlipCarouselFrame: React.FC<CardDepthFlipCarouselFrameProps> = ({
  className,
  cards = DEFAULT_CARDS,
  label = "Depth Flip Carousel",
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cycleCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIdx(prev => (prev + 1) % cards.length);
    }, 150);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
        <button 
          onClick={cycleCard} 
          className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 transition-all active:scale-95 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3 animate-spin-slow" />
          <span className="text-[8px] font-black uppercase tracking-wider">Next</span>
        </button>
      </div>

      <div 
        className="relative w-full h-[180px] flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 30 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            onClick={() => {
              setIsFlipped(!isFlipped);
              if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
            }}
            className="w-[240px] h-[140px] cursor-pointer rounded-2xl relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Card Face */}
            <div 
              className="absolute inset-0 bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-lg"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{cards[activeIdx].category}</span>
                {React.createElement(cards[activeIdx].icon, { className: "w-4 h-4 text-primary" })}
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-foreground">{cards[activeIdx].title}</h4>
                <p className="text-[9px] text-muted-foreground leading-normal mt-1">{cards[activeIdx].front}</p>
              </div>
              <span className="text-[7.5px] font-extrabold uppercase text-muted-foreground/60">Click card to flip detailed specs</span>
            </div>

            {/* Back Card Face */}
            <div 
              className="absolute inset-0 bg-secondary/25 border border-primary/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg text-foreground"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono tracking-widest bg-primary/20 px-2 py-0.5 rounded-full text-primary uppercase font-black">METRIC SPECS</span>
                {React.createElement(cards[activeIdx].icon, { className: "w-4 h-4 text-primary" })}
              </div>
              <p className="text-[8.5px] text-muted-foreground leading-relaxed mt-1">{cards[activeIdx].back}</p>
              <span className="text-[7.5px] font-extrabold uppercase text-primary/80">Click card to return back</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-1">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={cn('h-1.5 rounded-full transition-all duration-300', 
              idx === activeIdx ? 'w-4 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  );
};
