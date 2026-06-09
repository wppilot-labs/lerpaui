"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterSocialLink {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}

export interface FooterStartupCompactProps {
  className?: string;
  brandName?: string;
  tagline?: string;
  navLinks?: string[];
  legalLinks?: string[];
  social?: FooterSocialLink[];
  statusLabel?: string;
}

const DEFAULT_NAV_LINKS = ["Pricing", "Docs", "Changelog", "Blog", "Careers", "Contact"];
const DEFAULT_LEGAL_LINKS = ["Privacy", "Terms", "DPA", "Security"];

const DEFAULT_SOCIAL: FooterSocialLink[] = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
];

export function FooterStartupCompact({
  className,
  brandName = "Lerpa UI",
  tagline = "Ship at the speed of thought.",
  navLinks = DEFAULT_NAV_LINKS,
  legalLinks = DEFAULT_LEGAL_LINKS,
  social = DEFAULT_SOCIAL,
  statusLabel = "All systems operational",
}: FooterStartupCompactProps) {
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
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 id={headingId} className="text-base font-black tracking-tight text-foreground">{brandName}</h2>
            <p className="text-xs text-muted-foreground">{tagline}</p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {navLinks.map((l) => (
            <a key={l} href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {social.map((s) => (
            <a key={s.label} href="/" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <s.icon className="h-4 w-4" aria-hidden />
            </a>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© {year} {brandName} Inc.</span>
          {legalLinks.map((l) => (
            <a key={l} href="/" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">{l}</a>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <motion.span
              animate={reduced ? undefined : { scale: [1, 1.8], opacity: [0.7, 0] }}
              transition={reduced ? undefined : { duration: 1.8, ease: "easeOut", repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-emerald-500"
              aria-hidden
            />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          </span>
          {statusLabel}
        </span>
      </div>
    </footer>
  );
}

export default FooterStartupCompact;
