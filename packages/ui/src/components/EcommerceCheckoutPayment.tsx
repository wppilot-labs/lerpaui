"use client";

import React from "react";
import { CreditCard, Lock } from "lucide-react";
import { cn } from "../lib/cn";

const field = "w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none";
const label = "block text-xs font-semibold text-muted-foreground/70 mb-1";

export interface EcommerceCheckoutPaymentProps {
  className?: string;
}

export function EcommerceCheckoutPayment({ className }: EcommerceCheckoutPaymentProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={cn("w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-primary" /> Payment</h3>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50"><Lock className="w-3 h-3" /> Secure</span>
      </div>

      <div className="mb-3">
        <label htmlFor="cp-num" className={label}>Card number</label>
        <input id="cp-num" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className={field} />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label htmlFor="cp-exp" className={label}>Expiry</label>
          <input id="cp-exp" autoComplete="cc-exp" placeholder="MM / YY" className={field} />
        </div>
        <div>
          <label htmlFor="cp-cvc" className={label}>CVC</label>
          <input id="cp-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={field} />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="cp-name" className={label}>Name on card</label>
        <input id="cp-name" autoComplete="cc-name" className={field} />
      </div>

      <button type="submit" className="w-full py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">Pay $196</button>
    </form>
  );
}
