"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Menu, X, Bookmark } from "lucide-react";
import { cn } from "../lib/cn";

export interface NavbarBlogMagazineProps {
  className?: string;
  brandName?: string;
  volumeLabel?: string;
  categories?: string[];
  searchPlaceholder?: string;
  subscribeLabel?: string;
}

const DEFAULT_CATEGORIES = [
  "Design",
  "Engineering",
  "Product",
  "Research",
  "Culture",
  "Interviews",
];

export function NavbarBlogMagazine({
  className,
  brandName = "The Journal",
  volumeLabel = "Vol. XXVII",
  categories = DEFAULT_CATEGORIES,
  searchPlaceholder = "Search articles...",
  subscribeLabel = "Subscribe",
}: NavbarBlogMagazineProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Magazine primary"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
        <a href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {brandName}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {volumeLabel}
          </span>
        </a>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              aria-label="Search articles"
              placeholder={searchPlaceholder}
              className="h-9 w-64 rounded-xl border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            />
          </div>
          <a
            href="/"
            aria-label="Saved"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
          >
            {subscribeLabel}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="navbar-blog-magazine-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <ul
        role="menubar"
        className="hidden flex-wrap items-center gap-1 px-6 py-2.5 md:flex"
      >
        {categories.map((c, i) => (
          <li key={c} role="none" className="flex items-center">
            {i > 0 && (
              <span aria-hidden className="px-1 text-muted-foreground/40">
                ·
              </span>
            )}
            <a
              href="/"
              role="menuitem"
              className="inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-medium uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
            >
              {c}
            </a>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-blog-magazine-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <ul className="grid grid-cols-2 gap-1 p-4">
              {categories.map((c) => (
                <li key={c}>
                  <a
                    href="/"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {c}
                  </a>
                </li>
              ))}
              <li className="col-span-2 mt-2 grid grid-cols-2 gap-2">
                <a
                  href="/"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground"
                >
                  Saved
                </a>
                <a
                  href="/"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {subscribeLabel}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavbarBlogMagazine;
