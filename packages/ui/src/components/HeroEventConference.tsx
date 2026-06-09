"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface ConferenceSpeaker {
  name: string;
  role: string;
  color: string;
}

export interface HeroEventConferenceProps {
  className?: string;
  dates?: string;
  location?: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  speakers?: ConferenceSpeaker[];
}

const DEFAULT_SPEAKERS: ConferenceSpeaker[] = [
  { name: "Mira Chen", role: "CEO, Loom", color: "from-rose-400 to-amber-300" },
  { name: "Dev Patel", role: "VP Eng, Linear", color: "from-sky-400 to-violet-400" },
  { name: "Sam Hayes", role: "Founder, Plain", color: "from-emerald-400 to-teal-300" },
  { name: "Yara Ortega", role: "DesignOps, Figma", color: "from-fuchsia-400 to-pink-300" },
  { name: "Theo Kim", role: "Staff Eng, Vercel", color: "from-orange-400 to-rose-300" },
];

/** Event conference hero with date, location, speaker faces, and CTA. */
export function HeroEventConference({
  className,
  dates = "Oct 14-16, 2026",
  location = "Lisbon · Online",
  title = "ShipConf 2026 —",
  highlightedTitle = "three days of craft.",
  description = "40+ talks, workshops, and unconference sessions from the engineers, designers, and founders shaping how teams build.",
  primaryCtaLabel = "Get a ticket",
  primaryCtaHref = "#tickets",
  secondaryCtaLabel = "View schedule",
  secondaryCtaHref = "#schedule",
  speakers = DEFAULT_SPEAKERS,
}: HeroEventConferenceProps) {
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
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {dates}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {location}
          </span>
        </motion.div>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          {title}{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            {highlightedTitle}
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={primaryCtaHref}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {primaryCtaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </a>
          <a
            href={secondaryCtaHref}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {secondaryCtaLabel}
          </a>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            <Users className="h-3.5 w-3.5" aria-hidden />
            Featuring
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {speakers.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "h-10 w-10 flex-shrink-0 rounded-full border-2 border-card bg-gradient-to-br",
                    s.color,
                  )}
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroEventConference;
