"use client";

import React, { useState, useRef } from 'react';
import { motion} from "framer-motion";
import { Star } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SentimentLabels {
  low: string;
  mid: string;
  high: string;
}

export interface ReviewSentimentScaleProps {
  className?: string;
  /** Initial percentage value (0-100). */
  defaultValue?: number;
  /** Header label. */
  label?: string;
  /** Threshold labels rendered below the score. */
  labels?: SentimentLabels;
  /** Called when the user changes the value. */
  onChange?: (value: number) => void;
}

const DEFAULT_LABELS: SentimentLabels = {
  low: "Unsatisfied",
  mid: "Neutral review",
  high: "Outstanding product",
};

export const ReviewSentimentScale: React.FC<ReviewSentimentScaleProps> = ({
  className,
  defaultValue = 70,
  label = "Sentiment Analyser",
  labels = DEFAULT_LABELS,
  onChange,
}) => {
  const [val, setValState] = useState(defaultValue); // percentage 0 to 100
  const setVal = (next: number) => {
    setValState(next);
    onChange?.(next);
  };
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    setVal(Math.floor((x / rect.width) * 100));
  };

  // Facial mouth path calculation based on val
  const mouthCurve = val < 35 
    ? "M 10,18 Q 16,13 22,18" 
    : val < 65 
    ? "M 10,16 Q 16,16 22,16" 
    : "M 10,13 Q 16,19 22,13";

  // Score colors oklch spectrum
  const activeColor = val < 35 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 
                      val < 65 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                      'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className={cn('w-full max-w-[320px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col items-center gap-4 relative', className)}>
      <div className="flex items-center gap-1.5 self-start pb-2 border-b border-border/40 w-full mb-1">
        <Star className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>

      {/* SVG Emoji face block */}
      <div className={cn('w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300', activeColor)}>
        <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {/* Eyes */}
          <circle cx="10" cy="11" r="1.5" fill="currentColor" />
          <circle cx="22" cy="11" r="1.5" fill="currentColor" />
          {/* Mouth dynamic path */}
          <path d={mouthCurve} />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-mono font-black text-foreground">{val + "%"}</span>
        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
          {val < 35 ? labels.low : val < 65 ? labels.mid : labels.high}
        </span>
      </div>

      {/* Slider Track */}
      <div
        ref={containerRef}
        role="slider"
        aria-label="Review sentiment"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={val}
        tabIndex={0}
        onMouseDown={(e) => { handleDrag(e); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setVal(Math.max(0, val - 5)); }
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setVal(Math.min(100, val + 5)); }
        }}
        className="h-3 w-full bg-secondary/80 rounded-full border border-border relative overflow-visible cursor-pointer select-none"
      >
        <motion.div 
          style={{ width: val + "%" }}
          className="absolute inset-y-0 left-0 bg-primary/20 rounded-full"
        />
        
        {/* Thumb pointer */}
        <motion.div 
          style={{ left: "calc(" + val + "% - 8px)" }}
          className="absolute -top-1.5 w-6 h-6 rounded-full border border-primary bg-card shadow-lg hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing flex items-center justify-center text-primary"
        >
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};
