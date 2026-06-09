"use client";

import { useState } from "react";
import { Mail, MapPin, CreditCard, Lock } from "lucide-react";
import { cn } from "../lib/cn";

export interface CheckoutFormSectionProps {
  className?: string;
}

export function CheckoutFormSection({ className }: CheckoutFormSectionProps) {
  const [sameAsShipping, setSameAsShipping] = useState(true);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-lg bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <h3 className="mb-5 text-base font-bold">Checkout</h3>

      {/* Contact */}
      <section className="mb-5">
        <div className="mb-2.5 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Contact</h4>
        </div>
        <label htmlFor="cfs-email" className="sr-only">Email</label>
        <input
          id="cfs-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-[12px] placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </section>

      {/* Shipping */}
      <section className="mb-5">
        <div className="mb-2.5 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Shipping</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="cfs-street" className="sr-only">Street address</label>
            <input
              id="cfs-street"
              type="text"
              autoComplete="street-address"
              placeholder="Street address"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfs-city" className="sr-only">City</label>
              <input
                id="cfs-city"
                type="text"
                autoComplete="address-level2"
                placeholder="City"
                className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="cfs-zip" className="sr-only">ZIP code</label>
              <input
                id="cfs-zip"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="ZIP"
                className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="mb-5">
        <div className="mb-2.5 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="cfs-card" className="sr-only">Card number</label>
            <input
              id="cfs-card"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Card number"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 font-mono text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfs-exp" className="sr-only">Expiry date</label>
              <input
                id="cfs-exp"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 font-mono text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="cfs-cvc" className="sr-only">CVC</label>
              <input
                id="cfs-cvc"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 font-mono text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Billing address same as shipping
          </label>
        </div>
      </section>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        <Lock className="h-4 w-4" />
        Pay $129.00
      </button>
    </form>
  );
}
