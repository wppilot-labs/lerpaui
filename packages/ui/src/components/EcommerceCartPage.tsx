"use client";

import React, { useState } from "react";
import { Trash2, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Line = { id: string; name: string; variant: string; price: number; qty: number };

const INITIAL: Line[] = [
  { id: "1", name: "Aero Runner", variant: "Black · 42", price: 129, qty: 1 },
  { id: "2", name: "Merino Sock 3-pack", variant: "Grey", price: 24, qty: 2 },
  { id: "3", name: "Trail Cap", variant: "Olive", price: 32, qty: 1 },
];

export interface EcommerceCartPageProps {
  className?: string;
}

export function EcommerceCartPage({ className }: EcommerceCartPageProps) {
  const [lines, setLines] = useState(INITIAL);
  const subtotal = lines.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = subtotal > 100 ? 0 : 8;

  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h2 className="text-lg font-bold mb-4">Shopping cart</h2>
      <div className="grid md:grid-cols-[1fr_240px] gap-5">
        <ul className="divide-y divide-foreground/[0.05]">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-3 py-3.5">
              <div className="h-20 w-20 rounded-xl bg-secondary/40 border border-foreground/[0.05] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{l.name}</div>
                <div className="text-xs text-muted-foreground/55">{l.variant}</div>
                <div className="text-xs text-muted-foreground/55 mt-1">Qty {l.qty}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="text-sm font-bold tabular-nums">${(l.price * l.qty).toFixed(0)}</span>
                <button type="button" onClick={() => setLines((s) => s.filter((x) => x.id !== l.id))} aria-label={`Remove ${l.name}`} className="text-muted-foreground/40 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] p-4 h-fit">
          <h3 className="text-sm font-bold mb-3">Order summary</h3>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between"><dt className="text-muted-foreground/60">Subtotal</dt><dd className="tabular-nums">${subtotal.toFixed(0)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground/60">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : `$${shipping}`}</dd></div>
            <div className="flex justify-between border-t border-foreground/[0.06] pt-2 mt-2 font-bold"><dt>Total</dt><dd className="tabular-nums">${(subtotal + shipping).toFixed(0)}</dd></div>
          </dl>
          <button type="button" className="w-full mt-4 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">
            Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}
