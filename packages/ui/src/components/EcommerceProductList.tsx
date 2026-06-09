"use client";

import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "../lib/cn";

type Row = {
  id: string;
  name: string;
  meta: string;
  price: number;
  rating: number;
  reviews: number;
  stock: "in" | "low" | "out";
  tone: string;
};

const ROWS: Row[] = [
  { id: "r1", name: "Aero Trail Jacket", meta: "Men's · Slate / M", price: 158, rating: 4.7, reviews: 214, stock: "in", tone: "from-sky-400/30 to-blue-500/20" },
  { id: "r2", name: "Everyday Crew Tee", meta: "Unisex · Bone / L", price: 32, rating: 4.4, reviews: 1203, stock: "low", tone: "from-amber-400/30 to-yellow-500/20" },
  { id: "r3", name: "Commuter Backpack", meta: "22L · Charcoal", price: 96, rating: 4.9, reviews: 88, stock: "in", tone: "from-emerald-400/30 to-green-500/20" },
  { id: "r4", name: "Trail Cap", meta: "One size · Olive", price: 24, rating: 4.2, reviews: 47, stock: "out", tone: "from-rose-400/30 to-red-500/20" },
];

const STOCK: Record<Row["stock"], { label: string; cls: string }> = {
  in: { label: "In stock", cls: "text-emerald-400" },
  low: { label: "Low stock", cls: "text-amber-400" },
  out: { label: "Sold out", cls: "text-muted-foreground/50" },
};

export interface EcommerceProductListProps {
  className?: string;
}

export function EcommerceProductList({ className }: EcommerceProductListProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <ul className="divide-y divide-foreground/[0.05]">
        {ROWS.map((r) => {
          const s = STOCK[r.stock];
          return (
            <li key={r.id} className="flex items-center gap-3 p-2.5">
              <div className={cn("h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br border border-foreground/[0.05]", r.tone)} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground/55">{r.meta}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {r.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground/40">({r.reviews})</span>
                  <span className={cn("font-medium", s.cls)}>{s.label}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-base font-bold">${r.price}</span>
                <button
                  type="button"
                  disabled={r.stock === "out"}
                  aria-label={`Add ${r.name} to cart`}
                  className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg px-2.5 py-1.5 bg-primary text-primary-foreground hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
