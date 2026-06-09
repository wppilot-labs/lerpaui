"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Database, MessageSquare, Image as ImageIcon, Video, Search } from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingPayAsYouGoProps {
  className?: string;
}

interface Unit {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  unit: string;
  price: string;
  freeTier?: string;
}

const UNITS: Unit[] = [
  {
    icon: Zap,
    label: "API calls",
    description: "Read, write, and stream events",
    unit: "1k requests",
    price: "$0.80",
    freeTier: "10k / mo free",
  },
  {
    icon: Database,
    label: "Storage",
    description: "Object and blob storage, replicated",
    unit: "GB / mo",
    price: "$0.12",
    freeTier: "5 GB free",
  },
  {
    icon: MessageSquare,
    label: "Chat tokens",
    description: "Input + output tokens billed together",
    unit: "1M tokens",
    price: "$2.40",
  },
  {
    icon: ImageIcon,
    label: "Image generation",
    description: "1024×1024 standard quality",
    unit: "image",
    price: "$0.018",
  },
  {
    icon: Video,
    label: "Video minutes",
    description: "Transcoded and stored 30 days",
    unit: "minute",
    price: "$0.04",
  },
  {
    icon: Search,
    label: "Vector search",
    description: "Embedding-backed semantic search",
    unit: "1k queries",
    price: "$0.20",
    freeTier: "1k / mo free",
  },
];

export function PricingPayAsYouGo({ className }: PricingPayAsYouGoProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Pay as you go
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Per-unit prices, no surprises
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Pre-paid balance, billed by usage. Generous free tier on most resources.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((u, i) => (
            <motion.div
              key={u.label}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <u.icon className="h-4 w-4" aria-hidden />
                </span>
                {u.freeTier && (
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {u.freeTier}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {u.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{u.description}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {u.price}
                </span>
                <span className="text-sm text-muted-foreground">/{u.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Top up balance
          </button>
        </div>
      </div>
    </section>
  );
}

export default PricingPayAsYouGo;
