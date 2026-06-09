"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Twitter, Instagram, Dribbble } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterAgencySocial {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  href: string;
}

export interface FooterAgencyMinimalProps {
  className?: string;
  studioName?: string;
  tagline?: string;
  email?: string;
  headline?: string;
  social?: FooterAgencySocial[];
  navLinks?: string[];
}

const DEFAULT_SOCIAL: FooterAgencySocial[] = [
  { icon: Dribbble, label: "Dribbble", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

const DEFAULT_NAV_LINKS = ["Work", "About", "Imprint", "Privacy"];

export function FooterAgencyMinimal({
  className,
  studioName = "Studio Field",
  tagline = "Independent design practice. Designing brands and products that move quietly through the world.",
  email = "hello@studiofield.co",
  headline = "Let's make something unforgettable.",
  social = DEFAULT_SOCIAL,
  navLinks = DEFAULT_NAV_LINKS,
}: FooterAgencyMinimalProps) {
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
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16"
        >
          <div>
            <h2 id={headingId} className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              {headline}
            </h2>
            <a
              href={`mailto:${email}`}
              className="group mt-6 inline-flex items-center gap-2 text-lg font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
            >
              {email}
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </a>
          </div>

          <div className="flex flex-col justify-between gap-8 md:items-end md:text-right">
            <div>
              <div className="text-sm font-bold tracking-tight text-foreground">{studioName}</div>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground md:ml-auto">{tagline}</p>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {year} {studioName}. All rights reserved.</span>
          <nav aria-label="Footer secondary" className="flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l} href="/" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">{l}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default FooterAgencyMinimal;
