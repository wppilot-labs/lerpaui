"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Compass,
  Sparkles,
  Shield,
  Rocket,
  HandHeart,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface CultureValue {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone: string;
}

export interface TeamCultureValuesGridProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  values?: CultureValue[];
}

const DEFAULT_VALUES: CultureValue[] = [
  {
    id: "1",
    icon: Compass,
    title: "Default to clarity",
    body: "Write it down. Decisions made in writing scale better than decisions made in meetings.",
    tone: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "2",
    icon: Heart,
    title: "Care about the details",
    body: "The 15th iteration is where polish lives. We sweat the millisecond and the curly quote.",
    tone: "from-pink-500 to-rose-500",
  },
  {
    id: "3",
    icon: Sparkles,
    title: "Make taste a craft",
    body: "Strong opinions, loosely held. We study reference and earn intuition by shipping.",
    tone: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    icon: Shield,
    title: "Earn customer trust",
    body: "We don't ship breaking changes lightly. Predictability is a feature we never compromise.",
    tone: "from-emerald-500 to-teal-500",
  },
  {
    id: "5",
    icon: Rocket,
    title: "Move with momentum",
    body: "Speed beats elegance early. Then elegance compounds. Iterate, observe, repeat.",
    tone: "from-cyan-500 to-blue-500",
  },
  {
    id: "6",
    icon: HandHeart,
    title: "Be kind on purpose",
    body: "Software is a long game. Trust is a long game. Patience and warmth are an unfair advantage.",
    tone: "from-indigo-500 to-purple-500",
  },
];

export function TeamCultureValuesGrid({
  className,
  eyebrow = "Culture",
  title = "How we work, in six lines",
  subtitle = "Our operating values. Honest, short, and lived.",
  values = DEFAULT_VALUES,
}: TeamCultureValuesGridProps) {
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
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.li
              key={v.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow",
                  v.tone,
                )}
                aria-hidden
              >
                <v.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamCultureValuesGrid;
