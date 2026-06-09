"use client";

import React from "react";
import { Star, Check } from "lucide-react";
import { cn } from "../lib/cn";

const HIGHLIGHTS = [
  "100% organic combed cotton",
  "Pre-shrunk, garment-dyed",
  "Reinforced shoulder seams",
];

export interface EcommerceProductInfoSectionProps {
  className?: string;
}

export function EcommerceProductInfoSection({ className }: EcommerceProductInfoSectionProps) {
  const rating = 4.6;
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground/55 font-semibold">Heritage Goods</div>
      <h2 className="text-lg font-bold mt-0.5">Garment-Dyed Heavyweight Tee</h2>

      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("w-4 h-4", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30")}
            />
          ))}
        </span>
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground/50">· 412 reviews</span>
      </div>

      <div className="flex items-baseline gap-2.5 mt-4">
        <span className="text-2xl font-bold">$48</span>
        <span className="text-sm text-muted-foreground/45 line-through">$60</span>
        <span className="text-[11px] font-bold uppercase bg-red-500/15 text-red-400 px-2 py-0.5 rounded border border-red-500/20">20% off</span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground/70 mt-4">
        A wardrobe staple cut from 7.5oz cotton with a relaxed drape. Each piece is dyed individually for a
        lived-in tone that softens with every wash.
      </p>

      <ul className="mt-4 space-y-1.5">
        {HIGHLIGHTS.map((h) => (
          <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground/80">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        In stock — ships within 24 hours
      </div>
    </div>
  );
}
