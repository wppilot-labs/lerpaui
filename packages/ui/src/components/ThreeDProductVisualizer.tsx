"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { RotateCw, MoveHorizontal, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ThreeDProductVisualizerProps {
  /** Array of image URLs for the 360 spin. If empty/omitted, renders a high-tech vector mockup */
  images?: string[];
  /** Container class name */
  className?: string;
  /** Number of drag pixels required to rotate to the next frame, default 15 */
  sensitivity?: number;
  /** Title of the product */
  productName?: string;
  /** Subtitle / price tag */
  productPrice?: string;
}

export const ThreeDProductVisualizer: React.FC<ThreeDProductVisualizerProps> = ({
  images = [],
  className,
  sensitivity = 12,
  productName = "Lerpa UI Quantum Watch",
  productPrice = "$299.00",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  
  // Track pointer scrubbing coordinates
  const startX = useRef(0);
  const startFrame = useRef(0);

  const totalFrames = images.length > 0 ? images.length : 12; // 12 angles for fallback vector engine

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasDragged(true);
    startX.current = e.clientX;
    startFrame.current = frameIndex;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    
    // Calculate new frame offset
    const frameOffset = Math.floor(deltaX / sensitivity);
    
    // Wrap frame index around [0, totalFrames - 1]
    let newFrame = (startFrame.current - frameOffset) % totalFrames;
    if (newFrame < 0) {
      newFrame += totalFrames;
    }
    
    setFrameIndex(newFrame);
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Preload images if provided
  useEffect(() => {
    if (images.length > 0) {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  // Fallback High-Fidelity Vector Watch Engine:
  // Render an SVG representing the watch at 12 distinct rotation angles (0 to 11).
  const renderVectorMockup = (frame: number) => {
    // Math coordinates representing angle of rotation
    const angleRad = (frame / 12) * Math.PI * 2;
    const cosAngle = Math.cos(angleRad); // left-right displacement (-1 to 1)
    const _sinAngle = Math.sin(angleRad); // depth scale (z-axis feeling)

    // Elements displacements
    const _watchFaceWidth = 140;
    const dialOffset = cosAngle * 45; // shifts watch screen details
    const watchGlassReflectionX = -cosAngle * 25;
    
    // Watch crown button position (typically at 3 o'clock / right side)
    const crownVisible = cosAngle > 0;
    const crownX = 200 + (cosAngle * 82);
    const crownWidth = 12 * Math.abs(cosAngle);
    
    // Strap horizontal squeeze based on rotation angle
    const strapWidth = 80;
    const leftStrapOffset = -30 * cosAngle;

    return (
      <svg viewBox="0 0 400 400" className="w-full h-full select-none" fill="none">
        <defs>
          <radialGradient id="watch-body-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d2d30" />
            <stop offset="70%" stopColor="#1e1e24" />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>
          <linearGradient id="strap-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="50%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <linearGradient id="gold-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* 3D Floor Grid Shadows */}
        <ellipse cx="200" cy="330" rx="110" ry="18" fill="rgba(0,0,0,0.5)" filter="blur(10px)" />
        <ellipse cx="200" cy="330" rx="80" ry="8" fill="rgba(6,182,212,0.15)" filter="blur(6px)" />

        {/* Watch Straps (Upper and Lower) */}
        {/* Shifting and squeezing dynamically simulates standard 3D depth */}
        <path
          d={`M ${200 - strapWidth/2 + leftStrapOffset} 50 L ${200 + strapWidth/2 + leftStrapOffset} 50 L ${200 + (strapWidth - 10)/2 * cosAngle} 125 L ${200 - (strapWidth - 10)/2 * cosAngle} 125 Z`}
          fill="url(#strap-grad)"
          stroke="#3f3f46"
          strokeWidth="1.5"
          opacity={0.9}
        />
        <path
          d={`M ${200 - (strapWidth - 10)/2 * cosAngle} 275 L ${200 + (strapWidth - 10)/2 * cosAngle} 275 L ${200 + strapWidth/2 + leftStrapOffset} 350 L ${200 - strapWidth/2 + leftStrapOffset} 350 Z`}
          fill="url(#strap-grad)"
          stroke="#3f3f46"
          strokeWidth="1.5"
          opacity={0.9}
        />

        {/* Metallic Bezel Case Holder */}
        {/* Thickness scales by absolute value of cosine to represent actual cylinder casing */}
        <ellipse 
          cx="200" 
          cy="200" 
          rx={86 * Math.abs(cosAngle) + 4} 
          ry="86" 
          fill="url(#watch-body-grad)" 
          stroke="#52525b" 
          strokeWidth="2" 
        />

        {/* Watch Crown Adjuster */}
        {crownVisible && (
          <rect
            x={crownX - crownWidth/2}
            y="185"
            width={crownWidth}
            height="30"
            rx="2"
            fill="url(#gold-accent)"
            stroke="#b45309"
            strokeWidth="1"
          />
        )}

        {/* Outer Ring Accent */}
        <ellipse 
          cx="200" 
          cy="200" 
          rx={80 * Math.abs(cosAngle)} 
          ry="80" 
          fill="#18181b" 
          stroke="url(#gold-accent)" 
          strokeWidth="1.5" 
        />

        {/* High-Tech Digital Dial screen */}
        <ellipse 
          cx="200" 
          cy="200" 
          rx={72 * Math.abs(cosAngle)} 
          ry="72" 
          fill="#09090b" 
        />

        {/* Screen Graphics (Neon telemetry circles, time stamps shifting in 3D perspective) */}
        {Math.abs(cosAngle) > 0.2 && (
          <g style={{ opacity: Math.abs(cosAngle) }}>
            {/* Pulsing Core Dial details */}
            <ellipse 
              cx={200 + dialOffset * 0.4} 
              cy="200" 
              rx={52 * Math.abs(cosAngle)} 
              ry="52" 
              stroke="rgba(6, 182, 212, 0.2)" 
              strokeWidth="1" 
              strokeDasharray="4 2"
            />
            <ellipse 
              cx={200 + dialOffset * 0.4} 
              cy="200" 
              rx={36 * Math.abs(cosAngle)} 
              ry="36" 
              stroke="rgba(16, 185, 129, 0.4)" 
              strokeWidth="2" 
              strokeDasharray="40 10"
            />

            {/* Glowing Sensor Center Dot */}
            <circle 
              cx={200 + dialOffset * 0.4} 
              cy="200" 
              r="4" 
              fill="#10b981" 
              className="animate-ping"
              style={{ animationDuration: '3s' }} 
            />

            {/* Dynamic UI time stamps and metrics shifting */}
            <text 
              x={200 + dialOffset * 0.6} 
              y="185" 
              fill="#06b6d4" 
              fontSize="11" 
              fontWeight="bold" 
              fontFamily="monospace"
              textAnchor="middle"
              transform={`scale(${cosAngle}, 1) translate(${(200 * (1 - cosAngle)) / cosAngle}, 0)`}
            >
              10:45
            </text>
            <text 
              x={200 + dialOffset * 0.6} 
              y="225" 
              fill="#a1a1aa" 
              fontSize="9" 
              fontFamily="monospace"
              textAnchor="middle"
              transform={`scale(${cosAngle}, 1) translate(${(200 * (1 - cosAngle)) / cosAngle}, 0)`}
            >
              78 BPM
            </text>
          </g>
        )}

        {/* Dynamic Curved Glass Refraction Sheen */}
        {Math.abs(cosAngle) > 0.1 && (
          <path
            d={`M ${200 + watchGlassReflectionX - 45 * Math.abs(cosAngle)} 150 A ${60 * Math.abs(cosAngle)} 60 0 0 1 ${200 + watchGlassReflectionX + 45 * Math.abs(cosAngle)} 150 A ${60 * Math.abs(cosAngle)} 65 0 0 0 ${200 + watchGlassReflectionX - 45 * Math.abs(cosAngle)} 150 Z`}
            fill="rgba(255,255,255,0.12)"
            pointerEvents="none"
          />
        )}
      </svg>
    );
  };

  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center p-6 border border-border bg-card/40 backdrop-blur-md rounded-3xl relative overflow-hidden select-none",
      className
    )}>
      {/* Dynamic Header Product Information Details */}
      <div className="w-full flex justify-between items-start mb-4 select-none">
        <div className="text-left select-none">
          <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3 h-3" />
            Interactive 360° View
          </span>
          <h3 className="text-lg font-extrabold text-foreground tracking-tight mt-1 select-none">
            {productName}
          </h3>
        </div>
        <div className="text-right select-none">
          <span className="text-lg font-bold font-mono text-primary select-none">
            {productPrice}
          </span>
          <p className="text-xxs text-muted-foreground mt-0.5 select-none">Free Shipping</p>
        </div>
      </div>

      {/* Rotation Visualizer viewport frame */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full max-w-sm aspect-square bg-zinc-950/20 dark:bg-black/35 rounded-2xl border border-border/80 flex items-center justify-center cursor-grab relative overflow-hidden select-none touch-none"
        style={{ touchAction: 'none' }} // Absolute scroll lock for horizontal swipes
      >
        
        {/* Loop Frame Display */}
        <div className="w-4/5 h-4/5 flex items-center justify-center select-none pointer-events-none">
          {images.length > 0 ? (
            <img
              src={images[frameIndex]}
              alt={`${productName} frame ${frameIndex}`}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          ) : (
            renderVectorMockup(frameIndex)
          )}
        </div>

        {/* Loading Overlay Helpers */}
        <AnimatePresence>
          {!hasDragged && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4 pointer-events-none select-none"
            >
              <div className="p-3 bg-primary/25 border border-primary/40 rounded-full animate-bounce">
                <MoveHorizontal className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white tracking-tight">Drag to Rotate 360°</p>
                <p className="text-xxs text-zinc-400 mt-1">Scrub horizontally to inspect dimensions</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag indicators */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-xxs font-mono font-semibold text-zinc-300 pointer-events-none select-none">
          <RotateCw className={cn("w-3 h-3 text-emerald-400", isDragging && "animate-spin")} />
          <span>Frame: {frameIndex + 1}/{totalFrames}</span>
        </div>
      </div>

      {/* Frame Step Track Bar Indicator slider */}
      <div className="w-full max-w-sm mt-6 flex items-center justify-between gap-4 select-none">
        <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">0° View</span>
        
        <div className="flex-1 h-1 bg-secondary rounded-full relative overflow-hidden select-none">
          <div 
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${((frameIndex + 1) / totalFrames) * 100}%` }}
          />
        </div>

        <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">360° View</span>
      </div>
    </div>
  );
};
