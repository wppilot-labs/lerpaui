"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const CLIENTS = ["Northwind", "Vela", "Atlas", "Mono"];

export interface HeroSectionAgencyProps {
  className?: string;
}

export function HeroSectionAgency({ className }: HeroSectionAgencyProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/45 p-8 shadow-xl backdrop-blur-xl font-sans text-foreground",
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          A brand &amp; product design studio
        </span>

        <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
          We craft brands that
          <br />
          <span className="text-primary">refuse to blend in.</span>
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          From identity to interface, we partner with ambitious teams to design
          work that earns attention and drives growth.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/"
            className="rounded-xl border border-border/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/40"
          >
            View our work
          </a>
        </div>

        <div className="mt-8 border-t border-border/50 pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Trusted by teams at
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            {CLIENTS.map((c) => (
              <span
                key={c}
                className="text-sm font-bold tracking-tight text-muted-foreground/60"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
