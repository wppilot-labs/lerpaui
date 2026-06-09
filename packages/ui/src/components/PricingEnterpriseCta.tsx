"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Headphones,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface PricingEnterpriseCtaProps {
  className?: string;
}

const FEATURES = [
  {
    icon: Lock,
    title: "SSO + SCIM provisioning",
    desc: "SAML, OIDC, and automated user lifecycle from your IdP.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & security",
    desc: "SOC 2 Type II, HIPAA, GDPR. Custom DPAs and BAA available.",
  },
  {
    icon: Headphones,
    title: "Dedicated CSM",
    desc: "Named success manager, quarterly business reviews, 24/7 on-call.",
  },
];

const LOGOS = ["Acme", "Globex", "Initech", "Hooli", "Umbrella"];

export function PricingEnterpriseCta({ className }: PricingEnterpriseCtaProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-background to-muted/30 px-6 py-16 sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden />
            For enterprise
          </motion.span>

          <motion.h2
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Custom solutions for{" "}
            <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
              global teams
            </span>
          </motion.h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Volume pricing, compliance audits, custom contracts, and a team that
            cares about your rollout as much as you do.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Talk to sales
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
            <a
              href="#pdf"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Download datasheet
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 border-t border-border/40 pt-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              Trusted by Fortune 500
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-muted-foreground/70">
              {LOGOS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            What&apos;s included
          </h3>
          <ul className="mt-6 space-y-5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <f.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {f.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="mt-7 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">99.99% uptime SLA</strong>{" "}
                with financial credits for downtime.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingEnterpriseCta;
