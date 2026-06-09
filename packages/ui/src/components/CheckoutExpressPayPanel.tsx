"use client";

import { Apple, Smartphone, Wallet } from "lucide-react";
import { cn } from "../lib/cn";

export interface CheckoutExpressPayPanelProps {
  className?: string;
}

export function CheckoutExpressPayPanel({ className }: CheckoutExpressPayPanelProps) {
  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <h3 className="mb-3 text-sm font-bold">Express checkout</h3>

      <div className="space-y-2">
        <button
          type="button"
          aria-label="Pay with Apple Pay"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Apple className="h-4 w-4 fill-white" />
          Pay
        </button>

        <button
          type="button"
          aria-label="Pay with Google Pay"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-foreground/[0.1] bg-white py-3 text-sm font-semibold text-neutral-900 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Smartphone className="h-4 w-4" />
          Pay
        </button>

        <button
          type="button"
          aria-label="Pay with PayPal"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc439] py-3 text-sm font-bold text-[#003087] transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Wallet className="h-4 w-4" />
          PayPal
        </button>
      </div>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or pay with card</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="w-full rounded-xl border border-border bg-foreground/[0.03] py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        Enter card details
      </button>
    </div>
  );
}
