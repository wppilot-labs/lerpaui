"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "../lib/cn";

interface TestimonialCarouselProps {
  className?: string;
}

interface Testimonial {
  id: string;
  body: string;
  name: string;
  role: string;
  initials: string;
  avatarTone: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "ada",
    body: "We shipped our brand redesign in a single sprint. Every component felt like it was built for our team.",
    name: "Ada Tang",
    role: "VP Engineering, Lumen Labs",
    initials: "AT",
    avatarTone: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "luis",
    body: "The polish is unreal. Hover states, motion, accessibility — there is nothing left for us to fight with.",
    name: "Luis Romero",
    role: "Design Lead, Northwind",
    initials: "LR",
    avatarTone: "from-cyan-500 to-blue-500",
  },
  {
    id: "saanvi",
    body: "Our growth experiments ship 4x faster now. Conversion on the new pricing page jumped 38%.",
    name: "Saanvi Rao",
    role: "Growth, OrbitPay",
    initials: "SR",
    avatarTone: "from-emerald-500 to-teal-500",
  },
];

export function TestimonialCarousel({ className }: TestimonialCarouselProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const current = TESTIMONIALS[index];

  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border/50 bg-card/30 px-6 py-12 backdrop-blur-xl sm:px-10 sm:py-16",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-labelledby="testimonial-carousel-heading"
      aria-roledescription="carousel"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 left-1/3 h-48 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Quote className="h-3.5 w-3.5" aria-hidden />
            Customer story
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="rounded-full border border-border/60 bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded-full border border-border/60 bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <h2 id="testimonial-carousel-heading" className="sr-only">
          Customer testimonials
        </h2>

        <div className="relative min-h-[200px]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={current.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.32 }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
              aria-roledescription="slide"
              aria-label={`Testimonial ${index + 1} of ${TESTIMONIALS.length}`}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-pretty text-lg font-medium leading-relaxed text-foreground md:text-xl">
                &ldquo;{current.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                    current.avatarTone,
                  )}
                  aria-hidden="true"
                >
                  {current.initials}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-foreground">
                    {current.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{current.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === index ? "w-8 bg-primary" : "w-2 bg-border hover:bg-foreground/30",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
