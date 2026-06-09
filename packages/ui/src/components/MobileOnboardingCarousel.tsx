"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, BarChart3, Bell, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Slide = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    icon: Rocket,
    title: "Welcome aboard",
    body: "Set up your first project in under a minute and invite your team.",
  },
  {
    icon: BarChart3,
    title: "Track everything",
    body: "Real-time insights keep you on top of what matters most.",
  },
  {
    icon: Bell,
    title: "Stay in the loop",
    body: "Smart notifications tell you what needs attention, nothing more.",
  },
];

export interface MobileOnboardingCarouselProps {
  className?: string;
}

export function MobileOnboardingCarousel({ className }: MobileOnboardingCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];
  const Icon = slide.icon;

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Icon className="w-7 h-7" />
            </span>
            <h3 className="text-base font-bold">{slide.title}</h3>
            <p className="mt-1.5 px-2 text-sm text-muted-foreground/70 leading-relaxed">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5" role="tablist" aria-label="Slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={next}
        className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        {isLast ? "Get started" : "Next"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
