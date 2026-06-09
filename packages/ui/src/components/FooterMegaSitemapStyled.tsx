"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Send, Check, Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterMegaSitemapStyledProps {
  className?: string;
  brandName?: string;
}

const COLUMNS: Array<{ heading: string; links: string[] }> = [
  { heading: "Product", links: ["Component Library", "Theme Studio", "CLI", "Templates", "Showcase", "Roadmap"] },
  { heading: "Resources", links: ["Documentation", "API Reference", "Guides", "Changelog", "Blog", "Status"] },
  { heading: "Company", links: ["About", "Careers", "Press Kit", "Contact", "Partners", "Security"] },
  { heading: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "DPA", "SOC 2 Report", "Subprocessors"] },
];

const SOCIAL: Array<{ icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; label: string }> = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export function FooterMegaSitemapStyled({
  className,
  brandName = "Lerpa UI",
}: FooterMegaSitemapStyledProps) {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const headingId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden border-t border-border bg-background px-6 py-12 md:py-16",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.18_280/0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm md:grid-cols-[1.4fr_1fr] md:items-center"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Newsletter
            </div>
            <h2 id={headingId} className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Build better, faster.
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              One email a week with new components, design patterns, and the occasional hot take. No spam.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="fmss-email" className="sr-only">Email address</label>
            <input
              id="fmss-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              {subscribed ? (<><Check className="h-4 w-4" aria-hidden /> Subscribed</>) : (<>Subscribe <Send className="h-4 w-4" aria-hidden /></>)}
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              {brandName}
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Free, accessible, copy-paste React components. Built for the next era of product teams.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href="/"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {brandName} Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              All systems operational
            </span>
            <span>v4.2.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterMegaSitemapStyled;
