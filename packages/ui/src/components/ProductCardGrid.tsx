"use client";

import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "../lib/cn";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  was?: number;
  rating: number;
  swatch: string;
  tint: string;
  tag?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Linen Camp Shirt",
    brand: "Atelier",
    price: 64,
    was: 89,
    rating: 4.6,
    swatch: "#c2603f",
    tint: "from-orange-500/25 to-amber-500/10",
    tag: "Sale",
  },
  {
    id: "p2",
    name: "Wool Crew Sweater",
    brand: "Northbound",
    price: 118,
    rating: 4.9,
    swatch: "#7c9473",
    tint: "from-emerald-500/25 to-teal-500/10",
    tag: "New",
  },
  {
    id: "p3",
    name: "Selvedge Denim",
    brand: "Forge & Co",
    price: 132,
    rating: 4.7,
    swatch: "#1e293b",
    tint: "from-sky-500/25 to-indigo-500/10",
  },
  {
    id: "p4",
    name: "Suede Chelsea Boot",
    brand: "Marlowe",
    price: 210,
    rating: 4.8,
    swatch: "#6b3f6e",
    tint: "from-fuchsia-500/25 to-purple-500/10",
  },
];

export interface ProductCardGridProps {
  className?: string;
}

export function ProductCardGrid({ className }: ProductCardGridProps) {
  const [liked, setLiked] = useState<Record<string, boolean>>({ p2: true });

  return (
    <div
      className={cn(
        "w-full max-w-md grid grid-cols-2 gap-3 font-sans text-foreground",
        className,
      )}
    >
      {PRODUCTS.map((p) => (
        <article
          key={p.id}
          className="group bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-xl"
        >
          <div
            className={cn(
              "relative h-28 bg-gradient-to-br flex items-end justify-start p-2",
              p.tint,
            )}
          >
            {p.tag && (
              <span
                className={cn(
                  "absolute top-2 left-2 text-[11px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded",
                  p.tag === "Sale"
                    ? "bg-red-500 text-white"
                    : "bg-emerald-500 text-white",
                )}
              >
                {p.tag}
              </span>
            )}
            <button
              type="button"
              aria-label={liked[p.id] ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={!!liked[p.id]}
              onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-muted/80 backdrop-blur flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  liked[p.id]
                    ? "fill-red-500 text-red-500"
                    : "text-foreground",
                )}
              />
            </button>
            <span
              className="h-5 w-5 rounded-full border-2 border-foreground/70 shadow"
              style={{ backgroundColor: p.swatch }}
            />
          </div>

          <div className="p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground/55 font-bold">
              {p.brand}
            </p>
            <h3 className="text-sm font-semibold leading-tight mt-0.5 truncate">
              {p.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground/70">
                {p.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-lg font-black">${p.price}</span>
              {p.was && (
                <span className="text-xs text-muted-foreground/45 line-through">
                  ${p.was}
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
