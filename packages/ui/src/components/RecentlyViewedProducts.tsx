"use client";

import React from "react";
import { Clock, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Product = { id: string; name: string; price: string; rating: number; gradient: string };

const PRODUCTS: Product[] = [
  { id: "1", name: "Aer Travel Pack 3", price: "$229", rating: 4.8, gradient: "from-slate-500 to-slate-700" },
  { id: "2", name: "Lamy Safari Pen", price: "$32", rating: 4.9, gradient: "from-amber-400 to-orange-500" },
  { id: "3", name: "Roost Laptop Stand", price: "$89", rating: 4.7, gradient: "from-zinc-400 to-zinc-600" },
  { id: "4", name: "Hario V60 Kit", price: "$45", rating: 4.9, gradient: "from-rose-400 to-red-500" },
];

export interface RecentlyViewedProductsProps {
  className?: string;
}

export function RecentlyViewedProducts({ className }: RecentlyViewedProductsProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold">Recently viewed</h3>
        </div>
        <a href="/" className="text-xs font-semibold text-primary hover:underline">
          Clear
        </a>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {PRODUCTS.map((p) => (
          <a
            key={p.id}
            href="/"
            className="group w-36 shrink-0 rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-2.5 transition-colors hover:border-foreground/[0.12] hover:bg-foreground/[0.04]"
          >
            <div className={cn("mb-2 aspect-square rounded-lg bg-gradient-to-br ring-1 ring-inset ring-foreground/10", p.gradient)} />
            <div className="truncate text-sm font-semibold group-hover:text-primary">{p.name}</div>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-sm font-bold">{p.price}</span>
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground/60">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {p.rating}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
