"use client";

import React, { useState, useEffect, useRef } from 'react';

import { Sparkles, Sliders, Droplets } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ProductVolumeCustomizerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  minVolume?: number; // e.g. 100 ml
  maxVolume?: number; // e.g. 1000 ml
  defaultValue?: number;
  step?: number;
  unit?: string; // e.g. "ml", "oz"
  onChange?: (value: number) => void;
  fluidColor?: string; // css gradient or color string
  titleText?: string;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
}

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  speed: number;
}

export const ProductVolumeCustomizer = React.forwardRef<
  HTMLDivElement,
  ProductVolumeCustomizerProps
>(({
  className,
  minVolume = 100,
  maxVolume = 800,
  defaultValue = 450,
  step = 10,
  unit = 'ml',
  onChange,
  fluidColor,
  titleText = 'Liquid Volume Customizer',
  ...props
}, ref) => {
  const [volume, setVolume] = useState(defaultValue);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Refs for programmatic zero-overhead SVG path updates
  const phaseRef = useRef(0);
  const liquidPathRef = useRef<SVGPathElement>(null);

  // Update volume prop if defaultValue changes
  useEffect(() => {
    setVolume(defaultValue);
  }, [defaultValue]);

  // Track dynamic parameters in a Ref to prevent closure stale values
  const paramsRef = useRef({ percent: 0, yPos: 142 });
  useEffect(() => {
    const p = (volume - minVolume) / (maxVolume - minVolume);
    const fillMaxHeight = 110;
    const y = 142 - p * fillMaxHeight;
    paramsRef.current = { percent: p, yPos: y };
  }, [volume, minVolume, maxVolume]);

  // Sine wave slosh loop animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    let id: number;
    const loop = () => {
      phaseRef.current = (phaseRef.current + 0.07) % (Math.PI * 2);
      
      const pathEl = liquidPathRef.current;
      if (pathEl) {
        const { percent: p, yPos: y } = paramsRef.current;
        const waveAmplitude = p > 0.01 && p < 0.99 ? 3.5 : 0;
        const path = `
          M 20 ${y}
          Q 45 ${y + Math.sin(phaseRef.current) * waveAmplitude}, 70 ${y - Math.cos(phaseRef.current) * waveAmplitude}
          T 100 ${y}
          L 100 145
          Q 100 150, 95 150
          L 25 150
          Q 20 150, 20 145
          Z
        `;
        pathEl.setAttribute('d', path);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [prefersReducedMotion]);

  // Rising bubbles loop animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setParticles((prev) => {
        // Filter out bubbles that reached top, and map existing upward
        const updated = prev
          .map((p) => ({ ...p, y: p.y - p.speed }))
          .filter((p) => p.y > 20);

        // Add new bubble
        if (updated.length < 15 && Math.random() > 0.4) {
          updated.push({
            id: Math.random(),
            x: 20 + Math.random() * 80, // within the container width
            y: 130, // bottom of the fill area
            scale: 0.3 + Math.random() * 0.7,
            speed: 0.5 + Math.random() * 1.2,
          });
        }
        return updated;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleScrub = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (clientX - rect.left) / rect.width), 1);
    const rawValue = minVolume + percent * (maxVolume - minVolume);
    const steppedValue = Math.round(rawValue / step) * step;

    setVolume(steppedValue);
    onChange?.(steppedValue);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleScrub(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleScrub(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const percent = (volume - minVolume) / (maxVolume - minVolume);

  // SVG dimensions: width = 120, height = 160
  // Bottle bottom is around 145, top neck starts at 30
  const fillMaxHeight = 110; // total range of fluid height
  const fillHeight = percent * fillMaxHeight;
  const yPos = 142 - fillHeight; // fluid line Y coordinate

  // Sine path calculation for waving liquid
  const waveAmplitude = !prefersReducedMotion && percent > 0.01 && percent < 0.99 ? 3.5 : 0;
  const wavePath = `
    M 20 ${yPos}
    Q 45 ${yPos + Math.sin(phaseRef.current) * waveAmplitude}, 70 ${yPos - Math.cos(phaseRef.current) * waveAmplitude}
    T 100 ${yPos}
    L 100 145
    Q 100 150, 95 150
    L 25 150
    Q 20 150, 20 145
    Z
  `;

  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-sm mx-auto border border-border bg-card rounded-3xl p-5 shadow-lg flex flex-col gap-5 select-none',
        className
      )}
      {...props}
    >
      {/* Title readouts */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
            <Sliders className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-black uppercase text-foreground tracking-wider">
            {titleText}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-secondary px-2.5 py-0.5 rounded-full text-muted-foreground flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-primary" /> Size Customizer
        </span>
      </div>

      {/* Visual Canvas bottle rendering */}
      <div className="flex items-center justify-center py-4 bg-muted/20 border border-dashed border-border/60 rounded-2xl relative overflow-hidden">
        {/* Animated Background blur */}
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent filter blur-xl scale-75" />

        <div className="relative w-[130px] h-[175px]">
          <svg
            viewBox="0 0 120 160"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Liquid Fill Path */}
            <path
              ref={liquidPathRef}
              d={wavePath}
              fill={fluidColor || 'url(#liquidGrad)'}
              className="transition-all duration-300 ease-out"
            />

            {/* Render dynamic floating bubbles */}
            {!prefersReducedMotion &&
              particles.map((p) => {
                // Only render bubble if it is below the current liquid level
                if (p.y > yPos) {
                  return (
                    <circle
                      key={p.id}
                      cx={p.x}
                      cy={p.y}
                      r={2 * p.scale}
                      fill="rgba(255, 255, 255, 0.45)"
                    />
                  );
                }
                return null;
              })}

            {/* Bottle Glass Outline Container */}
            <path
              d="
                M 45 10 
                L 75 10 
                Q 77 10, 77 12 
                L 77 25 
                Q 77 28, 80 30 
                L 98 42 
                Q 102 45, 102 50 
                L 102 145 
                Q 102 152, 95 152 
                L 25 152 
                Q 18 152, 18 145 
                L 18 50 
                Q 18 45, 22 42 
                L 40 30 
                Q 43 28, 43 25 
                L 43 12 
                Q 43 10, 45 10
                Z
              "
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-foreground/80 dark:text-foreground/90"
            />

            {/* Custom Gradients definitions inside SVG */}
            <defs>
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Liquid quantity glass indicator overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            <span className="text-xl font-black text-foreground drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tighter">
              {volume}
              <span className="text-[10px] uppercase font-bold ml-0.5">{unit}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Range Scrubber Track */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
          <span>Min: {minVolume}</span>
          <span>Max: {maxVolume}</span>
        </div>

        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative h-6 w-full bg-secondary border border-border/80 rounded-full cursor-pointer overflow-hidden group touch-none"
        >
          {/* Filled bar track background */}
          <div
            className="absolute inset-y-0 left-0 bg-primary/25 h-full pointer-events-none"
            style={{ width: `${percent * 100}%` }}
          />

          {/* Glowing slide thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md border-2 border-background pointer-events-none transition-all duration-75 group-hover:scale-125"
            style={{ left: `calc(${percent * 100}% - 8px)` }}
          />
        </div>

        {/* Additional instructions readout */}
        <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold mt-1">
          <span>Standard blend size increments</span>
          <span className="flex items-center gap-1 font-bold text-primary">
            <Sparkles className="w-3 h-3" /> Custom size formulation
          </span>
        </div>
      </div>
    </div>
  );
});

ProductVolumeCustomizer.displayName = 'ProductVolumeCustomizer';
