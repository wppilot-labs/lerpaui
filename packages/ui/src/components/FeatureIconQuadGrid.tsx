"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Zap, GitBranch, Globe } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureIconQuadCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export interface FeatureIconQuadGridProps {
  className?: string;
  title?: string;
  subtitle?: string;
  cards?: FeatureIconQuadCard[];
}

const DEFAULT_CARDS: FeatureIconQuadCard[] = [
  {
    icon: Shield,
    title: "Secure by default",
    body: "SAML SSO, SCIM provisioning, and audit logs included on every plan from day one.",
  },
  {
    icon: Zap,
    title: "Wire-speed performance",
    body: "Built on Rust with a zero-copy parser. Median request completes in under 9 ms.",
  },
  {
    icon: GitBranch,
    title: "Git-native workflow",
    body: "Branch, review, and merge environments the same way you branch and merge code.",
  },
  {
    icon: Globe,
    title: "Edge everywhere",
    body: "Deploy to 14 regions in one click and serve your users from the closest one automatically.",
  },
];

/** Four icon-led feature cards arranged in a responsive 2x2 grid. */
export function FeatureIconQuadGrid({
  className,
  title = "Four reasons engineering teams switch.",
  subtitle = "And usually never look back.",
  cards = DEFAULT_CARDS,
}: FeatureIconQuadGridProps) {
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
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {cards.map((c, i) => (
            <motion.li
              key={c.title}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FeatureIconQuadGrid;
