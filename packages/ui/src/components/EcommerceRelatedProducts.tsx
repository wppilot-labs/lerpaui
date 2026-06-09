"use client";

import React from "react";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Item = { id: string; name: string; price: number; rating: number; tone: string };

const ITEMS: Item[] = [
  { id: "a", name: "Ribbed Knit Sweater", price: 78, rating: 4.7, tone: "from-amber-400/30 to-orange-500/20" },
  { id: "b", name: "Selvedge Denim", price: 132, rating: 4.8, tone: "from-indigo-400/30 to-blue-500/20" },
  { id: "c", name: "Suede Chelsea Boot", price: 168, rating: 4.5, tone: "from-rose-400/30 to-pink-500/20" },
  { id: "d", name: "Wool Overshirt", price: 98, rating: 4.6, tone: "from-emerald-400/30 to-teal-500/20" },
];

export interface EcommerceRelatedProductsProps {
  className?: string;
}

export function EcommerceRelatedProducts({ className }: EcommerceRelatedProductsProps) {
  return (
    <div className={cn("w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold">You may also like</h3>
        <button type="button" className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {ITEMS.map((it) => (
          <button key={it.id} type="button" className="group shrink-0 w-40 text-left">
            <div className={cn("aspect-square rounded-xl bg-gradient-to-br border border-foreground/[0.05]", it.tone)} />
            <div className="mt-2 text-sm font-semibold truncate group-hover:text-primary transition">{it.name}</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-bold">${it.price}</span>
              <span className="inline-flex items-center gap-0.5 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {it.rating.toFixed(1)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
