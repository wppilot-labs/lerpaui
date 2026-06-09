"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { CheckSquare, Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeTaskStackProps {
  onDismissAll?: () => void;
  className?: string;
}

export const SwipeTaskStack: React.FC<SwipeTaskStackProps> = ({
  onDismissAll: _onDismissAll,
  className,
}) => {
  const [cards, setCards] = useState([
    { id: '1', title: 'Verify compilation pass on Next 16', detail: 'Check strict type definitions on gallery pages.' },
    { id: '2', title: 'Bundle aggregates inside master registry', detail: 'Run validate scripts checking Zod schemas.' },
    { id: '3', title: 'Clean old stack dumps from scratch', detail: 'Locate orphan processes and purge files.' },
  ]);

  const handleSwipeUp = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
  };

  const reset = () => {
    setCards([
      { id: '1', title: 'Verify compilation pass on Next 16', detail: 'Check strict type definitions on gallery pages.' },
      { id: '2', title: 'Bundle aggregates inside master registry', detail: 'Run validate scripts checking Zod schemas.' },
      { id: '3', title: 'Clean old stack dumps from scratch', detail: 'Locate orphan processes and purge files.' },
    ]);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[260px] bg-secondary/5 border border-border rounded-2xl p-4 flex flex-col justify-between select-none overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2 z-10">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Swipe Up Tasks</span>
        </div>
        <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
          {cards.length} left
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center my-3">
        <AnimatePresence>
          {cards.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Check className="w-10 h-10 text-emerald-500 animate-bounce bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-full" />
              <h4 className="text-xs font-bold text-foreground">All Tasks Done!</h4>
              <button 
                onClick={reset}
                className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline"
              >
                Reset Tasks
              </button>
            </motion.div>
          ) : (
            cards.map((card, idx) => {
              const isFront = idx === cards.length - 1;
              const scale = 1 - (cards.length - 1 - idx) * 0.05;
              const yOffset = (cards.length - 1 - idx) * 8;

              return (
                <motion.div
                  key={card.id}
                  drag={isFront ? 'y' : false}
                  dragConstraints={{ top: -180, bottom: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(_e, info) => {
                    if (info.offset.y < -90) {
                      handleSwipeUp(card.id);
                    }
                  }}
                  animate={{
                    scale,
                    y: isFront ? 0 : yOffset,
                    zIndex: idx,
                  }}
                  className={cn('absolute w-full h-[120px] bg-card border border-border rounded-xl shadow-lg p-3 flex flex-col justify-between',
                    isFront ? 'cursor-grab active:cursor-grabbing border-primary/30' : 'opacity-60 pointer-events-none'
                  )}
                >
                  <div>
                    <h4 className="text-xs font-extrabold text-foreground leading-snug">{card.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{card.detail}</p>
                  </div>
                  {isFront && (
                    <span className="text-[8px] font-bold text-primary/60 uppercase tracking-widest text-right">
                      Drag Up to Complete
                    </span>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
