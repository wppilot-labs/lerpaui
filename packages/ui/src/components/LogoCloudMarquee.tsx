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

interface LogoCloudMarqueeProps {
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
];

function LogoRow() {
  return (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {LOGOS.map(({ name, Icon }) => (
        <div
          key={name}
          className="flex items-center gap-2.5 text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="whitespace-nowrap text-base font-semibold tracking-wide">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LogoCloudMarquee({ className }: LogoCloudMarqueeProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border/50 bg-card/30 px-6 py-12 backdrop-blur-xl sm:py-16",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="logo-cloud-marquee-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative space-y-8 text-center">
        <div className="mx-auto max-w-xl space-y-3 px-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Customer roster
          </span>
          <h2
            id="logo-cloud-marquee-heading"
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            Shipping with the world&apos;s best teams
          </h2>
        </div>

        <div
          className="relative -mx-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          aria-hidden={!reduced ? "true" : undefined}
        >
          {reduced ? (
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 px-6">
              {LOGOS.map(({ name, Icon }) => (
                <div key={name} className="flex items-center gap-2.5 text-muted-foreground/70">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-base font-semibold tracking-wide">{name}</span>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              <LogoRow />
              <LogoRow />
            </motion.div>
          )}
        </div>

        {reduced ? null : (
          <span className="sr-only">
            Logos of partner companies: {LOGOS.map((l) => l.name).join(", ")}.
          </span>
        )}
      </div>
    </section>
  );
}
