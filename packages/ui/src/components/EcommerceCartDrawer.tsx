"use client";

import React, { useState } from "react";
import { ShoppingBag, Plus, Minus, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Line = { id: string; name: string; variant: string; price: number; qty: number };

const INITIAL: Line[] = [
  { id: "1", name: "Aero Runner", variant: "Black · 42", price: 129, qty: 1 },
  { id: "2", name: "Merino Sock 3-pack", variant: "Grey", price: 24, qty: 2 },
];

export interface EcommerceCartDrawerProps {
  className?: string;
}

export function EcommerceCartDrawer({ className }: EcommerceCartDrawerProps) {
  const [lines, setLines] = useState(INITIAL);
  const setQty = (id: string, d: number) =>
    setLines((l) => l.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x)));
  const remove = (id: string) => setLines((l) => l.filter((x) => x.id !== id));
  const subtotal = lines.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className={cn("w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground flex flex-col overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/[0.06]">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-primary" /> Your cart
          <span className="text-xs font-medium text-muted-foreground/50">({lines.reduce((s, x) => s + x.qty, 0)})</span>
        </h3>
      </div>

      <ul className="divide-y divide-foreground/[0.04] px-5">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-3 py-4">
            <div className="h-16 w-16 rounded-xl bg-secondary/40 border border-foreground/[0.05] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground/55">{l.variant}</div>
                </div>
                <button type="button" onClick={() => remove(l.id)} aria-label={`Remove ${l.name}`} className="text-muted-foreground/40 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <div className="inline-flex items-center rounded-lg border border-foreground/[0.08]">
                  <button type="button" onClick={() => setQty(l.id, -1)} aria-label="Decrease quantity" className="p-1.5 text-muted-foreground hover:text-foreground"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="px-2.5 text-xs font-bold tabular-nums">{l.qty}</span>
                  <button type="button" onClick={() => setQty(l.id, 1)} aria-label="Increase quantity" className="p-1.5 text-muted-foreground hover:text-foreground"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <span className="text-sm font-bold tabular-nums">${(l.price * l.qty).toFixed(0)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto p-5 border-t border-foreground/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground/70">Subtotal</span>
          <span className="text-lg font-black tabular-nums">${subtotal.toFixed(0)}</span>
        </div>
        <button type="button" className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">
          Checkout <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
