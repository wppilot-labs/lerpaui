"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ZoomablePinchImageProps {
  src?: string;
  className?: string;
}

export const ZoomablePinchImage: React.FC<ZoomablePinchImageProps> = ({
  src,
  className,
}) => {
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1);
      x.set(0);
      y.set(0);
    } else {
      setScale(2);
    }
  };

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    if (scale === 1) {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[240px] bg-secondary/5 rounded-2xl border border-border overflow-hidden select-none flex flex-col justify-between p-3', className)}>
      <div 
        ref={containerRef}
        onDoubleClick={handleDoubleTap}
        className="w-full h-full overflow-hidden rounded-xl relative cursor-zoom-in flex items-center justify-center bg-zinc-950"
      >
        <motion.div
          drag={scale > 1}
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          style={{ x: springX, y: springY, scale }}
          onDragEnd={handleDragEnd}
          className="w-full h-full flex items-center justify-center"
        >
          {src ? (
            <img src={src} alt="Zoomable" className="w-full h-full object-cover pointer-events-none select-none" loading="lazy" decoding="async" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-accent/10 flex items-center justify-center p-6 text-muted-foreground/30 pointer-events-none">
              <Maximize2 className="w-12 h-12 stroke-[1.5] animate-pulse" />
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/20 z-10">
        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Double tap image to zoom</span>
        <div className="flex items-center gap-1.5">
          <button 
            disabled={scale <= 1}
            aria-label="Reset zoom"
            onClick={() => { setScale(1); x.set(0); y.set(0); }}
            className="p-1 rounded bg-card border border-border disabled:opacity-40 text-foreground hover:bg-secondary/20 transition-all active:scale-95"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            disabled={scale >= 2.5}
            aria-label="Zoom in"
            onClick={() => setScale(prev => Math.min(2.5, prev + 0.5))}
            className="p-1 rounded bg-card border border-border disabled:opacity-40 text-foreground hover:bg-secondary/20 transition-all active:scale-95"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
