"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "../lib/cn";

interface Flight {
  id: number;
  x: number;
  y: number;
}

export interface WishlistHeartFlyToCartProps {
  className?: string;
}

export function WishlistHeartFlyToCart({ className }: WishlistHeartFlyToCartProps) {
  const [count, setCount] = useState(2);
  const [flights, setFlights] = useState<Flight[]>([]);
  const flightId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const captured = timers.current;
    return () => {
      captured.forEach(clearTimeout);
      captured.clear();
    };
  }, []);

  const launch = () => {
    if (!containerRef.current || !heartRef.current || !cartRef.current) return;
    const c = containerRef.current.getBoundingClientRect();
    const h = heartRef.current.getBoundingClientRect();
    const t = cartRef.current.getBoundingClientRect();
    const start = { x: h.left - c.left + h.width / 2, y: h.top - c.top + h.height / 2 };
    const end = { x: t.left - c.left + t.width / 2, y: t.top - c.top + t.height / 2 };
    const id = ++flightId.current;
    setFlights((f) => [...f, { id, x: end.x - start.x, y: end.y - start.y }]);
    const timer = setTimeout(() => {
      setFlights((f) => f.filter((fl) => fl.id !== id));
      setCount((n) => n + 1);
      timers.current.delete(timer);
    }, 750);
    timers.current.add(timer);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none overflow-hidden",
        className
      )}
      role="region"
      aria-label="Wishlist heart fly to cart"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">WISHLIST_FLY_TO_CART</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Heart icon morphs into cart badge</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative rounded-xl border border-edge bg-bg-3 overflow-hidden w-28 h-28 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-rose-500/20 to-amber-500/30" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[10px] font-mono font-bold text-white/80 px-2 py-0.5 rounded-md bg-bg/60 backdrop-blur-sm">
              $124
            </span>
          </div>
          <button
            ref={heartRef}
            type="button"
            onClick={launch}
            aria-label="Add to wishlist and cart"
            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-bg/70 text-rose-400 hover:text-rose-300 hover:scale-110 transition-transform"
          >
            <Heart className="w-4 h-4" fill="currentColor" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text">Vault Suede Pouch</p>
          <p className="text-[10px] text-text-3 font-mono mt-0.5">Cognac · One size</p>
          <button
            type="button"
            onClick={launch}
            className="mt-3 px-3 py-1.5 rounded-lg bg-accent-soft text-accent text-[11px] font-bold uppercase tracking-wider hover:bg-accent hover:text-bg transition-colors"
          >
            Fly to cart
          </button>
        </div>

        <div ref={cartRef} className="relative">
          <ShoppingBag className="w-7 h-7 text-text-2" aria-hidden="true" />
          <motion.span
            key={count}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-accent text-bg text-[10px] font-bold font-mono"
            aria-live="polite"
          >
            {count}
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {flights.map((fl) => {
          const heart = heartRef.current;
          const container = containerRef.current;
          if (!heart || !container) return null;
          const h = heart.getBoundingClientRect();
          const c = container.getBoundingClientRect();
          const startX = h.left - c.left + h.width / 2 - 10;
          const startY = h.top - c.top + h.height / 2 - 10;
          return (
            <motion.span
              key={fl.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.4],
                x: [0, fl.x * 0.6, fl.x],
                y: [0, fl.y - 80, fl.y],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.42, 0, 0.58, 1], times: [0, 0.6, 1] }}
              style={{ left: startX, top: startY }}
              className="absolute pointer-events-none text-rose-400 drop-shadow-[0_0_8px_rgba(255,61,119,0.6)]"
              aria-hidden="true"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </motion.span>
          );
        })}
      </AnimatePresence>

      <p className="text-[9px] text-text-4 font-mono">
        Total wishlisted today: <span className="text-accent">{count}</span>
      </p>
    </div>
  );
}
