"use client";

import React, { useState } from "react";
import { Star, Heart, ShoppingBag, Truck } from "lucide-react";
import { cn } from "../lib/cn";

export interface EcommerceProductCardRowProps {
  className?: string;
}

export function EcommerceProductCardRow({ className }: EcommerceProductCardRowProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className={cn("w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex gap-4">
        <div className="relative h-36 w-36 shrink-0 rounded-xl bg-gradient-to-br from-indigo-400/30 to-violet-500/20 border border-foreground/[0.05] overflow-hidden">
          <span className="absolute left-2 top-2 text-[11px] font-bold uppercase bg-emerald-500/90 text-white px-1.5 py-0.5 rounded">New</span>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/55 font-semibold">Halcyon Audio</div>
              <h3 className="text-base font-bold truncate">Drift Wireless Headphones</h3>
            </div>
            <button
              type="button"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={liked}
              onClick={() => setLiked((v) => !v)}
              className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Heart className={cn("w-4 h-4", liked && "fill-red-400 text-red-400")} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="inline-flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("w-3.5 h-3.5", i < 4 ? "fill-amber-400" : "fill-none text-muted-foreground/30")} />
              ))}
            </span>
            <span className="text-muted-foreground/50">4.0 · 326 reviews</span>
          </div>

          <p className="text-xs text-muted-foreground/65 mt-1.5 line-clamp-2">
            40h battery, active noise cancellation, and plush memory-foam ear cups for all-day comfort.
          </p>

          <div className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-400">
            <Truck className="w-3.5 h-3.5" /> Free 2-day shipping
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">$179</span>
              <span className="text-xs text-muted-foreground/45 line-through">$229</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 bg-primary text-primary-foreground hover:brightness-110 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Add to bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
