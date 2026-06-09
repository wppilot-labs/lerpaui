"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Twitter, Mail, Crown } from "lucide-react";
import { cn } from "../lib/cn";

export interface LeadershipLead {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  tone: string;
}

export interface TeamLeadershipSpotlightProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  spotlight?: LeadershipLead;
  leadership?: LeadershipLead[];
}

const DEFAULT_SPOTLIGHT: LeadershipLead = {
  id: "ceo",
  name: "Ada Tang",
  role: "Founder & CEO",
  initials: "AT",
  bio: "Designer-engineer building tools for product teams. Previously shipped design systems at Lumen Labs and Northwind, where she ran a 24-person platform org. She believes the right defaults beat any onboarding doc.",
  tone: "from-violet-500 via-fuchsia-500 to-rose-500",
};

const DEFAULT_LEADERSHIP: LeadershipLead[] = [
  { id: "cto", name: "Luis Romero", role: "Co-founder & CTO", initials: "LR", bio: "Web platform, performance, animation.", tone: "from-cyan-500 to-blue-500" },
  { id: "design", name: "Saanvi Rao", role: "Head of Design", initials: "SR", bio: "Brand, narrative, and systems thinking.", tone: "from-emerald-500 to-teal-500" },
  { id: "eng", name: "Milo Chen", role: "VP Engineering", initials: "MC", bio: "Scaling a team that ships every week.", tone: "from-amber-500 to-orange-500" },
  { id: "ops", name: "Tobias Klein", role: "COO", initials: "TK", bio: "People, finance, and the boring magic.", tone: "from-pink-500 to-rose-500" },
];

export function TeamLeadershipSpotlight({
  className,
  eyebrow = "Leadership",
  title = "Who's steering the ship",
  spotlight = DEFAULT_SPOTLIGHT,
  leadership = DEFAULT_LEADERSHIP,
}: TeamLeadershipSpotlightProps) {
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
            <Crown className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid gap-6 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-[auto_1fr] md:p-10"
        >
          <div
            className={cn(
              "mx-auto grid h-32 w-32 place-items-center rounded-3xl bg-gradient-to-br text-3xl font-bold text-white shadow-lg md:h-40 md:w-40",
              spotlight.tone,
            )}
            aria-hidden
          >
            {spotlight.initials}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              {spotlight.role}
            </div>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {spotlight.name}
            </h3>
            <p className="mt-3 text-base text-muted-foreground">{spotlight.bio}</p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="/"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/"
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
              >
                <Twitter className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/"
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
              >
                <Mail className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </motion.div>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((l, i) => (
            <motion.li
              key={l.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br font-bold text-white",
                  l.tone,
                )}
                aria-hidden
              >
                {l.initials}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-primary">
                  {l.role}
                </div>
                <div className="mt-0.5 font-semibold text-foreground">{l.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{l.bio}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamLeadershipSpotlight;
