'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DissolveSlide {
  title: string;
  tag: string;
  /** Tailwind text + background + border classes for the slide panel. */
  color: string;
}

export interface DissolveSlideSwitcherPanelProps {
  className?: string;
  /** Slides to switch between. */
  slides?: DissolveSlide[];
  /** Header label. */
  label?: string;
}

const DEFAULT_SLIDES: DissolveSlide[] = [
  { title: "Compute Layer", tag: "Core", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  { title: "Vector Matrix", tag: "Database", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { title: "Event Ledger", tag: "Gateway", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

export const DissolveSlideSwitcherPanel: React.FC<DissolveSlideSwitcherPanelProps> = ({
  className,
  slides = DEFAULT_SLIDES,
  label = "Canvas Stardust Dissolve",
}) => {
  const [slide, setSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const shiftSlide = (dir: 'prev' | 'next') => {
    const next = dir === 'prev' ? slide - 1 : slide + 1;
    if (next >= 0 && next < slides.length) {
      setSlide(next);
      triggerDissolve();
    }
  };

  const triggerDissolve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let _animFrame: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];

    // Spawn stardust particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 1,
        alpha: 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.beginPath();
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (particles.length > 0) {
        _animFrame = requestAnimationFrame(render);
      }
    };

    render();
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={slide === 0}
            onClick={() => shiftSlide('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={slide === slides.length - 1}
            onClick={() => shiftSlide('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center z-0">
        <canvas ref={canvasRef} width="240" height="150" className="absolute w-full h-full pointer-events-none z-10" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className={cn('w-[240px] h-[140px] border rounded-2xl p-4 flex flex-col justify-between bg-card z-0', slides[slide].color)}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{slides[slide].tag}</span>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide text-foreground">{slides[slide].title}</h4>
              <p className="text-[9px] text-muted-foreground font-medium leading-relaxed mt-1">Transitions trigger physical stardust canvas particles flowing across slide depths.</p>
            </div>
            <div className="w-full flex justify-end">
              <span className="text-[8px] font-mono text-muted-foreground/60 font-bold">SLIDE 0{slide + 1}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click arrows to trigger dissolve particles</span>
    </div>
  );
};
