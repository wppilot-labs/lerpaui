"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { cn } from "../lib/cn";

export interface CheckoutContactFormProps {
  className?: string;
}

export function CheckoutContactForm({ className }: CheckoutContactFormProps) {
  const [updates, setUpdates] = useState(true);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <h3 className="mb-1 text-base font-bold">Contact details</h3>
      <p className="mb-4 text-sm text-muted-foreground">We&apos;ll use this to send your order confirmation.</p>

      <div className="space-y-3.5">
        <div>
          <label htmlFor="cc-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="cc-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cc-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Phone (for delivery updates)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="cc-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-1234"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          Email me news and exclusive offers
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Continue
      </button>
    </form>
  );
}
