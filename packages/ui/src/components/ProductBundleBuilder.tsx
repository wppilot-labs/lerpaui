"use client";

import React, { useState } from "react";
import { Check, Package, Tag } from "lucide-react";
import { cn } from "../lib/cn";

type Item = {
  id: string;
  name: string;
  price: number;
  tint: string;
  required?: boolean;
};

const ITEMS: Item[] = [
  { id: "camera", name: "Action Camera", price: 249, tint: "bg-sky-500", required: true },
  { id: "mount", name: "Helmet Mount", price: 29, tint: "bg-emerald-500" },
  { id: "battery", name: "Spare Battery", price: 39, tint: "bg-amber-500" },
  { id: "case", name: "Dive Case", price: 59, tint: "bg-fuchsia-500" },
  { id: "card", name: "128GB Card", price: 34, tint: "bg-rose-500" },
];

const BUNDLE_DISCOUNT = 0.15;

export interface ProductBundleBuilderProps {
  className?: string;
}

export function ProductBundleBuilder({ className }: ProductBundleBuilderProps) {
  const [picked, setPicked] = useState<Record<string, boolean>>({
    camera: true,
    mount: true,
  });

  const toggle = (it: Item) => {
    if (it.required) return;
    setPicked((p) => ({ ...p, [it.id]: !p[it.id] }));
  };

  const selected = ITEMS.filter((i) => picked[i.id] || i.required);
  const subtotal = selected.reduce((s, i) => s + i.price, 0);
  const discount = selected.length >= 3 ? subtotal * BUNDLE_DISCOUNT : 0;
  const total = subtotal - discount;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Package className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Build your bundle</h3>
      </div>
      <p className="text-xs text-muted-foreground/60 mb-4">
        Add 3+ items to save {Math.round(BUNDLE_DISCOUNT * 100)}%
      </p>

      <ul className="space-y-2">
        {ITEMS.map((it) => {
          const on = picked[it.id] || it.required;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => toggle(it)}
                aria-pressed={on}
                disabled={it.required}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all",
                  on
                    ? "border-primary/50 bg-primary/[0.06]"
                    : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/25",
                  it.required && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center shrink-0 border",
                    on
                      ? "bg-primary border-primary"
                      : "border-foreground/20 bg-transparent",
                  )}
                >
                  {on && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
                </span>
                <span className={cn("h-9 w-9 rounded-lg shrink-0", it.tint)} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold truncate">
                    {it.name}
                  </span>
                  {it.required && (
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground/50 font-bold">
                      Base item
                    </span>
                  )}
                </span>
                <span className="text-sm font-bold">${it.price}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground/65">
          <span>Subtotal ({selected.length})</span>
          <span className="tabular-nums">${subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-xs text-emerald-400 font-semibold">
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Bundle discount
            </span>
            <span className="tabular-nums">−${discount.toFixed(0)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-1">
          <span className="text-sm font-bold">Total</span>
          <span className="text-2xl font-black tabular-nums">
            ${total.toFixed(0)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-3 w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Add bundle to cart
      </button>
    </div>
  );
}
