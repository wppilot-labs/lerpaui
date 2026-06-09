"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { cn } from "../lib/cn";

const COUNTRIES = ["United States", "United Kingdom", "Germany", "France", "Netherlands", "Canada"];

export interface BillingTaxInfoFormProps {
  className?: string;
}

export function BillingTaxInfoForm({ className }: BillingTaxInfoFormProps) {
  const [country, setCountry] = useState("Germany");
  const showVat = country !== "United States" && country !== "Canada";

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <div className="mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Tax information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="tax-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Business name
          </label>
          <input
            id="tax-name"
            type="text"
            placeholder="Acme Inc."
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label htmlFor="tax-country" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Country
          </label>
          <select
            id="tax-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">
                {c}
              </option>
            ))}
          </select>
        </div>

        {showVat && (
          <div>
            <label htmlFor="tax-vat" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              VAT / Tax ID
            </label>
            <input
              id="tax-vat"
              type="text"
              placeholder="DE123456789"
              className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 font-mono text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Reverse-charge may apply for valid EU VAT numbers.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="tax-address" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Billing address
          </label>
          <textarea
            id="tax-address"
            rows={2}
            placeholder="Street, city, postal code"
            className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Save tax details
      </button>
    </form>
  );
}
