"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, Headphones, Apple } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroPodcastProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  episodeLabel?: string;
  episodeTitle?: string;
  platforms?: string[];
}

const BARS = [40, 65, 28, 78, 52, 90, 44, 70, 36, 84, 58, 96, 50, 72, 38, 88, 62, 100, 46, 74];

const DEFAULT_PLATFORMS = ["Apple", "Spotify", "Overcast", "RSS"];

/** Podcast hero with episode play control, waveform, and episode count. */
export function HeroPodcast({
  className,
  eyebrow = "142 episodes · weekly",
  title = "The Builders Hour —",
  highlightedTitle = "stories from the trenches.",
  description = "Long-form conversations with the engineers and founders behind the products you use every day.",
  episodeLabel = "Ep 142 · 48 min",
  episodeTitle = "Mira Chen on growing async-first",
  platforms = DEFAULT_PLATFORMS,
}: HeroPodcastProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [playing, setPlaying] = React.useState(false);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-12 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
        >
          <Headphones className="h-3.5 w-3.5" aria-hidden />
          {eyebrow}
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
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mx-auto mt-9 max-w-xl rounded-2xl border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-pressed={playing}
              aria-label={playing ? "Pause episode" : "Play episode"}
              onClick={() => setPlaying((p) => !p)}
              className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] motion-reduce:hover:scale-100"
            >
              {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="ml-0.5 h-5 w-5" aria-hidden />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {episodeLabel}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {episodeTitle}
              </p>
            </div>
          </div>
          <div className="mt-5 flex h-12 items-center gap-[3px]">
            {BARS.map((h, i) => (
              <motion.span
                key={i}
                initial={reduced ? false : { scaleY: 0.3 }}
                animate={playing && !reduced ? { scaleY: [0.4, 1, 0.5] } : { scaleY: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.04,
                  repeat: playing && !reduced ? Infinity : 0,
                  repeatType: "mirror",
                }}
                style={{ height: `${h}%` }}
                className="w-1 origin-center rounded-full bg-gradient-to-t from-primary/40 to-primary"
                aria-hidden
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.36 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
        >
          {platforms.map((p, i) => (
            <a
              key={p}
              href={`#${p.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 hover:text-foreground"
            >
              {i === 0 ? <Apple className="h-3.5 w-3.5" aria-hidden /> : null}
              {p}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroPodcast;
