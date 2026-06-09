"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bookmark, Calendar, Clock, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

interface BlogHeroFeaturedProps {
  className?: string;
}

export function BlogHeroFeatured({ className }: BlogHeroFeaturedProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 p-5 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="blog-hero-featured-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 -right-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <motion.article
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-500/30" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%)]" aria-hidden="true" />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Featured
          </div>
          <button
            type="button"
            aria-label="Bookmark featured article"
            className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">Engineering</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" aria-hidden="true" />
              May 22, 2026
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" aria-hidden="true" />
              12 min read
            </span>
          </div>

          <h1 id="blog-hero-featured-heading" className="text-xl font-black tracking-tight text-foreground">
            The architecture behind <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">5,000+ shipping components</span>
          </h1>
          <p className="text-xs leading-relaxed text-muted-foreground/80">
            A behind-the-scenes look at how we keep performance, accessibility, and design language coherent across every block in the registry.
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-black text-white" aria-hidden="true">
                AT
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-bold text-foreground">Ada Tang</div>
                <div className="text-[9px] text-muted-foreground/60">Staff Engineer</div>
              </div>
            </div>
            <a
              href="/"
              className="group inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:brightness-110"
            >
              Read article
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
