"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag, X } from "lucide-react";
import { cn } from "../lib/cn";

type Saved = {
  id: string;
  name: string;
  brand: string;
  price: number;
  inStock: boolean;
  tone: string;
};

const INITIAL: Saved[] = [
  { id: "w1", name: "Quilted Liner Jacket", brand: "Northbound", price: 142, inStock: true, tone: "from-amber-400/30 to-orange-500/20" },
  { id: "w2", name: "Cashmere Scarf", brand: "Atelier", price: 88, inStock: true, tone: "from-rose-400/30 to-pink-500/20" },
  { id: "w3", name: "Trail Runner GTX", brand: "Stride", price: 165, inStock: false, tone: "from-sky-400/30 to-blue-500/20" },
  { id: "w4", name: "Merino Henley", brand: "Field Co.", price: 64, inStock: true, tone: "from-emerald-400/30 to-teal-500/20" },
];

export interface EcommerceWishlistGridProps {
  className?: string;
}

export function EcommerceWishlistGrid({ className }: EcommerceWishlistGridProps) {
  const [items, setItems] = useState<Saved[]>(INITIAL);
  const remove = (id: string) => setItems((s) => s.filter((i) => i.id !== id));

  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="inline-flex items-center gap-1.5 text-base font-bold">
          <Heart className="w-4 h-4 fill-red-400 text-red-400" /> Wishlist
        </h3>
        <span className="text-xs text-muted-foreground/55">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground/55">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] overflow-hidden">
              <div className={cn("relative aspect-square bg-gradient-to-br", it.tone)}>
                <button
                  type="button"
                  aria-label={`Remove ${it.name} from wishlist`}
                  onClick={() => remove(it.id)}
                  className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full bg-background/60 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                {!it.inStock && (
                  <span className="absolute left-1.5 bottom-1.5 text-[11px] font-bold uppercase bg-background/70 backdrop-blur text-muted-foreground px-1.5 py-0.5 rounded">
                    Out of stock
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground/55 font-semibold truncate">{it.brand}</div>
                <div className="text-sm font-semibold truncate">{it.name}</div>
                <div className="text-base font-bold mt-0.5">${it.price}</div>
                <button
                  type="button"
                  disabled={!it.inStock}
                  aria-label={`Move ${it.name} to bag`}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-lg px-2 py-1.5 bg-primary text-primary-foreground hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
