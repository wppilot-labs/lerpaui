"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Atom,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Orbit,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "../lib/cn";

interface LogoCloudBasicProps {
  className?: string;
}

const LOGOS = [
  { name: "Atomic", Icon: Atom },
  { name: "Cumulus", Icon: Cloud },
  { name: "Helix", Icon: Cpu },
  { name: "Datastrand", Icon: Database },
  { name: "Branchlet", Icon: GitBranch },
  { name: "Pangea", Icon: Globe },
  { name: "Stackline", Icon: Layers },
  { name: "Orbiteer", Icon: Orbit },
  { name: "Trajectory", Icon: Rocket },
  { name: "Sentinel", Icon: ShieldCheck },
  { name: "Volt", Icon: Zap },
  { name: "Sparkrun", Icon: Sparkles },
];

export function LogoCloudBasic({ className }: LogoCloudBasicProps) {
  const reduced = useReducedMotion();
  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border/50 bg-card/30 px-6 py-12 backdrop-blur-xl sm:px-10 sm:py-16",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="logo-cloud-basic-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-10 text-center">
        <div className="mx-auto max-w-xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Trusted partners
          </span>
          <h2
            id="logo-cloud-basic-heading"
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            Powering teams at{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              12,400+ companies
            </span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            From global enterprises to indie studios shipping the future.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {LOGOS.map(({ name, Icon }, i) => (
            <motion.li
              key={name}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.04 }}
              className="group flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
            >
              <Icon
                className="h-4 w-4 text-muted-foreground/70 transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                {name}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
