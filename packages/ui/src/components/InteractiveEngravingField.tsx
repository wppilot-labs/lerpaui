"use client";

import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Edit3, Type, CheckCircle } from 'lucide-react';
import { cn } from '../lib/cn';


export type EngravingStyle = 'Gold Foil' | 'Silver Foil' | 'Blind Deboss';

export interface InteractiveEngravingFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  maxCharacters?: number;
  productImage?: string;
  defaultText?: string;
}

export const InteractiveEngravingField: React.FC<InteractiveEngravingFieldProps> = ({
  maxCharacters = 12,
  productImage = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop", // Leather notebook/journal
  defaultText = "EXPLORE",
  className,
  ...props
}) => {
  const [text, setText] = useState(defaultText);
  const [styleType, setStyleType] = useState<EngravingStyle>('Gold Foil');
  const [activeFont, setActiveFont] = useState<'Serif' | 'Sans' | 'Script'>('Serif');
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const textShadowX = useMotionValue(0);
  const textShadowY = useMotionValue(0);

  // Springs for snappy premium animation
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rX = useSpring(rotateX, springConfig);
  const rY = useSpring(rotateY, springConfig);
  const tsX = useSpring(textShadowX, springConfig);
  const tsY = useSpring(textShadowY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalised position: -0.5 to 0.5
    const pctX = (mouseX / width) - 0.5;
    const pctY = (mouseY / height) - 0.5;

    // Tilt card up to 15 degrees
    rotateX.set(-pctY * 16);
    rotateY.set(pctX * 16);

    // Cast light-source shadows: shadow moves opposite to the cursor
    textShadowX.set(-pctX * 6);
    textShadowY.set(-pctY * 6);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    textShadowX.set(0);
    textShadowY.set(0);
  };

  // Map foil/deboss options to dynamic styles
  const getStyleSettings = () => {
    switch (styleType) {
      case 'Gold Foil':
        return {
          textColor: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent',
          effectStyle: {
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))',
            letterSpacing: '0.15em'
          }
        };
      case 'Silver Foil':
        return {
          textColor: 'bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-transparent',
          effectStyle: {
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))',
            letterSpacing: '0.15em'
          }
        };
      case 'Blind Deboss':
      default:
        return {
          textColor: 'text-zinc-800 dark:text-zinc-950 opacity-75 mix-blend-multiply dark:mix-blend-overlay',
          effectStyle: {
            letterSpacing: '0.15em'
          }
        };
    }
  };

  const { textColor, effectStyle } = getStyleSettings();

  const getFontFamily = () => {
    switch (activeFont) {
      case 'Sans':
        return 'font-sans tracking-widest font-black uppercase';
      case 'Script':
        return 'font-serif italic tracking-wide font-medium';
      case 'Serif':
      default:
        return 'font-serif tracking-widest uppercase font-extrabold';
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 rounded-[32px] p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
        className
      )}
      {...props}
    >
      {/* 3D Mockup Render Screen (Left) */}
      <div className="perspective-1000 w-full flex items-center justify-center min-h-[340px] select-none">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: rX,
            rotateY: rY,
            transformStyle: 'preserve-3d',
          }}
          className={cn(
            "w-full max-w-[280px] aspect-[3/4] rounded-2xl relative overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl origin-center cursor-crosshair"
          )}
        >
          {/* Leather texture base image */}
          <img
            src={productImage}
            alt="Customizable Leather Book"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-[0.8] contrast-[1.15]"
            loading="lazy"
            decoding="async"
          />

          {/* Perspective 3D Engraving Placement Zone */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ transform: 'translateZ(10px)' }}
          >
            {/* The Engraved text layer */}
            <motion.div
              style={{
                textShadow: styleType === 'Blind Deboss'
                  ? `inset 1px 1px 2px rgba(0,0,0,0.8), 1px 1px 1px rgba(255,255,255,0.1)`
                  : `${tsX}px ${tsY}px 2px rgba(0, 0, 0, 0.45)`
              }}
              className="text-center w-full px-2"
            >
              {/* Overlay Label marker */}
              <div className="text-[9px] text-white/40 tracking-[0.3em] uppercase mb-1 font-bold pointer-events-none select-none">
                Handcrafted Custom
              </div>

              {/* Dynamic Engraving output */}
              <div 
                className={cn(
                  "text-lg sm:text-xl transition-all duration-300 font-bold break-all select-none pointer-events-none",
                  textColor,
                  getFontFamily()
                )}
                style={effectStyle}
              >
                {text || "YOUR TEXT"}
              </div>
            </motion.div>
          </div>

          {/* Holographic light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 mix-blend-overlay pointer-events-none" />
        </motion.div>
      </div>

      {/* Engraving Editor Panel (Right) */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Edit3 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Personalize Leather</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed">
            Choose your foil, letter spacing font, and type your custom name or word to see it instantly engraved onto our leather journal.
          </p>
        </div>

        {/* Custom Text Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
            Engraving Inscription ({text.length}/{maxCharacters} Chars)
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={maxCharacters}
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              placeholder="YOUR TEXT"
              className={cn(
                "w-full px-4 py-3.5 rounded-xl text-sm font-semibold tracking-widest",
                "bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100",
                "focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all uppercase"
              )}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Type className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Foil Style Chooser */}
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">
            Engraving Finishing
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(['Gold Foil', 'Silver Foil', 'Blind Deboss'] as EngravingStyle[]).map((st) => {
              const isSelected = styleType === st;
              return (
                <button
                  key={st}
                  onClick={() => setStyleType(st)}
                  className={cn(
                    "py-2.5 px-2 text-xs font-bold rounded-xl border transition-all text-center",
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-black"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Font style */}
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2.5">
            Typography Style
          </span>
          <div className="flex gap-4">
            {(['Serif', 'Sans', 'Script'] as const).map((font) => {
              const isSelected = activeFont === font;
              return (
                <button
                  key={font}
                  onClick={() => setActiveFont(font)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-full transition-all focus:outline-none",
                    isSelected
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                      : "text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full bg-current", isSelected ? "opacity-100" : "opacity-0")} />
                  <span>{font}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save confirmation */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>Engraving will be formatted by master embossers.</span>
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
