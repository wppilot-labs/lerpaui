"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureChecklistColumn {
  title: string;
  features: string[];
}

export interface FeatureCheckmarkColumnsProps {
  className?: string;
  title?: string;
  subtitle?: string;
  columns?: FeatureChecklistColumn[];
}

const DEFAULT_COLUMNS: FeatureChecklistColumn[] = [
  {
    title: "For builders",
    features: [
      "TypeScript-first SDK with full type inference",
      "Local development with one CLI command",
      "Git-style branching for every environment",
      "Real-time logs with structured search",
      "Open-source self-hosting available",
      "Webhooks with at-least-once delivery",
    ],
  },
  {
    title: "For ops & security",
    features: [
      "SOC 2 Type II and HIPAA compliant",
      "SAML SSO and SCIM provisioning included",
      "Granular role-based access controls",
      "Tamper-evident audit logs, 7-year retention",
      "Customer-managed encryption keys",
      "99.99% uptime SLA on the Enterprise plan",
    ],
  },
];

/** Two side-by-side columns of feature lists with checkmark bullets. */
export function FeatureCheckmarkColumns({
  className,
  title = "Built for the whole team.",
  subtitle = "Developer ergonomics that engineers love, plus the controls your security team will sign off on.",
  columns = DEFAULT_COLUMNS,
}: FeatureCheckmarkColumnsProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
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

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {columns.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: ci * 0.08 }}
              className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + fi * 0.04 }}
                    className="flex items-start gap-3 text-sm text-foreground/90"
                  >
                    <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span>{f}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureCheckmarkColumns;
