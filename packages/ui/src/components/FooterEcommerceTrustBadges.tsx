"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, Award, Instagram, Facebook, Youtube } from "lucide-react";
import { cn } from "../lib/cn";

export interface TrustBadge {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  desc: string;
}

export interface FooterColumnLinks {
  heading: string;
  links: string[];
}

export interface EcomSocial {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}

export interface FooterEcommerceTrustBadgesProps {
  className?: string;
  brandName?: string;
  tagline?: string;
  trust?: TrustBadge[];
  columns?: FooterColumnLinks[];
  payments?: string[];
  social?: EcomSocial[];
}

const DEFAULT_TRUST: TrustBadge[] = [
  { icon: Truck, title: "Free shipping", desc: "On orders over $75" },
  { icon: RotateCcw, title: "30-day returns", desc: "No questions asked" },
  { icon: ShieldCheck, title: "Secure checkout", desc: "256-bit SSL encryption" },
  { icon: Headphones, title: "Real human support", desc: "7 days a week" },
];

const DEFAULT_COLUMNS: FooterColumnLinks[] = [
  { heading: "Shop", links: ["New Arrivals", "Bestsellers", "Sale", "Gift Cards", "Collections", "Lookbook"] },
  { heading: "Support", links: ["Order Tracking", "Returns & Exchanges", "Shipping", "Size Guide", "FAQ", "Contact"] },
  { heading: "About", links: ["Our Story", "Sustainability", "Careers", "Press", "Ambassadors", "Stores"] },
];

const DEFAULT_PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Shop Pay", "Klarna"];

const DEFAULT_SOCIAL: EcomSocial[] = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
];

export function FooterEcommerceTrustBadges({
  className,
  brandName = "Northbeam Goods",
  tagline = "Honest goods built in small batches. Designed in Portland, made to outlast trends.",
  trust = DEFAULT_TRUST,
  columns = DEFAULT_COLUMNS,
  payments = DEFAULT_PAYMENTS,
  social = DEFAULT_SOCIAL,
}: FooterEcommerceTrustBadgesProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <footer
      aria-labelledby={headingId}
      className={cn(
        "relative w-full border-t border-border bg-background px-6 py-12 md:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {trust.map((t) => (
            <div key={t.title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <h2 id={headingId} className="text-lg font-black tracking-tight text-foreground">{brandName}</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {tagline}
            </p>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Follow us</div>
              <div className="mt-2 flex items-center gap-2">
                {social.map((s) => (
                  <a key={s.label} href="/" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                    <s.icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span key={p} className="inline-flex h-7 items-center rounded-md border border-border bg-card px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              PCI DSS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" aria-hidden />
              B-Corp Certified
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
          <nav aria-label="Footer policies" className="flex items-center gap-5">
            <a href="/" className="hover:text-foreground">Privacy</a>
            <a href="/" className="hover:text-foreground">Terms</a>
            <a href="/" className="hover:text-foreground">Accessibility</a>
            <a href="/" className="hover:text-foreground">Do Not Sell</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default FooterEcommerceTrustBadges;
