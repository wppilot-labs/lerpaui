"use client";

import React, { useState } from "react";
import { ShoppingBag, CreditCard } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterEcommerceBasicProps {
  className?: string;
}

interface Column {
  title: string;
  links: string[];
}

const COLUMNS: Column[] = [
  { title: "Shop", links: ["New arrivals", "Best sellers", "Sale", "Gift cards"] },
  { title: "Support", links: ["Shipping", "Returns", "Order status", "Contact us"] },
  { title: "Company", links: ["About", "Careers", "Sustainability", "Press"] },
];

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal"];

export function FooterEcommerceBasic({ className }: FooterEcommerceBasicProps) {
  const [email, setEmail] = useState("");

  return (
    <footer
      aria-label="Store footer"
      className={cn("w-full border-t border-border bg-background text-foreground", className)}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-foreground">Stay in the loop</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Get early access to drops and exclusive offers.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-foreground">Marrow & Co.</span>
          </div>

          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {PAYMENTS.map((method) => (
              <span
                key={method}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-muted px-2 text-xs font-medium text-muted-foreground"
              >
                <CreditCard className="h-3 w-3" aria-hidden="true" />
                {method}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground sm:text-left">
          © 2026 Marrow & Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default FooterEcommerceBasic;
