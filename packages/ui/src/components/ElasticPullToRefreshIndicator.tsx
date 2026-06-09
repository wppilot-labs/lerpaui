"use client";

import React, { useState } from 'react';
import {motion, useAnimation, useReducedMotion, type PanInfo } from "framer-motion";
import { RefreshCw, ArrowDown, HelpCircle } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ElasticPullToRefreshIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => Promise<void>;
  title?: string;
  subtitle?: string;
}

export const ElasticPullToRefreshIndicator: React.FC<ElasticPullToRefreshIndicatorProps> = ({
  onRefresh,
  title = "Tactile Elastic Scroll",
  subtitle = "Drag the content container downwards to observe the viscous liquid SVG bridge stretch, narrow, snap, and trigger updates.",
  className,
  ...props
}) => {
  const [dragY, setDragY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  const threshold = 100;
  const maxDrag = 150;

  // Handle drag updates
  const handleDrag = (_: unknown, info: PanInfo) => {
    if (isRefreshing) return;
    
    // Viscous friction mapping: more pull = more resistance
    const currentY = Math.max(0, info.offset.y);
    const viscousY = currentY < 60 
      ? currentY 
      : 60 + (currentY - 60) * 0.55; // dampening multiplier
    
    const limitedY = Math.min(maxDrag, viscousY);
    setDragY(limitedY);
    
    if (limitedY >= threshold && !hasSnapped) {
      setHasSnapped(true);
    } else if (limitedY < threshold && hasSnapped) {
      setHasSnapped(false);
    }
  };

  // Handle drag release
  const handleDragEnd = async () => {
    if (isRefreshing) return;

    if (dragY >= threshold) {
      // Snapped into refreshing state
      setIsRefreshing(true);
      setDragY(60); // lock loader offset height
      
      const mockRefresh = onRefresh 
        ? onRefresh() 
        : new Promise<void>((resolve) => setTimeout(resolve, 2000));
        
      try {
        await mockRefresh;
      } finally {
        setIsRefreshing(false);
        setHasSnapped(false);
        setDragY(0);
        controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      }
    } else {
      // Recoil without refreshing
      setDragY(0);
      setHasSnapped(false);
      controls.start({ y: 0, transition: { type: "spring", stiffness: 350, damping: 18 } });
    }
  };

  // Compute SVG parameters for viscous liquid bridge
  const computeLiquidPath = () => {
    if (hasSnapped || isRefreshing) return "";
    
    const y = dragY;
    const blobRadius = Math.max(8, 16 - y * 0.08); // shrinks as it drops
    const startX = 35;
    const endX = 65;
    const centerX = 50;
    
    // Quadratic bezier curve connecting top anchors (35,0) & (65,0) to dropping circle sides
    return `
      M ${startX} 0 
      Q ${startX + y * 0.05} ${y * 0.5} ${centerX - blobRadius} ${y} 
      A ${blobRadius} ${blobRadius} 0 1 0 ${centerX + blobRadius} ${y} 
      Q ${endX - y * 0.05} ${y * 0.5} ${endX} 0 
      Z
    `;
  };

  return (
    <div
      className={cn(
        "w-full bg-background text-foreground py-12 px-4 max-w-xl mx-auto overflow-hidden relative select-none",
        className
      )}
      {...props}
    >
      {/* Elastic Visual Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-2">
          <RefreshCw className="w-3 h-3" />
          <span>Interactive SVG Canvas</span>
        </span>
        <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">{subtitle}</p>
      </div>

      {/* Viscous Canvas Area */}
      <div className="relative border border-border/60 bg-muted/20 rounded-2xl p-6 min-h-[360px] overflow-hidden flex flex-col justify-center items-center">
        
        {/* Animated pulling header overlay containing SVG */}
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center pointer-events-none"
          style={{ height: `${maxDrag}px` }}
        >
          {/* Elastic SVG Loop canvas */}
          <svg className="w-40 h-full overflow-visible" viewBox="0 0 100 150">
            {/* Horizontal ceiling bar */}
            <line x1="20" y1="0" x2="80" y2="0" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/35" />

            {/* Elastic Viscous connection */}
            {!isRefreshing && !hasSnapped && dragY > 0 && (
              <path
                d={computeLiquidPath()}
                className="fill-primary stroke-primary"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            )}

            {/* Snapped isolated droplet falling loader */}
            {hasSnapped && !isRefreshing && (
              <circle
                cx="50"
                cy={dragY}
                r="8"
                className="fill-primary"
              />
            )}
          </svg>

          {/* Glowing loader floating spinner */}
          {isRefreshing && (
            <motion.div
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute w-8 h-8 rounded-full border-2 border-primary border-t-transparent flex items-center justify-center shadow bg-card mt-8"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
            </motion.div>
          )}

          {/* Pull indicators labels */}
          {!isRefreshing && dragY > 15 && (
            <div 
              className="absolute text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1 bg-card border border-border/40 px-2 py-0.5 rounded shadow-sm transition-all"
              style={{ top: `${dragY + 28}px` }}
            >
              {dragY >= threshold ? (
                <span className="text-primary animate-pulse">Release to Snap</span>
              ) : (
                <>
                  <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
                  <span>Pull {Math.round((dragY / threshold) * 100)}%</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Viscous Draggable Panel */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: maxDrag }}
          dragElastic={{ top: 0.02, bottom: 0.45 }}
          animate={controls}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ y: dragY }}
          className="w-full bg-card/90 backdrop-blur border border-border/80 rounded-xl p-5 shadow-md cursor-grab active:cursor-grabbing text-center z-20 space-y-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
          </div>
          
          <div>
            <h4 className="text-xs font-black text-foreground">Content Database Panel</h4>
            <p className="text-[10px] text-muted-foreground/80 mt-1">This panel contains live responsive fields that refresh when the elastic spring snaps.</p>
          </div>

          <div className="bg-muted/40 border border-border/30 rounded-lg p-3 text-[10px] font-mono text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hydration Status:</span>
              <span className="text-emerald-500 font-bold">SSR SECURE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquid tension:</span>
              <span className="text-foreground font-bold">{Math.round(dragY)} Pascal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Sync:</span>
              <span className="text-foreground font-bold">{isRefreshing ? "SYNCING..." : "COMPLETED"}</span>
            </div>
          </div>
          
          <div className="text-[9px] text-muted-foreground/60 flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Drag down this card with mouse/touch</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

