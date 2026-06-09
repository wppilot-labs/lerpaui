"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface TestimonialItem {
  id: string;
  body: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
  rating: number;
  size: "sm" | "md" | "lg";
}

export interface TestimonialMasonryWallProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  items?: TestimonialItem[];
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    id: "a",
    body: "Genuinely the only design system that doesn't slow us down. Components feel like they were built for our brand.",
    name: "Reza Hosseini",
    role: "Head of Design",
    initials: "RH",
    tone: "from-violet-500 to-fuchsia-500",
    rating: 5,
    size: "lg",
  },
  { id: "b", body: "Cut our launch time in half.", name: "Mei Wong", role: "Founder", initials: "MW", tone: "from-cyan-500 to-blue-500", rating: 5, size: "sm" },
  {
    id: "c",
    body: "Accessibility just works. Our compliance team gave us a green light on the first audit.",
    name: "Tobias Klein",
    role: "Eng Director",
    initials: "TK",
    tone: "from-amber-500 to-orange-500",
    rating: 5,
    size: "md",
  },
  { id: "d", body: "Beautiful out of the box.", name: "Priya Shah", role: "PM", initials: "PS", tone: "from-emerald-500 to-teal-500", rating: 5, size: "sm" },
  {
    id: "e",
    body: "We went from sketch to prod in three days. The animation primitives are a cheat code.",
    name: "Lara Costa",
    role: "Staff Engineer",
    initials: "LC",
    tone: "from-pink-500 to-rose-500",
    rating: 5,
    size: "md",
  },
  {
    id: "f",
    body: "Easily the best documentation I've used in years. Every prop is real-world useful.",
    name: "Jamal Brooks",
    role: "Tech Lead",
    initials: "JB",
    tone: "from-indigo-500 to-purple-500",
    rating: 5,
    size: "lg",
  },
  { id: "g", body: "Saved us $40k in vendor contracts.", name: "Sofia Marín", role: "COO", initials: "SM", tone: "from-blue-500 to-sky-500", rating: 5, size: "sm" },
  {
    id: "h",
    body: "It's rare to find a library that respects both designers and engineers. This one does.",
    name: "Henrik Olsen",
    role: "CTO",
    initials: "HO",
    tone: "from-red-500 to-orange-500",
    rating: 5,
    size: "md",
  },
];

const sizeStyles: Record<TestimonialItem["size"], string> = {
  sm: "row-span-2",
  md: "row-span-3",
  lg: "row-span-4",
};

export function TestimonialMasonryWall({
  className,
  eyebrow = "Wall of love",
  title = "Hear it from real builders",
  items = DEFAULT_ITEMS,
}: TestimonialMasonryWallProps) {
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
            <Quote className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <ul className="mt-12 grid auto-rows-[44px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <motion.li
              key={t.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={cn(
                "flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
                sizeStyles[t.size],
              )}
            >
              <div>
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.body}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-4 flex items-center gap-2.5">
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white",
                    t.tone,
                  )}
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TestimonialMasonryWall;
