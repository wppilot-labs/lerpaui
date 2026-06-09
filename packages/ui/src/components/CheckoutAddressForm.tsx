"use client";

import { MapPin } from "lucide-react";
import { cn } from "../lib/cn";

export interface CheckoutAddressFormProps {
  className?: string;
}

export function CheckoutAddressForm({ className }: CheckoutAddressFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Shipping address</h3>
      </div>

      <div className="space-y-3.5">
        <div>
          <label htmlFor="ca-street" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Street address
          </label>
          <input
            id="ca-street"
            type="text"
            autoComplete="street-address"
            placeholder="123 Market St"
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label htmlFor="ca-apt" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Apartment, suite (optional)
          </label>
          <input
            id="ca-apt"
            type="text"
            placeholder="Apt 4B"
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ca-city" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              City
            </label>
            <input
              id="ca-city"
              type="text"
              autoComplete="address-level2"
              placeholder="San Francisco"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="ca-zip" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              ZIP code
            </label>
            <input
              id="ca-zip"
              type="text"
              autoComplete="postal-code"
              inputMode="numeric"
              placeholder="94103"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ca-country" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Country
          </label>
          <select
            id="ca-country"
            defaultValue="US"
            autoComplete="country"
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="US" className="bg-card">United States</option>
            <option value="CA" className="bg-card">Canada</option>
            <option value="GB" className="bg-card">United Kingdom</option>
            <option value="DE" className="bg-card">Germany</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Continue to payment
      </button>
    </form>
  );
}
