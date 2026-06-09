"use client";

import React, { useState } from "react";
import { Star, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { cn } from "../lib/cn";

export interface EcommerceProductDetailBasicProps {
  className?: string;
}

export function EcommerceProductDetailBasic({ className }: EcommerceProductDetailBasicProps) {
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="aspect-square rounded-xl bg-gradient-to-br from-teal-400/30 to-cyan-500/20 border border-foreground/[0.05]" />

        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground/55 font-semibold">Brewhouse</div>
          <h2 className="text-lg font-bold mt-0.5">Pour-Over Coffee Kettle</h2>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground/50">· 156 reviews</span>
          </div>

          <div className="text-2xl font-bold mt-3">$74.00</div>

          <p className="text-sm leading-relaxed text-muted-foreground/70 mt-3">
            Gooseneck spout for precise flow control, 1L brushed-steel body, and a thermometer built into the lid.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.03]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-emerald-400">In stock</span>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-5">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg px-4 py-2.5 bg-primary text-primary-foreground hover:brightness-110 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Add to cart
            </button>
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
              onClick={() => setSaved((v) => !v)}
              className="h-10 w-10 shrink-0 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] flex items-center justify-center text-muted-foreground hover:text-red-400 transition"
            >
              <Heart className={cn("w-4 h-4", saved && "fill-red-400 text-red-400")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
