"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import { cn } from "../lib/cn";

export interface PortfolioProject {
  title: string;
  tag: string;
  gradient: string;
}

export interface HeroPortfolioCreatorProps {
  className?: string;
  status?: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  worksLabel?: string;
  archiveLabel?: string;
  projects?: PortfolioProject[];
}

const DEFAULT_PROJECTS: PortfolioProject[] = [
  { title: "Heron Studio", tag: "Brand", gradient: "from-rose-400 via-amber-300 to-orange-200" },
  { title: "Pulse OS", tag: "Product", gradient: "from-sky-400 via-violet-400 to-fuchsia-300" },
  { title: "Forge Type", tag: "Typeface", gradient: "from-emerald-400 via-teal-300 to-cyan-200" },
  { title: "Cabin Tools", tag: "Web", gradient: "from-fuchsia-400 via-pink-300 to-rose-200" },
  { title: "Atlas Map", tag: "Identity", gradient: "from-orange-400 via-rose-300 to-pink-200" },
];

/** Creator portfolio hero with short bio and a ribbon of project thumbnails. */
export function HeroPortfolioCreator({
  className,
  status = "Available for projects",
  title = "Hi, I'm Yara. I design",
  highlightedTitle = "identities that ship.",
  description = "Independent designer, 12 years in. I partner with founders on the brand, web, and product layers that make a company feel inevitable.",
  worksLabel = "Selected work",
  archiveLabel = "View archive",
  projects = DEFAULT_PROJECTS,
}: HeroPortfolioCreatorProps) {
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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <motion.span
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              {status}
            </motion.span>

            <motion.h1
              id={headingId}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              {title}{" "}
              <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
                {highlightedTitle}
              </span>
            </motion.h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {description}
            </motion.p>

            <motion.ul
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-6 flex items-center gap-2"
            >
              {[
                { href: "#mail", icon: Mail, label: "Email" },
                { href: "#gh", icon: Github, label: "GitHub" },
                { href: "#in", icon: Linkedin, label: "LinkedIn" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-label={link.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <link.icon className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            aria-hidden
            className="hidden h-40 w-40 rounded-full bg-gradient-to-br from-primary/40 via-accent/40 to-primary/20 shadow-2xl shadow-primary/20 md:block"
          />
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {worksLabel}
            </h2>
            <a href="#archive" className="text-xs font-semibold text-primary hover:underline">
              {archiveLabel}
            </a>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {projects.map((p) => (
              <li key={p.title}>
                <a href="/" className="group block rounded-2xl border bg-card p-2 shadow-sm transition-shadow hover:shadow-md">
                  <div className={cn("aspect-[4/5] rounded-xl bg-gradient-to-br", p.gradient)} />
                  <div className="px-1 pb-1 pt-2">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{p.tag}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroPortfolioCreator;
