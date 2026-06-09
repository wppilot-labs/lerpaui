"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Flame, Eye, ShoppingCart, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LiveStockCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStock?: number;
  lowStockThreshold?: number;
  criticalStockThreshold?: number;
  minRandomInterval?: number; // ms to wait before decrementing stock
  maxRandomInterval?: number;
  simulated?: boolean;
  onStockEmpty?: () => void;
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

export const LiveStockCounter = React.forwardRef<
  HTMLDivElement,
  LiveStockCounterProps
>(({
  className,
  initialStock = 18,
  lowStockThreshold = 10,
  criticalStockThreshold = 4,
  minRandomInterval = 6000,
  maxRandomInterval = 15000,
  simulated = true,
  onStockEmpty,
  ...props
}, ref) => {
  const [stock, setStock] = useState(initialStock);
  const [liveViewers, setLiveViewers] = useState(12);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Periodic stock decrement logic simulating sales
  useEffect(() => {
    if (!simulated || stock <= 0) return;

    const triggerNextDecrement = () => {
      const delay = Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
      timerRef.current = setTimeout(() => {
        setStock((prevStock) => {
          if (prevStock <= 1) {
            onStockEmpty?.();
            return 0;
          }
          // Decrement stock by 1, or occasionally bump it up when stock "reserves are released"
          const shouldRestock = Math.random() > 0.88 && prevStock < initialStock;
          const delta = shouldRestock ? 2 : -1;
          const nextStock = Math.max(0, prevStock + delta);

          if (nextStock === 0) {
            onStockEmpty?.();
          }
          return nextStock;
        });

        // Update viewer count dynamically as well
        setLiveViewers((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          return Math.max(3, prev + delta);
        });

        triggerNextDecrement();
      }, delay);
    };

    triggerNextDecrement();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [simulated, minRandomInterval, maxRandomInterval, stock, initialStock, onStockEmpty]);

  // Determine stock severity levels
  const getStockSeverity = () => {
    if (stock <= 0) return 'soldout';
    if (stock < criticalStockThreshold) return 'critical';
    if (stock <= lowStockThreshold) return 'low';
    return 'good';
  };

  const severity = getStockSeverity();

  // Style configurations based on stock severity
  const severityStyles = {
    soldout: {
      text: 'text-muted-foreground',
      bg: 'bg-muted/40',
      border: 'border-border/60',
      badge: 'bg-muted-foreground/15 text-muted-foreground',
      progress: 'bg-muted-foreground/30',
      message: 'Out of Stock. Join the waitlist for updates.',
    },
    critical: {
      text: 'text-destructive font-black',
      bg: 'bg-destructive/10 animate-pulse-slow',
      border: 'border-destructive/30',
      badge: 'bg-destructive/20 text-destructive border border-destructive/20',
      progress: 'bg-destructive',
      message: 'Almost gone! Selling out extremely fast.',
    },
    low: {
      text: 'text-amber-600 dark:text-amber-500 font-extrabold',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      progress: 'bg-amber-500',
      message: 'Limited quantity available. Grab yours now!',
    },
    good: {
      text: 'text-emerald-600 dark:text-emerald-400 font-bold',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      progress: 'bg-emerald-500',
      message: 'Item in stock. Ships within 24 hours.',
    },
  };

  const currentStyle = severityStyles[severity];

  const handleRestockDemo = () => {
    setStock(initialStock);
    setLiveViewers(15);
  };

  // Split digits of the stock count to apply scaling animations to individual numbers
  const digits = stock.toString().split('');

  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-sm rounded-2xl border p-4.5 bg-card text-card-foreground shadow-sm flex flex-col gap-4 transition-all duration-300',
        currentStyle.border,
        severity === 'critical' && 'shadow-md shadow-destructive/5',
        className
      )}
      {...props}
    >
      {/* Top Ticker Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {severity === 'critical' ? (
            <Flame className="w-5 h-5 text-destructive animate-bounce" />
          ) : (
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Availability Status
          </span>
        </div>

        {/* Live Viewer counter with pulsing active radar */}
        {stock > 0 && (
          <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-full text-[10px] font-bold text-muted-foreground shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Eye className="w-3 h-3 text-muted-foreground/80" />
            <span>{liveViewers} viewing now</span>
          </div>
        )}
      </div>

      {/* Main Stock display */}
      <div className={cn('flex items-center gap-3 p-3.5 rounded-xl transition-colors duration-300', currentStyle.bg)}>
        {/* Animated Digits counter */}
        <div className="flex items-center overflow-hidden h-10 select-none">
          <AnimatePresence mode="popLayout">
            {digits.map((digit, idx) => (
              <motion.span
                key={`${idx}-${digit}`}
                initial={prefersReducedMotion ? {} : { y: 25, opacity: 0, scale: 0.8 }}
                animate={prefersReducedMotion ? {} : { y: 0, opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? {} : { y: -25, opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 18,
                }}
                className={cn('text-3xl font-black tabular-nums tracking-tighter inline-block', currentStyle.text)}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>

          {stock > 0 && (
            <span className={cn('text-xs font-black uppercase tracking-wider ml-2 px-2 py-0.5 rounded-md shadow-sm', currentStyle.badge)}>
              LEFT
            </span>
          )}
        </div>

        {/* Informative text message */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-foreground truncate leading-snug">
            {stock > 0 ? `${stock} units remaining` : 'SOLD OUT!'}
          </p>
          <p className="text-[10px] text-muted-foreground line-clamp-1 leading-normal font-semibold">
            {currentStyle.message}
          </p>
        </div>
      </div>

      {/* Modern thin stock percentage bar */}
      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${Math.min(100, (stock / initialStock) * 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full transition-all duration-300', currentStyle.progress)}
        />
      </div>

      {/* Demo helper toolbars (Hidden or toggleable) */}
      {simulated && (
        <div className="flex justify-between items-center border-t border-border/50 pt-2.5 mt-1">
          <span className="text-[9px] text-muted-foreground font-semibold">
            Real-time fluctuation active
          </span>
          <button
            type="button"
            onClick={handleRestockDemo}
            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors"
            title="Reset Stock for Demo"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Restock Demo</span>
          </button>
        </div>
      )}
    </div>
  );
});

LiveStockCounter.displayName = 'LiveStockCounter';
