"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { RefreshCw, ArrowDown } from 'lucide-react';

export interface PullToRefreshLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh: () => Promise<void>;
  pullThreshold?: number;
  maxPullDistance?: number;
  children: React.ReactNode;
}

export const PullToRefreshLoader: React.FC<PullToRefreshLoaderProps> = ({
  onRefresh,
  pullThreshold = 80,
  maxPullDistance = 150,
  children,
  className,
  ...props
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isAtTopRef = useRef(true);

  // Keep track of scroll position to ensure we only pull when we're at the top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isAtTopRef.current = e.currentTarget.scrollTop === 0;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isAtTopRef.current || isRefreshing) return;
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || isRefreshing) return;
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (deltaY > 0) {
      // Prevent browser default scroll/bounce
      if (e.cancelable) e.preventDefault();
      
      // Apply exponential/logarithmic friction so dragging gets stiffer
      const dragResistance = 0.55;
      const pull = Math.min(deltaY * dragResistance, maxPullDistance);
      setPullDistance(pull);
    }
  };

  const handleTouchEnd = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (pullDistance >= pullThreshold) {
      // Trigger refresh
      setIsRefreshing(true);
      setPullDistance(pullThreshold); // snap to loader height
      try {
        await onRefresh();
      } catch (err) {
        if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Refresh failed:', err);
        }
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Rebound
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Attach non-passive listeners so we can call preventDefault
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: touch handlers captured at mount, re-bind on state change
  }, [pullDistance, isDragging, isRefreshing]);

  // Compute scale and rotation dynamically based on pull distance ratio
  const ratio = Math.min(pullDistance / pullThreshold, 1);
  const rotateDeg = ratio * 360;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('relative w-full h-full overflow-y-auto scroll-smooth', className)}
      {...props}
    >
      {/* Pull down interactive indicator panel */}
      <div
        style={{ height: `${pullDistance}px` }}
        className="pointer-events-none relative left-0 right-0 top-0 z-30 flex items-center justify-center overflow-hidden bg-muted/20 border-b border-border/30 transition-all duration-75 ease-out"
      >
        <AnimatePresence>
          {pullDistance > 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              {/* Elastic morphological circle spinner */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-md">
                {isRefreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: 'linear',
                    }}
                  >
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div style={{ rotate: rotateDeg }}>
                    <ArrowDown
                      className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        ratio >= 1 ? 'text-accent font-bold scale-110' : 'text-muted-foreground'
                      )}
                    />
                  </motion.div>
                )}

                {/* SVG droplet stretching behind */}
                {!isRefreshing && ratio > 0.1 && (
                  <svg className="absolute inset-x-0 -bottom-6 -z-10 h-10 w-10 text-background fill-current drop-shadow-sm">
                    <path
                      d={`M 10 0 C 10 ${25 * ratio}, 30 ${25 * ratio}, 30 0 Z`}
                    />
                  </svg>
                )}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {isRefreshing
                  ? 'Refreshing...'
                  : ratio >= 1
                  ? 'Release to Refresh'
                  : 'Pull down to refresh'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main child viewport content */}
      <motion.div
        animate={{
          y: isDragging || isRefreshing ? pullDistance * 0.15 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
