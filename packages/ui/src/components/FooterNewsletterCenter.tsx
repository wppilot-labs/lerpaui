"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, Check, Sparkles, Twitter, Github, Linkedin } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterNewsletterSocial {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
}

export interface FooterNewsletterCenterProps {
  className?: string;
  brandName?: string;
  audienceCount?: string;
  eyebrow?: string;
  description?: string;
  placeholder?: string;
  social?: FooterNewsletterSocial[];
  footerLinks?: string[];
}

const DEFAULT_SOCIAL: FooterNewsletterSocial[] = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
];

const DEFAULT_FOOTER_LINKS = ["Pricing", "Docs", "Changelog", "Blog", "Privacy", "Terms"];

export function FooterNewsletterCenter({
  className,
  brandName = "Lerpa UI",
  audienceCount = "28,400+",
  eyebrow = "Weekly newsletter",
  description = "Every Tuesday. New components, design patterns, and field notes. One click to unsubscribe.",
  placeholder = "you@company.com",
  social = DEFAULT_SOCIAL,
  footerLinks = DEFAULT_FOOTER_LINKS,
}: FooterNewsletterCenterProps) {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const headingId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <footer
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden border-t border-border bg-background px-6 py-12 md:py-16",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,oklch(0.78_0.18_290/0.18),transparent_60%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </div>
          <h2 id={headingId} className="mt-5 text-balance text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Join <span className="text-primary">{audienceCount}</span> builders.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="fnc-email" className="sr-only">Email address</label>
            <input
              id="fnc-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              {done ? (<><Check className="h-4 w-4" aria-hidden /> Subscribed</>) : (<>Subscribe <Send className="h-4 w-4" aria-hidden /></>)}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center -space-x-2" aria-hidden>
            {[300, 340, 200, 260, 60].map((hue) => (
              <span
                key={hue}
                className="inline-block h-7 w-7 rounded-full border-2 border-background"
                style={{ background: `linear-gradient(135deg, oklch(0.7 0.18 ${hue}), oklch(0.55 0.22 ${(hue + 40) % 360}))` }}
              />
            ))}
            <span className="ml-3 text-xs text-muted-foreground">Loved by teams at Linear, Vercel, Stripe + more</span>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-14 max-w-5xl border-t border-border pt-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm font-bold tracking-tight text-foreground">{brandName}</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            {footerLinks.map((l) => (
              <a key={l} href="/" className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            {social.map((s) => (
              <a key={s.label} href="/" aria-label={s.label} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                <s.icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} {brandName}. We respect your inbox.
        </div>
      </div>
    </footer>
  );
}

export default FooterNewsletterCenter;
