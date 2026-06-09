"use client";

import React, { useState, useMemo } from 'react';
import { motion} from "framer-motion";
import { Ruler, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export type FitPreference = 'Slim' | 'Regular' | 'Loose';

export interface SizingEstimatorToolProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultHeight?: number; // in cm
  defaultWeight?: number; // in kg
  defaultFit?: FitPreference;
  onSizeRecommend?: (recommendedSize: string) => void;
}

export const SizingEstimatorTool: React.FC<SizingEstimatorToolProps> = ({
  defaultHeight = 175,
  defaultWeight = 75,
  defaultFit = 'Regular',
  onSizeRecommend,
  className,
  ...props
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [weight, setWeight] = useState(defaultWeight);
  const [fit, setFit] = useState<FitPreference>(defaultFit);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dynamic recommendation logic
  const recommendation = useMemo(() => {
    let sizeIndex = 1; // 0=S, 1=M, 2=L, 3=XL

    // Standard baseline logic
    const heightFactor = height - 170; // negative or positive
    const weightFactor = weight - 70;  // negative or positive
    const score = heightFactor * 0.4 + weightFactor * 0.6;

    if (score < -10) {
      sizeIndex = 0; // S
    } else if (score >= -10 && score < 8) {
      sizeIndex = 1; // M
    } else if (score >= 8 && score < 22) {
      sizeIndex = 2; // L
    } else {
      sizeIndex = 3; // XL
    }

    // Apply fit adjustment
    if (fit === 'Slim') {
      sizeIndex = Math.max(0, sizeIndex - 1);
    } else if (fit === 'Loose') {
      sizeIndex = Math.min(3, sizeIndex + 1);
    }

    const sizes = ['S', 'M', 'L', 'XL'];
    const result = sizes[sizeIndex];

    if (onSizeRecommend) {
      onSizeRecommend(result);
    }

    return result;
  }, [height, weight, fit, onSizeRecommend]);

  // Normalize styling scales for vector outline:
  // Heights run from 140 to 210 -> scaleY from 0.85 to 1.15
  // Weights run from 40 to 120 -> scaleX from 0.8 to 1.3
  const scaleY = useMemo(() => {
    const minH = 140;
    const maxH = 210;
    const norm = (height - minH) / (maxH - minH); // 0 to 1
    return 0.85 + norm * 0.3;
  }, [height]);

  const scaleX = useMemo(() => {
    const minW = 40;
    const maxW = 120;
    const norm = (weight - minW) / (maxW - minW); // 0 to 1
    return 0.75 + norm * 0.55;
  }, [weight]);

  const springTransition = prefersReducedMotion 
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 180, damping: 20, mass: 0.6 };

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 rounded-[32px] p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
        className
      )}
      {...props}
    >
      {/* Configuration Controls (Left) */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Ruler className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Find Your Fit</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed">
            Enter your height, weight, and style preference to calculate your perfect fit.
          </p>
        </div>

        {/* Height Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Height</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">{height} cm</span>
          </div>
          <input
            type="range"
            aria-label="Height (cm)"
            min="140"
            max="210"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1">
            <span>140cm</span>
            <span>175cm</span>
            <span>210cm</span>
          </div>
        </div>

        {/* Weight Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Weight</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">{weight} kg</span>
          </div>
          <input
            type="range"
            aria-label="Weight (kg)"
            min="40"
            max="120"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1">
            <span>40kg</span>
            <span>80kg</span>
            <span>120kg</span>
          </div>
        </div>

        {/* Fit Preference Toggles */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2.5">
            Fit Preference
          </span>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
            {(['Slim', 'Regular', 'Loose'] as FitPreference[]).map((f) => {
              const isSelected = fit === f;
              return (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFit(f)}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg transition-all focus:outline-none",
                    isSelected
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Dynamic Simulation and Output Result (Right) */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-slate-100 dark:border-zinc-900/50 min-h-[300px] relative overflow-hidden">
        {/* Dynamic Vector Body Contour Graphic */}
        <div className="w-full max-w-[150px] aspect-[1/2] flex items-center justify-center relative">
          <motion.div
            animate={{
              scaleX: scaleX,
              scaleY: scaleY,
            }}
            transition={springTransition}
            className="origin-bottom w-full h-full flex items-center justify-center"
          >
            {/* SVG Torso and Silhouette design */}
            <svg
              viewBox="0 0 100 200"
              className="w-full h-full text-indigo-500/20 dark:text-indigo-400/10 stroke-indigo-500 dark:stroke-indigo-400 fill-current"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Silhouette Torso & Legs Contour */}
              <path d="M 50 10 C 45 10, 43 15, 45 22 C 41 24, 38 27, 36 32 C 34 37, 34 45, 33 55 C 31 70, 28 85, 27 100 C 26 110, 27 125, 31 135 C 34 140, 36 142, 38 150 C 40 160, 42 185, 42 195 C 42 198, 45 198, 46 195 L 49 160 L 51 160 L 54 195 C 55 198, 58 198, 58 195 C 58 185, 60 160, 62 150 C 64 142, 66 140, 69 135 C 73 125, 74 110, 73 100 C 72 85, 69 70, 67 55 C 66 45, 66 37, 64 32 C 62 27, 59 24, 55 22 C 57 15, 55 10, 50 10 Z" />
              
              {/* Anatomical Marker Lines overlay */}
              <line x1="30" y1="55" x2="70" y2="55" className="opacity-40 stroke-indigo-600 dark:stroke-indigo-300" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="28" y1="100" x2="72" y2="100" className="opacity-40 stroke-indigo-600 dark:stroke-indigo-300" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </motion.div>

          {/* Sizing Indicator overlays */}
          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
            <span className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-950 px-1.5 py-0.5 rounded shadow-sm scale-90">
              CHEST
            </span>
          </div>

          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
            <span className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-950 px-1.5 py-0.5 rounded shadow-sm scale-90">
              WAIST
            </span>
          </div>
        </div>

        {/* Recommended Tag Panel Output */}
        <div className="w-full mt-6 text-center z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
            Recommended Size
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <motion.div
              key={recommendation}
              initial={prefersReducedMotion ? {} : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight"
            >
              {recommendation}
            </motion.div>
            
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-2 max-w-[180px] mx-auto">
            Fits {fit.toLowerCase()} cuts perfectly based on {height}cm & {weight}kg body structure.
          </p>
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
