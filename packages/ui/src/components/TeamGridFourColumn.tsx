"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Twitter, Users } from "lucide-react";
import { cn } from "../lib/cn";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  tone: string;
}

export interface TeamGridFourColumnProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: "1", name: "Ada Tang", role: "Founder, CEO", initials: "AT", bio: "Twice-shipped open-source design systems.", tone: "from-violet-500 to-fuchsia-500" },
  { id: "2", name: "Luis Romero", role: "Co-founder, CTO", initials: "LR", bio: "Browser internals, animation, color science.", tone: "from-cyan-500 to-blue-500" },
  { id: "3", name: "Saanvi Rao", role: "Head of Design", initials: "SR", bio: "Lead designer behind three rebrands.", tone: "from-emerald-500 to-teal-500" },
  { id: "4", name: "Milo Chen", role: "Staff Engineer", initials: "MC", bio: "Maintains the core animation primitives.", tone: "from-amber-500 to-orange-500" },
  { id: "5", name: "Naomi Park", role: "Marketing Lead", initials: "NP", bio: "Storytelling and growth for technical brands.", tone: "from-pink-500 to-rose-500" },
  { id: "6", name: "Reza Hosseini", role: "Senior Designer", initials: "RH", bio: "Component-system specialist.", tone: "from-indigo-500 to-purple-500" },
  { id: "7", name: "Mei Wong", role: "DevRel", initials: "MW", bio: "Loves a good migration guide.", tone: "from-red-500 to-orange-500" },
  { id: "8", name: "Tobias Klein", role: "Eng Manager", initials: "TK", bio: "Keeps shipping a kind, sustainable habit.", tone: "from-sky-500 to-blue-500" },
];

export function TeamGridFourColumn({
  className,
  eyebrow = "The team",
  title = "Small team, sharp craft",
  subtitle = "We're product people who care deeply about the details.",
  members = DEFAULT_MEMBERS,
}: TeamGridFourColumnProps) {
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
            <Users className="h-3.5 w-3.5" aria-hidden />
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

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <motion.li
              key={m.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={cn(
                  "grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-md",
                  m.tone,
                )}
                aria-hidden
              >
                {m.initials}
              </div>
              <div className="mt-4 font-semibold text-foreground">{m.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.role}</div>
              <p className="mt-3 text-sm text-foreground/80">{m.bio}</p>
              <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href="/"
                  aria-label={`${m.name} on LinkedIn`}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden />
                </a>
                <a
                  href="/"
                  aria-label={`${m.name} on Twitter`}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamGridFourColumn;
