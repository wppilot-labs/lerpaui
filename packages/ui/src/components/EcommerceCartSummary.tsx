"use client";

import React, { useState } from "react";
import { Tag, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface EcommerceCartSummaryProps {
  className?: string;
}

export function EcommerceCartSummary({ className }: EcommerceCartSummaryProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const subtotal = 178;
  const discount = applied ? 18 : 0;
  const shipping = 0;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  return (
    <div className={cn("w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Order summary</h3>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Tag className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code"
            aria-label="Promo code"
            className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg pl-9 pr-2 py-2 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
        <button type="button" onClick={() => setApplied(!!code)} className="px-3 py-2 text-xs font-bold rounded-lg bg-secondary/60 border border-foreground/[0.06] hover:text-foreground transition-colors">Apply</button>
      </div>

      <dl className="space-y-2 text-xs">
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Subtotal</dt><dd className="tabular-nums">${subtotal}</dd></div>
        {applied && <div className="flex justify-between text-emerald-400"><dt>Discount</dt><dd className="tabular-nums">−${discount}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Shipping</dt><dd className="tabular-nums">Free</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground/60">Tax</dt><dd className="tabular-nums">${tax}</dd></div>
        <div className="flex justify-between border-t border-foreground/[0.06] pt-2 mt-2 text-lg font-black"><dt>Total</dt><dd className="tabular-nums">${total}</dd></div>
      </dl>

      <button type="button" className="w-full mt-4 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">
        Proceed to checkout <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
