"use client";

import React, { useState } from "react";
import { Tag, ArrowRight, Check, X } from "lucide-react";
import { cn } from "../lib/cn";

type Msg = { from: "seller" | "buyer"; amount: number; note?: string };

const HISTORY: Msg[] = [
  { from: "seller", amount: 420, note: "Listed price" },
  { from: "buyer", amount: 350, note: "Initial offer" },
  { from: "seller", amount: 390, note: "Counteroffer" },
];

export interface MarketplaceOfferNegotiationCardProps {
  className?: string;
}

export function MarketplaceOfferNegotiationCard({ className }: MarketplaceOfferNegotiationCardProps) {
  const [counter, setCounter] = useState("375");
  const latest = HISTORY[HISTORY.length - 1];

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-foreground/[0.06]">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-foreground/[0.05]">
          <Tag className="w-5 h-5 text-primary" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-bold truncate">Vintage Film Camera</div>
          <div className="text-xs text-muted-foreground/55">Listed at <span className="tabular-nums">$420</span></div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-2">
        {HISTORY.map((m, i) => {
          const isSeller = m.from === "seller";
          return (
            <div key={i} className={cn("flex", isSeller ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-xl px-3.5 py-2.5 border",
                  isSeller ? "bg-foreground/[0.03] border-foreground/[0.06]" : "bg-primary/10 border-primary/20",
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold tabular-nums">${m.amount}</span>
                  {m.note && <span className="text-xs text-muted-foreground/55">{m.note}</span>}
                </div>
                <span className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground/40">{isSeller ? "Seller" : "You"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-5 pt-1 space-y-3">
        <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4">
          <label htmlFor="offer-amount" className="block text-xs font-semibold text-muted-foreground/70 mb-1.5">Your counteroffer</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm">$</span>
              <input
                id="offer-amount"
                inputMode="numeric"
                value={counter}
                onChange={(e) => setCounter(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg pl-6 pr-3 py-2.5 text-sm tabular-nums focus:ring-1 focus:ring-primary/50 focus:outline-none"
              />
            </div>
            <button type="button" className="inline-flex items-center gap-1 bg-primary hover:brightness-110 text-primary-foreground text-sm font-bold px-4 py-2.5 rounded-lg transition-all">
              Send <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors">
            <Check className="w-4 h-4" /> Accept ${latest.amount}
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-lg bg-foreground/[0.04] text-muted-foreground/70 hover:bg-foreground/[0.08] transition-colors">
            <X className="w-4 h-4" /> Decline
          </button>
        </div>
      </div>
    </div>
  );
}
