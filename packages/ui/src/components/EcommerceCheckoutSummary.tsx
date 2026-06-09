"use client";

import React from "react";
import { cn } from "../lib/cn";

type Item = { name: string; qty: number; price: number };

const ITEMS: Item[] = [
  { name: "Aero Runner", qty: 1, price: 129 },
  { name: "Merino Sock 3-pack", qty: 2, price: 24 },
];

export interface EcommerceCheckoutSummaryProps {
  className?: string;
}

export function EcommerceCheckoutSummary({ className }: EcommerceCheckoutSummaryProps) {
  const subtotal = ITEMS.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <div className={cn("w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Review your order</h3>

      <ul className="space-y-3 mb-4">
        {ITEMS.map((it) => (
          <li key={it.name} className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg bg-secondary/40 border border-foreground/[0.05] shrink-0">
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">{it.qty}</span>
            </div>
            <span className="text-xs font-medium flex-1 truncate">{it.name}</span>
            <span className="text-xs font-bold tabular-nums">${(it.price * it.qty).toFixed(0)}</span>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 text-xs border-t border-foreground/[0.06] pt-3">
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Subtotal</dt><dd className="tabular-nums">${subtotal}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Shipping</dt><dd className="tabular-nums">${shipping}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Tax</dt><dd className="tabular-nums">${tax}</dd></div>
        <div className="flex justify-between text-lg font-black border-t border-foreground/[0.06] pt-2 mt-2"><dt>Total</dt><dd className="tabular-nums">${total}</dd></div>
      </dl>
    </div>
  );
}
