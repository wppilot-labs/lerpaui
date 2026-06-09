"use client";

import React, { useState } from "react";
import { Bookmark, ShoppingCart, X } from "lucide-react";
import { cn } from "../lib/cn";

type Saved = {
  id: string;
  name: string;
  variant: string;
  price: number;
  swatch: string;
  inStock: boolean;
};

const SAVED: Saved[] = [
  {
    id: "1",
    name: "Canvas Weekender",
    variant: "Olive",
    price: 118,
    swatch: "bg-emerald-300/20",
    inStock: true,
  },
  {
    id: "2",
    name: "Leather Card Holder",
    variant: "Tan",
    price: 42,
    swatch: "bg-amber-300/25",
    inStock: true,
  },
  {
    id: "3",
    name: "Merino Scarf",
    variant: "Rust",
    price: 56,
    swatch: "bg-rose-300/20",
    inStock: false,
  },
];

export interface CartSaveForLaterListProps {
  className?: string;
}

export function CartSaveForLaterList({
  className,
}: CartSaveForLaterListProps) {
  const [items, setItems] = useState(SAVED);
  const remove = (id: string) =>
    setItems((l) => l.filter((x) => x.id !== id));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-base font-bold">
          <Bookmark className="h-4 w-4 text-primary" /> Saved for later
        </h3>
        <span className="text-xs text-muted-foreground/50">
          {items.length} items
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-xs text-muted-foreground/50">
          Nothing saved yet.
        </p>
      ) : (
        <ul className="divide-y divide-border/40">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 py-3">
              <div
                className={cn(
                  "h-12 w-12 shrink-0 rounded-lg border border-border/50",
                  it.swatch,
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{it.name}</div>
                <div className="text-xs text-muted-foreground/55">
                  {it.variant} · ${it.price}
                </div>
                {!it.inStock && (
                  <span className="mt-0.5 inline-block text-[11px] font-semibold text-amber-400">
                    Back in stock soon
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={!it.inStock}
                  onClick={() => remove(it.id)}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Move
                </button>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  aria-label={`Remove ${it.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:text-rose-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
