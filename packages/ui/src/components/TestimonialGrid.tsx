"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { cn } from "../lib/cn";

interface TestimonialGridProps {
  className?: string;
}

interface Testimonial {
  id: string;
  body: string;
  name: string;
  role: string;
  initials: string;
  avatarTone: string;
  rating: number;
  span?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "ada",
    body: "We swapped three vendors for one platform. Pages we previously farmed out now ship the same day.",
    name: "Ada Tang",
    role: "VP Engineering, Lumen Labs",
    initials: "AT",
    avatarTone: "from-violet-500 to-fuchsia-500",
    rating: 5,
    span: true,
  },
  {
    id: "luis",
    body: "Composable, beautiful, fast. Onboarding new designers takes hours, not weeks.",
    name: "Luis Romero",
    role: "Design Lead, Northwind",
    initials: "LR",
    avatarTone: "from-cyan-500 to-blue-500",
    rating: 5,
  },
  {
    id: "saanvi",
    body: "The components feel custom-built every time. Our marketing site converts 38% better.",
    name: "Saanvi Rao",
    role: "Growth, OrbitPay",
    initials: "SR",
    avatarTone: "from-emerald-500 to-teal-500",
    rating: 5,
  },
  {
    id: "milo",
    body: "Accessibility is no longer the long pole. We hit AA out of the box on every release.",
    name: "Milo Chen",
    role: "Frontend Architect, Aerial",
    initials: "MC",
    avatarTone: "from-amber-400 to-orange-500",
    rating: 5,
  },
];

export function TestimonialGrid({ className }: TestimonialGridProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border/50 bg-card/30 px-6 py-12 backdrop-blur-xl sm:px-10 sm:py-16",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="testimonial-grid-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Quote className="h-3.5 w-3.5" aria-hidden />
            What customers say
          </span>
          <h2
            id="testimonial-grid-heading"
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            Loved by builders,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              trusted at scale
            </span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <motion.li
              key={t.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.06 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
                t.span && "sm:col-span-2",
              )}
            >
              <Quote
                className="absolute right-4 top-4 h-5 w-5 text-primary/30"
                aria-hidden="true"
              />
              <div
                className="flex items-center gap-0.5"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.body}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                    t.avatarTone,
                  )}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
