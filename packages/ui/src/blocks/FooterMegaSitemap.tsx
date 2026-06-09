"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterMegaSitemapProps
  extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Components", href: "#components" },
      { label: "Blocks", href: "#blocks" },
      { label: "Theme Studio", href: "#theme-studio" },
      { label: "AI Builder", href: "#ai-builder" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Accessibility", href: "#a11y" },
      { label: "Performance", href: "#perf" },
      { label: "Templates", href: "#templates" },
      { label: "Showcase", href: "#showcase" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub", href: "#gh" },
      { label: "Discord", href: "#discord" },
      { label: "Twitter / X", href: "#x" },
      { label: "Blog", href: "#blog" },
      { label: "Request a component", href: "#request" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Customers", href: "#customers" },
      { label: "Pricing", href: "#pricing" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

const REGIONS = [
  { value: "us", label: "United States (USD)" },
  { value: "eu", label: "European Union (EUR)" },
  { value: "uk", label: "United Kingdom (GBP)" },
  { value: "jp", label: "Japan (JPY)" },
  { value: "in", label: "India (INR)" },
];

const SOCIAL = [
  { Icon: Github, label: "GitHub", href: "#gh" },
  { Icon: Twitter, label: "Twitter", href: "#x" },
  { Icon: Linkedin, label: "LinkedIn", href: "#li" },
  { Icon: Youtube, label: "YouTube", href: "#yt" },
];

export function FooterMegaSitemap({
  brand = "Lerpa UI",
  tagline = "Open-source React components for teams who treat the interface as the product.",
  columns = DEFAULT_COLUMNS,
  newsletterTitle = "Ship-log newsletter",
  newsletterDescription = "Monthly digest of new components, blocks, and motion patterns. No spam.",
  onNewsletterSubmit,
  className,
  ...rest
}: FooterMegaSitemapProps) {
  const prefersHook = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const reduced = prefersHook || Boolean(fmReduced);

  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "ok">("idle");
  const [region, setRegion] = React.useState<string>(REGIONS[0]!.value);
  const emailId = React.useId();
  const regionId = React.useId();

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.includes("@")) return;
      onNewsletterSubmit?.(email);
      setStatus("ok");
      setEmail("");
      window.setTimeout(() => setStatus("idle"), 3200);
    },
    [email, onNewsletterSubmit]
  );

  const safeCols = columns.length ? columns : DEFAULT_COLUMNS;

  return (
    <footer
      {...rest}
      aria-labelledby="footer-heading"
      className={cn(
        "relative w-full border-t border-border bg-card text-card-foreground",
        className
      )}
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm">L</span>
                </span>
                {brand}
              </span>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 max-w-md"
              aria-describedby={`${emailId}-help`}
            >
              <p className="text-sm font-semibold text-foreground">
                {newsletterTitle}
              </p>
              <p
                id={`${emailId}-help`}
                className="mt-1 text-xs text-muted-foreground"
              >
                {newsletterDescription}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <label htmlFor={emailId} className="sr-only">
                  Email address
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <p
                aria-live="polite"
                className={cn(
                  "mt-2 text-xs text-emerald-600 dark:text-emerald-400 transition-opacity",
                  status === "ok" ? "opacity-100" : "opacity-0"
                )}
              >
                Subscribed. Check your inbox.
              </p>
            </form>

            <div className="mt-8 flex items-center gap-2">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3"
          >
            {safeCols.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {brand}. MIT licensed. Made with
            care.
          </p>

          <div className="flex items-center gap-2">
            <Globe
              className="h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <label htmlFor={regionId} className="sr-only">
              Region
            </label>
            <select
              id={regionId}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterMegaSitemap;
