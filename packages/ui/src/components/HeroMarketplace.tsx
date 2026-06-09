"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Sparkles, Tag } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroMarketplaceProps {
  className?: string;
}

interface Listing {
  title: string;
  category: string;
  price: string;
  rating: string;
}

const FEATURED: Listing[] = [
  { title: "Stripe Connect Kit", category: "Payments", price: "$49", rating: "4.9" },
  { title: "Realtime Chat UI", category: "Components", price: "$29", rating: "4.8" },
  { title: "Analytics Dashboard", category: "Templates", price: "Free", rating: "4.9" },
  { title: "Auth Hardening Bundle", category: "Security", price: "$89", rating: "5.0" },
];

const CHIPS = ["Templates", "Components", "Plugins", "Themes", "Snippets"];

/** Marketplace hero with prominent search and featured listings grid below. */
export function HeroMarketplace({ className }: HeroMarketplaceProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Discover{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              4,200+ assets
            </span>{" "}
            built by indie makers.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Templates, plugins, and full-stack kits — vetted, versioned, and ready to ship.
          </motion.p>

          <motion.form
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm transition-shadow hover:shadow-md"
          >
            <Search className="ml-2 h-5 w-5 flex-shrink-0 text-muted-foreground" aria-hidden />
            <label htmlFor="hero-marketplace-q" className="sr-only">
              Search the marketplace
            </label>
            <input
              id="hero-marketplace-q"
              type="search"
              placeholder="Search templates, components, plugins..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Search
            </button>
          </motion.form>

          <motion.ul
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            {CHIPS.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  {c}
                </button>
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURED.map((item, i) => (
            <motion.a
              key={item.title}
              href="/"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              className="group rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-[5/4] overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5">
                <div className="grid h-full w-full place-items-center text-primary/40">
                  <Sparkles className="h-8 w-8" aria-hidden />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3 w-3" aria-hidden />
                {item.category}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
                {item.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.price}</span>
                <span className="text-muted-foreground">★ {item.rating}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroMarketplace;
