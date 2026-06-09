"use client";

import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import { cn } from "../lib/cn";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  was?: number;
  rating: number;
  tone: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Linen Camp Shirt", brand: "Atelier", price: 68, was: 89, rating: 4.6, tone: "from-amber-400/30 to-orange-500/20" },
  { id: "p2", name: "Wool Runner Low", brand: "Stride", price: 124, rating: 4.8, tone: "from-sky-400/30 to-indigo-500/20" },
  { id: "p3", name: "Canvas Tote 18L", brand: "Field Co.", price: 42, rating: 4.3, tone: "from-emerald-400/30 to-teal-500/20" },
  { id: "p4", name: "Merino Beanie", brand: "Northbound", price: 28, was: 35, rating: 4.5, tone: "from-rose-400/30 to-pink-500/20" },
];

export interface EcommerceProductGridProps {
  className?: string;
}

export function EcommerceProductGrid({ className }: EcommerceProductGridProps) {
  const [liked, setLiked] = useState<Record<string, boolean>>({ p2: true });

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="group rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] overflow-hidden">
            <div className={cn("relative aspect-square bg-gradient-to-br", p.tone)}>
              {p.was && (
                <span className="absolute left-2 top-2 text-[11px] font-bold uppercase bg-red-500/90 text-white px-1.5 py-0.5 rounded">Sale</span>
              )}
              <button
                type="button"
                aria-label={liked[p.id] ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                aria-pressed={!!liked[p.id]}
                onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className="absolute right-2 top-2 h-7 w-7 rounded-full bg-background/60 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Heart className={cn("w-3.5 h-3.5", liked[p.id] && "fill-red-400 text-red-400")} />
              </button>
            </div>
            <div className="p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/55 font-semibold">{p.brand}</div>
              <div className="text-sm font-semibold truncate">{p.name}</div>
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-muted-foreground/70">{p.rating.toFixed(1)}</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-base font-bold">${p.price}</span>
                {p.was && <span className="text-xs text-muted-foreground/45 line-through">${p.was}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
