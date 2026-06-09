"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Info, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SizingFitIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  smallCount?: number;
  trueToSizeCount?: number;
  largeCount?: number;
  averageValue?: number; // 0 to 100 (0=Runs Small, 50=True to Size, 100=Runs Large)
}

export const SizingFitIndicator: React.FC<SizingFitIndicatorProps> = ({
  smallCount = 28,
  trueToSizeCount = 112,
  largeCount = 18,
  averageValue = 46, // slightly runs small (around 46/100)
  className,
  ...props
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<'small' | 'true' | 'large' | null>(null);
  const [userVote, setUserVote] = useState<'small' | 'true' | 'large' | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dynamic calculations
  const totalReviews = smallCount + trueToSizeCount + largeCount + (userVote ? 1 : 0);
  
  const pctSmall = useMemo(() => {
    const count = smallCount + (userVote === 'small' ? 1 : 0);
    return Math.round((count / totalReviews) * 100);
  }, [smallCount, userVote, totalReviews]);

  const pctTrue = useMemo(() => {
    const count = trueToSizeCount + (userVote === 'true' ? 1 : 0);
    return Math.round((count / totalReviews) * 100);
  }, [trueToSizeCount, userVote, totalReviews]);

  const pctLarge = useMemo(() => {
    const count = largeCount + (userVote === 'large' ? 1 : 0);
    return Math.round((count / totalReviews) * 100);
  }, [largeCount, userVote, totalReviews]);

  // General text summary
  const fitSummaryText = useMemo(() => {
    if (averageValue < 35) return "Runs Small";
    if (averageValue >= 35 && averageValue <= 45) return "Slightly Small";
    if (averageValue > 45 && averageValue < 55) return "True to Size";
    if (averageValue >= 55 && averageValue <= 65) return "Slightly Large";
    return "Runs Large";
  }, [averageValue]);

  const handleVote = (type: 'small' | 'true' | 'large') => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-md select-none",
        className
      )}
      {...props}
    >
      {/* Header Info */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase">
            Fit Feedback
          </h4>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
            Based on {totalReviews} buyer ratings
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
            {fitSummaryText}
          </span>
        </div>
      </div>

      {/* Main Track with Spring Pointer */}
      <div className="relative pt-8 pb-4">
        {/* Pointer Arrow and Tooltip */}
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${averageValue}%` }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 140, damping: 20 }}
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
        >
          {/* Average value tag */}
          <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 dark:text-amber-500" />
            <span>Avg: {averageValue}%</span>
          </div>
          {/* Caret pointing down */}
          <div className="w-2 h-2 bg-slate-900 dark:bg-zinc-100 rotate-45 -mt-1" />
        </motion.div>

        {/* Dynamic Horizontal Meter splits in 3 segments */}
        <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full flex overflow-hidden border border-slate-200/20 dark:border-zinc-700/20">
          {/* Small Segment */}
          <div 
            onMouseEnter={() => setHoveredSegment('small')}
            onMouseLeave={() => setHoveredSegment(null)}
            role="img"
            className="h-full bg-amber-400/80 hover:bg-amber-400 transition-colors cursor-help w-[30%]"
            aria-label="Runs Small segment"
          />
          {/* True to Size Segment */}
          <div 
            onMouseEnter={() => setHoveredSegment('true')}
            onMouseLeave={() => setHoveredSegment(null)}
            role="img"
            className="h-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-help w-[40%] border-x border-white/20 dark:border-zinc-900/20"
            aria-label="True to size segment"
          />
          {/* Large Segment */}
          <div 
            onMouseEnter={() => setHoveredSegment('large')}
            onMouseLeave={() => setHoveredSegment(null)}
            role="img"
            className="h-full bg-indigo-500/80 hover:bg-indigo-500 transition-colors cursor-help w-[30%]"
            aria-label="Runs Large segment"
          />
        </div>

        {/* Labels below the track */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-2.5">
          <span>Runs Small</span>
          <span>True to size</span>
          <span>Runs Large</span>
        </div>
      </div>

      {/* Dynamic Overlay Tooltips Info Panel */}
      <div className="h-14 mt-2 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-zinc-900/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-900/40">
        <AnimatePresence mode="wait">
          {hoveredSegment === 'small' && (
            <motion.div
              key="small-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-amber-500" />
              <span>{pctSmall}% of buyers say it runs <span className="font-extrabold text-slate-800 dark:text-zinc-200">1-2 sizes too small</span>.</span>
            </motion.div>
          )}

          {hoveredSegment === 'true' && (
            <motion.div
              key="true-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-emerald-500" />
              <span>{pctTrue}% of buyers say it fits <span className="font-extrabold text-slate-800 dark:text-zinc-200">perfectly true to size</span>.</span>
            </motion.div>
          )}

          {hoveredSegment === 'large' && (
            <motion.div
              key="large-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-indigo-500" />
              <span>{pctLarge}% of buyers say it runs <span className="font-extrabold text-slate-800 dark:text-zinc-200">1-2 sizes too large</span>.</span>
            </motion.div>
          )}

          {!hoveredSegment && (
            <motion.div
              key="default-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-slate-500 dark:text-zinc-500 flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hover over segments or add your feedback below.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User interactive polling survey */}
      <div className="mt-5 pt-5 border-t border-slate-100 dark:border-zinc-900/50">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-3 text-center">
          How did this product fit you?
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: 'small', label: 'Runs Small' },
            { type: 'true', label: 'True to Size' },
            { type: 'large', label: 'Runs Large' }
          ].map((item) => {
            const isVoted = userVote === item.type;
            return (
              <button
                type="button"
                key={item.type}
                onClick={() => handleVote(item.type as 'small' | 'true' | 'large')}
                className={cn(
                  "py-2 text-[10px] font-extrabold rounded-xl transition-all border outline-none",
                  isVoted
                    ? "bg-indigo-600 border-indigo-600 text-white font-black"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Tactile reduced motion hook helper
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
