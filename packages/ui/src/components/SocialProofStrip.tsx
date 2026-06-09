"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, Quote, Star, TrendingUp, Users } from "lucide-react";
import { cn } from "../lib/cn";

interface SocialProofStripProps {
  className?: string;
}

const AVATARS = [
  { initials: "MK", color: "from-violet-500 to-fuchsia-500" },
  { initials: "RA", color: "from-cyan-500 to-blue-500" },
  { initials: "TS", color: "from-amber-400 to-orange-500" },
  { initials: "JL", color: "from-emerald-500 to-teal-500" },
  { initials: "PN", color: "from-pink-500 to-rose-500" },
];

const BADGES = [
  { Icon: Star, label: "4.9 / 5", sub: "G2 Crowd" },
  { Icon: Award, label: "Leader", sub: "Q2 2026" },
  { Icon: TrendingUp, label: "Fastest", sub: "Stripe Atlas" },
];

export function SocialProofStrip({ className }: SocialProofStripProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 px-6 py-8 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="social-proof-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-16 left-1/3 h-40 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <h2 id="social-proof-heading" className="sr-only">
        Social proof
      </h2>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2" aria-hidden="true">
            {AVATARS.map((a, i) => (
              <motion.div
                key={a.initials}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : i * 0.06 }}
                className={cn(
                  "h-8 w-8 rounded-full border-2 border-card bg-gradient-to-br text-[10px] font-black text-white",
                  "flex items-center justify-center shadow-md",
                  a.color,
                )}
              >
                {a.initials}
              </motion.div>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary/60 text-[9px] font-bold text-foreground">
              +9k
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
              <span className="ml-1 text-[10px] font-bold text-foreground">4.9</span>
            </div>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Users className="h-3 w-3" aria-hidden="true" />
              <span><strong className="text-foreground">9,420+</strong> teams ship faster</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {BADGES.map(({ Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5"
            >
              <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <div className="text-left leading-tight">
                <div className="text-[10px] font-black text-foreground">{label}</div>
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground/60">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5">
        <Quote className="absolute right-3 top-3 h-4 w-4 text-primary/40" aria-hidden="true" />
        <p className="pr-6 text-[11px] leading-relaxed text-muted-foreground/85">
          &ldquo;We replaced four tools in our stack and shipped our redesign in one weekend.&rdquo;
        </p>
        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Mira Kovac, Head of Design at Northwind
        </p>
      </div>
    </section>
  );
}
