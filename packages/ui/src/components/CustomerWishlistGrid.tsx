"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingCart, Star } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Product = { id: number; name: string; brand: string; price: string; rating: number };

const INITIAL: Product[] = [
  { id: 1, name: "Aero Running Shoes", brand: "Strider", price: "$129", rating: 4.8 },
  { id: 2, name: "Merino Wool Beanie", brand: "Northpeak", price: "$34", rating: 4.6 },
  { id: 3, name: "Insulated Bottle 1L", brand: "Hydra", price: "$28", rating: 4.9 },
  { id: 4, name: "Trail Daypack 22L", brand: "Summit", price: "$89", rating: 4.7 },
];

export interface CustomerWishlistGridProps {
  className?: string;
}

export function CustomerWishlistGrid({ className }: CustomerWishlistGridProps) {
  const [items, setItems] = useState<Product[]>(INITIAL);
  const reduced = usePrefersReducedMotion();

  const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        <h3 className="text-base font-bold">Your wishlist</h3>
        <span className="ml-auto text-xs text-muted-foreground/55 tabular-nums">{items.length} items</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.div
              key={p.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              className="relative rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-3 hover:border-foreground/[0.1] transition-colors"
            >
              <button
                type="button"
                aria-label={`Remove ${p.name} from wishlist`}
                onClick={() => remove(p.id)}
                className="absolute right-2 top-2 p-1.5 rounded-full bg-muted text-muted-foreground/60 hover:text-rose-400 hover:bg-muted/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="aspect-square rounded-lg bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.01] mb-2.5 flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-muted-foreground/25" />
              </div>

              <div className="text-[11px] uppercase tracking-wide text-muted-foreground/45 font-bold">{p.brand}</div>
              <div className="text-sm font-semibold leading-tight">{p.name}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-bold tabular-nums">{p.price}</span>
                <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 dark:text-amber-400">
                  <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
                  {p.rating}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground/50 py-8">Your wishlist is empty.</p>
      )}
    </div>
  );
}
