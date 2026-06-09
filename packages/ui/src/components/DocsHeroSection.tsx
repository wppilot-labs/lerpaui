"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface DocsHeroSectionProps {
  className?: string;
}

export function DocsHeroSection({ className }: DocsHeroSectionProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-8 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4">
        <BookOpen className="w-3.5 h-3.5" />
        Documentation
      </span>

      <h2 className="text-3xl font-bold tracking-tight">Build with Acme</h2>
      <p className="mt-2 text-sm text-muted-foreground/65 leading-relaxed max-w-sm mx-auto">
        Everything you need to integrate, customize, and ship. Guides, API reference, and examples.
      </p>

      <div className="relative mt-6 max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
        <label htmlFor="docs-hero-search" className="sr-only">
          Search the documentation
        </label>
        <input
          id="docs-hero-search"
          type="search"
          placeholder="Search docs…"
          className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-xl pl-9 pr-16 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none placeholder:text-muted-foreground/40"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.06] text-muted-foreground/50">
          ⌘K
        </kbd>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground/50">
        <span>Popular:</span>
        {["Quickstart", "Auth", "Webhooks"].map((p) => (
          <a
            key={p}
            href="/"
            className="inline-flex items-center gap-0.5 text-foreground/70 hover:text-foreground transition-colors"
          >
            {p}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>
    </motion.section>
  );
}
