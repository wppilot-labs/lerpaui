"use client";

import React, { useState } from "react";
import { ShoppingBag, Plus, Minus, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Line = {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  swatch: string;
};

const INITIAL: Line[] = [
  {
    id: "1",
    name: "Linen Overshirt",
    variant: "Sand · M",
    price: 89,
    qty: 1,
    swatch: "bg-amber-200/30",
  },
  {
    id: "2",
    name: "Everyday Tote",
    variant: "Forest",
    price: 64,
    qty: 1,
    swatch: "bg-emerald-300/25",
  },
  {
    id: "3",
    name: "Wool Beanie",
    variant: "Charcoal",
    price: 28,
    qty: 2,
    swatch: "bg-zinc-300/20",
  },
];

const FREE_SHIP = 150;

export interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className }: CartDrawerProps) {
  const [lines, setLines] = useState(INITIAL);

  const setQty = (id: string, d: number) =>
    setLines((l) =>
      l.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x)),
    );
  const remove = (id: string) => setLines((l) => l.filter((x) => x.id !== id));

  const subtotal = lines.reduce((s, x) => s + x.price * x.qty, 0);
  const count = lines.reduce((s, x) => s + x.qty, 0);
  const toFree = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground flex flex-col overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
        <h3 className="flex items-center gap-1.5 text-base font-bold">
          <ShoppingBag className="h-4 w-4 text-primary" /> Cart
          <span className="text-xs font-medium text-muted-foreground/50">
            ({count})
          </span>
        </h3>
        <button
          type="button"
          aria-label="Close cart"
          className="text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-border/40 px-5 py-3">
        <p className="mb-1.5 text-xs text-muted-foreground">
          {toFree > 0 ? (
            <>
              You&apos;re{" "}
              <span className="font-bold text-foreground">${toFree}</span> away
              from free shipping
            </>
          ) : (
            <span className="font-semibold text-emerald-400">
              You&apos;ve unlocked free shipping
            </span>
          )}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary/50">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="max-h-72 divide-y divide-border/40 overflow-y-auto px-5">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-3 py-4">
            <div
              className={cn(
                "h-14 w-14 shrink-0 rounded-xl border border-border/50",
                l.swatch,
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="text-xs text-muted-foreground/55">
                    {l.variant}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(l.id)}
                  aria-label={`Remove ${l.name}`}
                  className="text-muted-foreground/40 transition-colors hover:text-rose-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center rounded-lg border border-border/60">
                  <button
                    type="button"
                    onClick={() => setQty(l.id, -1)}
                    aria-label="Decrease quantity"
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold tabular-nums">
                    {l.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(l.id, 1)}
                    aria-label="Increase quantity"
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  ${(l.price * l.qty).toFixed(0)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-border/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground/70">Subtotal</span>
          <span className="text-base font-black tabular-nums">
            ${subtotal.toFixed(0)}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
        >
          Checkout <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
