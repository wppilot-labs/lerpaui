"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, GitFork, Copy, Github, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroOpenSourceProps {
  className?: string;
  /** GitHub-style repo string e.g. "acme/forge". */
  repo?: string;
  /** Install command rendered in the code block. */
  installCommand?: string;
  /** Star count rendered in the badge. */
  stars?: string;
  /** Fork count rendered in the badge. */
  forks?: string;
}

const BADGES = [
  { label: "MIT licensed", tone: "blue" },
  { label: "TypeScript", tone: "violet" },
  { label: "Zero deps", tone: "emerald" },
];

/** Open source hero with repo badges, install command snippet, and star count. */
export function HeroOpenSource({
  className,
  repo = "acme/forge",
  installCommand = "npm install @acme/forge",
  stars = "24.8k",
  forks = "1.6k",
}: HeroOpenSourceProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.18_260/0.18),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full text-foreground/[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hos-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hos-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.a
          href={`https://github.com/${repo}`}
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm hover:bg-card"
        >
          <Github className="h-3.5 w-3.5" aria-hidden />
          <span className="font-mono text-foreground/80">{repo}</span>
          <span className="flex items-center gap-1 text-foreground/80">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
            {stars}
          </span>
          <span className="flex items-center gap-1 text-foreground/60">
            <GitFork className="h-3 w-3" aria-hidden />
            {forks}
          </span>
        </motion.a>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          The open source build system{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
            you actually enjoy.
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Zero config, blazingly fast, fully transparent. Audit the source, fork the repo, ship in
          production today.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl border bg-card p-1.5 shadow-sm"
        >
          <span className="select-none px-3 font-mono text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <code className="flex-1 truncate font-mono text-sm text-foreground">{installCommand}</code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy install command"
            className="inline-flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          </button>
        </motion.div>

        <motion.ul
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {BADGES.map((b) => (
            <li
              key={b.label}
              className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold text-foreground/80"
            >
              {b.label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default HeroOpenSource;
