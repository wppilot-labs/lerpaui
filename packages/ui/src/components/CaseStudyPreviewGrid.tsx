"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Briefcase, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

interface CaseStudyPreviewGridProps {
  className?: string;
}

interface CaseStudy {
  id: string;
  brand: string;
  industry: string;
  outcome: string;
  metric: string;
  tone: string;
  href: string;
}

const STUDIES: CaseStudy[] = [
  {
    id: "northwind",
    brand: "Northwind",
    industry: "Fintech",
    outcome: "Cut design-to-ship time by 4x across 12 product teams.",
    metric: "+62% sprint velocity",
    tone: "from-violet-500/30 via-fuchsia-500/15 to-transparent",
    href: "#",
  },
  {
    id: "orbitpay",
    brand: "OrbitPay",
    industry: "Payments",
    outcome: "Pricing page redesign lifted free-to-paid conversion immediately.",
    metric: "+38% conversion",
    tone: "from-cyan-500/30 via-blue-500/15 to-transparent",
    href: "#",
  },
  {
    id: "lumen",
    brand: "Lumen Labs",
    industry: "AI Tooling",
    outcome: "Shipped enterprise dashboards without growing the design team.",
    metric: "0 new designers hired",
    tone: "from-emerald-500/30 via-teal-500/15 to-transparent",
    href: "#",
  },
];

export function CaseStudyPreviewGrid({ className }: CaseStudyPreviewGridProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 px-6 py-10 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="case-study-grid-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 right-1/3 h-48 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative space-y-6">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
              <Briefcase className="h-3 w-3" />
              Case studies
            </span>
            <h2 id="case-study-grid-heading" className="text-base font-black tracking-tight">
              Real teams. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Real outcomes.</span>
            </h2>
          </div>
          <a
            href="/"
            className="hidden text-[10px] font-bold uppercase tracking-wider text-primary hover:underline sm:inline-flex"
          >
            See all
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STUDIES.map((s, i) => (
            <motion.li
              key={s.id}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.07 }}
            >
              <a
                href={s.href}
                className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:border-primary/30"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-80",
                    s.tone,
                  )}
                  aria-hidden="true"
                />
                <div className="relative space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-black text-foreground">{s.brand}</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        {s.industry}
                      </div>
                    </div>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-muted-foreground/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground/85">
                    {s.outcome}
                  </p>
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-background/40 px-2 py-1 text-[10px] font-bold text-emerald-400">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    {s.metric}
                  </div>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 text-[10px] text-muted-foreground/75">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>Average customer ships <strong className="text-foreground">3.4x faster</strong> after their first quarter.</span>
        </div>
      </div>
    </section>
  );
}
