"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductStickyAddToCartBarProps {
  className?: string;
  productName?: string;
  price?: number;
  rating?: number;
  image?: string;
}

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";

export function ProductStickyAddToCartBar({
  className,
  productName = "Aurora Studio Headphones",
  price = 248.0,
  rating = 4.8,
  image = DEFAULT_IMG,
}: ProductStickyAddToCartBarProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-sm bg-card/45 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl select-none overflow-hidden text-foreground",
        className,
      )}
    >
      <div className="p-4 flex flex-col gap-2 border-b border-white/5">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">
            STICKY_BUY_BAR
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            Scroll inside frame to reveal
          </span>
        </div>
      </div>

      <div className="relative h-56 overflow-y-auto px-4 py-3 text-[11px] text-white/60 leading-relaxed scroll-smooth">
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        <h3 className="text-sm font-extrabold text-foreground mb-2">
          {productName}
        </h3>
        <p className="mb-2">
          Studio-grade transducers tuned for reference mixing. Memory-foam
          earcups, USB-C and 3.5mm dual-mode I/O.
        </p>
        <p className="mb-2">
          The chassis is milled from a single block of 6063 aluminium, finished
          with a hand-brushed matte oxide that resists fingerprints.
        </p>
        <p className="mb-2">
          Adaptive ANC reads room noise 240 times per second and tunes the
          inverse signal in under 4 ms.
        </p>
        <p className="mb-2">
          Ships with hardshell case, 1.4 m balanced cable, 3 m studio cable, and
          a 6.35 mm adapter.
        </p>
        <p className="text-white/40">
          Keep scrolling to summon the buy bar from below.
        </p>
      </div>

      <AnimatePresence>
        {pinned && (
          <motion.div
            initial={{ y: 56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 56, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-bg-2/95 backdrop-blur-xl border-t border-white/10 px-3 py-2.5 flex items-center gap-2"
            role="region"
            aria-label="Add to cart bar"
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-extrabold truncate">
                {productName}
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
                <span className="flex items-center gap-0.5 text-amber">
                  <Star className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
                  {rating.toFixed(1)}
                </span>
                <span className="text-primary font-bold">
                  ${(price * qty).toFixed(2)}
                </span>
              </div>
            </div>
            <div
              className="flex items-center bg-white/5 rounded-lg border border-white/10"
              role="group"
              aria-label="Quantity"
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-6 h-7 grid place-items-center text-white/70 hover:text-foreground"
              >
                <Minus className="w-3 h-3" aria-hidden="true" />
              </button>
              <span className="w-5 text-center text-[11px] font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Increase quantity"
                className="w-6 h-7 grid place-items-center text-white/70 hover:text-foreground"
              >
                <Plus className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              aria-label={`Add ${qty} ${productName} to cart`}
              className="h-8 px-3 rounded-lg bg-primary text-bg text-[11px] font-extrabold flex items-center gap-1 shadow-lg shadow-primary/20 hover:brightness-110 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
