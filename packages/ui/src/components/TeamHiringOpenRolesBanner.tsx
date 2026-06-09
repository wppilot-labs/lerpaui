"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Briefcase, MapPin, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface OpenRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  isNew?: boolean;
}

export interface TeamHiringOpenRolesBannerProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  roles?: OpenRole[];
}

const DEFAULT_ROLES: OpenRole[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    department: "Design",
    location: "Remote · Americas",
    type: "Full-time",
    isNew: true,
  },
  {
    id: "2",
    title: "Staff Frontend Engineer",
    department: "Engineering",
    location: "Remote · EU",
    type: "Full-time",
  },
  {
    id: "3",
    title: "Developer Advocate",
    department: "DevRel",
    location: "Remote · Global",
    type: "Full-time",
    isNew: true,
  },
  {
    id: "4",
    title: "Technical Writer",
    department: "Docs",
    location: "Remote · Global",
    type: "Contract",
  },
  {
    id: "5",
    title: "Customer Engineer",
    department: "Support",
    location: "Berlin or Remote",
    type: "Full-time",
  },
];

export function TeamHiringOpenRolesBanner({
  className,
  eyebrow = "We're hiring",
  title = "Build the next decade of UI tooling with us",
  description = "Fully remote, async-first, and committed to craft. We invest in our people the way we invest in our product.",
  ctaLabel = "View all roles",
  ctaHref = "#",
  roles = DEFAULT_ROLES,
}: TeamHiringOpenRolesBannerProps) {
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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm md:grid-cols-[1.4fr_1fr]"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {eyebrow}
            </span>
            <h2
              id={headingId}
              className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="bg-gradient-to-br from-primary to-accent bg-clip-text text-6xl font-semibold tracking-tight text-transparent">
              {roles.length}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Open roles</div>
            <a
              href={ctaHref}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              {ctaLabel}
            </a>
          </div>
        </motion.div>

        <ul className="mt-8 grid grid-cols-1 gap-3">
          {roles.map((r, i) => (
            <motion.li
              key={r.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <a
                href="/"
                className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-foreground group-hover:text-primary">
                        {r.title}
                      </div>
                      {r.isNew && (
                        <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.department}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {r.location}
                  </span>
                  <span className="rounded-full border border-border/60 bg-background px-2 py-0.5 font-mono">
                    {r.type}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamHiringOpenRolesBanner;
