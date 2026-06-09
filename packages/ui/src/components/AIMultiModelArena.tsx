"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AIMultiModelArenaProps {
  className?: string;
}

export const AIMultiModelArena: React.FC<AIMultiModelArenaProps> = ({ className }) => {
  const [activeModel, setActiveModel] = useState<'modelA' | 'modelB'>('modelA');
  const [prompt, _setPrompt] = useState('Build an interactive fluid wave container.');
  const [evaluation, setEvaluation] = useState<'liked' | 'disliked' | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const responses = {
    modelA: {
      name: "Claude-3.5-Sonnet",
      time: "0.45s",
      tokens: "850 t/s",
      content: "Here is a premium SVG fluid wave morph container code utilizing Framer Motion. We leverage double sine waves inside an SVG viewport, setting transition loop coordinates that cycle infinitely."
    },
    modelB: {
      name: "Llama-3-70B",
      time: "0.62s",
      tokens: "520 t/s",
      content: "To create an organic liquid tank, we can utilize a canvas layout with dynamic simplex noise fields, shifting vertical amplitude parameters relative to the global pointer coordinate."
    }
  };

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-4 relative', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Model Arena</span>
        </div>
        <div className="flex bg-secondary/80 border border-border p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => { setActiveModel('modelA'); setEvaluation(null); }}
            className={cn('text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer', activeModel === 'modelA' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground')}
          >
            Model A
          </button>
          <button
            type="button"
            onClick={() => { setActiveModel('modelB'); setEvaluation(null); }}
            className={cn('text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer', activeModel === 'modelB' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground')}
          >
            Model B
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 bg-secondary/40 border border-border/30 p-2.5 rounded-xl">
        <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Prompt Query</span>
        <span className="text-xs font-bold text-foreground leading-tight">{"\"" + prompt + "\""}</span>
      </div>

      <div className="relative min-h-[120px] bg-card/60 border border-border/40 p-3 rounded-xl overflow-hidden flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-foreground">{responses[activeModel].name}</span>
              <div className="flex items-center gap-2 text-[8px] text-muted-foreground font-semibold">
                <span>Time: {responses[activeModel].time}</span>
                <span>Speed: {responses[activeModel].tokens}</span>
              </div>
            </div>
            <p className="text-[10.5px] text-muted-foreground leading-relaxed">
              {responses[activeModel].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-[8.5px] text-muted-foreground uppercase font-bold tracking-wider">Evaluate response</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setEvaluation('liked')}
            aria-label="Like response"
            className={cn('p-1.5 border border-border/60 hover:border-emerald-500/40 rounded-lg cursor-pointer transition-all active:scale-90', evaluation === 'liked' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-muted-foreground')}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEvaluation('disliked')}
            aria-label="Dislike response"
            className={cn('p-1.5 border border-border/60 hover:border-rose-500/40 rounded-lg cursor-pointer transition-all active:scale-90', evaluation === 'disliked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'text-muted-foreground')}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
