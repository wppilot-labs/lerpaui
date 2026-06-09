"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, ShieldCheck, FileCheck, Lock, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterColumn {
  heading: string;
  links: string[];
}

export interface FooterBadge {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}

export interface FooterEnterpriseLegalProps {
  className?: string;
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  legal?: string[];
  badges?: FooterBadge[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { heading: "Platform", links: ["Overview", "Security", "Pricing", "Customers", "Roadmap", "Integrations"] },
  { heading: "Solutions", links: ["Financial Services", "Healthcare", "Public Sector", "Education", "Manufacturing", "Retail"] },
  { heading: "Resources", links: ["Documentation", "API Reference", "Whitepapers", "Case Studies", "Webinars", "Trust Center"] },
  { heading: "Company", links: ["About", "Leadership", "Investors", "Press", "Careers", "Contact Sales"] },
  { heading: "Trust & Compliance", links: ["SOC 2 Type II", "ISO 27001", "HIPAA", "GDPR", "CCPA", "PCI DSS Level 1"] },
];

const DEFAULT_LEGAL: string[] = [
  "Terms of Service",
  "Privacy Policy",
  "Cookie Policy",
  "Acceptable Use Policy",
  "Master Subscription Agreement",
  "Data Processing Addendum",
  "Sub-Processors",
  "Modern Slavery Statement",
  "Accessibility Statement",
  "Responsible Disclosure",
];

const DEFAULT_BADGES: FooterBadge[] = [
  { icon: ShieldCheck, label: "SOC 2 Type II" },
  { icon: FileCheck, label: "ISO 27001" },
  { icon: Lock, label: "HIPAA-Ready" },
];

export function FooterEnterpriseLegal({
  className,
  brandName = "Lerpa UI Enterprise",
  tagline = "The trusted platform for regulated industries. Designed for scale, audited for compliance.",
  columns = DEFAULT_COLUMNS,
  legal = DEFAULT_LEGAL,
  badges = DEFAULT_BADGES,
}: FooterEnterpriseLegalProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const year = new Date().getFullYear();

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
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-6"
        >
          <div className="col-span-2 md:col-span-1">
            <h2 id={headingId} className="text-base font-black tracking-tight text-foreground">{brandName}</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {tagline}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {badges.map((b) => (
                <div key={b.label} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs">
                  <b.icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  <span className="font-semibold text-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </motion.div>

        <div className="mt-12 border-t border-border pt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal & policies</h3>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l}>
                <a href="/" className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {year} {brandName}, Inc. All rights reserved. Patents pending. Various trademarks held by their respective owners.</span>
          <div className="flex items-center gap-3">
            <label htmlFor="fel-region" className="sr-only">Select region</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <select id="fel-region" className="appearance-none rounded-lg border border-border bg-card py-1.5 pl-8 pr-7 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                <option>United States (English)</option>
                <option>United Kingdom (English)</option>
                <option>Deutschland (Deutsch)</option>
                <option>France (Français)</option>
                <option>日本 (日本語)</option>
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterEnterpriseLegal;
