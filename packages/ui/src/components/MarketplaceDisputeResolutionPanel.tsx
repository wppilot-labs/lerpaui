"use client";

import React, { useState } from "react";
import { ShieldAlert, User, Store, Scale } from "lucide-react";
import { cn } from "../lib/cn";

export interface MarketplaceDisputeResolutionPanelProps {
  className?: string;
}

export function MarketplaceDisputeResolutionPanel({ className }: MarketplaceDisputeResolutionPanelProps) {
  const [decision, setDecision] = useState<"buyer" | "seller" | "split" | null>(null);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-base font-bold">Dispute #DSP-2048</h3>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Under review
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="rounded-xl border border-foreground/[0.05] bg-foreground/[0.02] p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground/55 mb-1">
            <span>Order #4821 · Wireless Headphones</span>
            <span className="tabular-nums font-semibold text-foreground">$129.00</span>
          </div>
          <p className="text-sm text-muted-foreground/75">Reason: <span className="text-foreground">Item not as described</span></p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-foreground/[0.05] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1.5">
              <User className="w-4 h-4" /> Buyer
            </div>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">Received a different color than ordered. Requesting full refund.</p>
          </div>
          <div className="rounded-xl border border-foreground/[0.05] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 mb-1.5">
              <Store className="w-4 h-4" /> Seller
            </div>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">Listing showed correct variant. Offering 50% partial refund.</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 mb-2">
            <Scale className="w-4 h-4" /> Resolve in favor of
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "buyer", label: "Buyer" },
              { id: "split", label: "Split 50/50" },
              { id: "seller", label: "Seller" },
            ] as const).map((opt) => {
              const on = decision === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDecision(opt.id)}
                  className={cn(
                    "rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors",
                    on ? "border-primary bg-primary/10 text-primary" : "border-foreground/[0.08] text-muted-foreground/70 hover:bg-foreground/[0.03]",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={!decision}
          className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-40 text-primary-foreground text-sm font-bold rounded-lg transition-all"
        >
          Submit resolution
        </button>
      </div>
    </div>
  );
}
