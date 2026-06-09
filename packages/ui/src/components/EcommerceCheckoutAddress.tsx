"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "../lib/cn";

const field = "w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none";
const label = "block text-xs font-semibold text-muted-foreground/70 mb-1";

export interface EcommerceCheckoutAddressProps {
  className?: string;
}

export function EcommerceCheckoutAddress({ className }: EcommerceCheckoutAddressProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={cn("w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold flex items-center gap-1.5 mb-4"><MapPin className="w-4 h-4 text-primary" /> Shipping address</h3>

      <div className="mb-3">
        <label htmlFor="ca-name" className={label}>Full name</label>
        <input id="ca-name" autoComplete="name" className={field} />
      </div>
      <div className="mb-3">
        <label htmlFor="ca-street" className={label}>Street address</label>
        <input id="ca-street" autoComplete="street-address" className={field} />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label htmlFor="ca-city" className={label}>City</label>
          <input id="ca-city" autoComplete="address-level2" className={field} />
        </div>
        <div>
          <label htmlFor="ca-zip" className={label}>ZIP</label>
          <input id="ca-zip" inputMode="numeric" autoComplete="postal-code" className={field} />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="ca-country" className={label}>Country</label>
        <select id="ca-country" defaultValue="us" className={field}>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      </div>

      <button type="submit" className="w-full py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all">Continue to shipping</button>
    </form>
  );
}
