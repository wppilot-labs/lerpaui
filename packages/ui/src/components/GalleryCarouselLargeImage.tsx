"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "../lib/cn";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  hue: number;
  badge?: string;
}

export interface GalleryCarouselLargeImageProps {
  className?: string;
  slides?: CarouselSlide[];
  autoplaySeconds?: number;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  { id: "1", title: "Beacon by Aetheric Labs", subtitle: "Brand identity & site design · 2025", hue: 280, badge: "Case study" },
  { id: "2", title: "Lumen Health Dashboard", subtitle: "Product design system · 2025", hue: 195, badge: "Featured" },
  { id: "3", title: "Vector Capital Site", subtitle: "Marketing site & motion · 2024", hue: 30 },
  { id: "4", title: "Pulse Mobile App", subtitle: "iOS launch & DLS · 2025", hue: 340, badge: "New" },
];

export function GalleryCarouselLargeImage({
  className,
  slides = DEFAULT_SLIDES,
  autoplaySeconds = 6,
}: GalleryCarouselLargeImageProps) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const headingId = React.useId();

  const goTo = useCallback((i: number) => setIdx(((i % slides.length) + slides.length) % slides.length), [slides.length]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);

  React.useEffect(() => {
    if (reduced || autoplaySeconds <= 0) return;
    const t = setInterval(next, autoplaySeconds * 1000);
    return () => clearInterval(t);
  }, [reduced, autoplaySeconds, next]);

  const slide = slides[idx];

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      className={cn("relative w-full bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id={headingId} className="sr-only">Featured projects carousel</h2>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border shadow-2xl">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={slide.id}
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${slides.length}: ${slide.title}`}
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, oklch(0.78 0.2 ${slide.hue}), oklch(0.5 0.24 ${(slide.hue + 50) % 360}))` }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" aria-hidden />
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 55%)" }} aria-hidden />

              <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12">
                {slide.badge && (
                  <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {slide.badge}
                  </div>
                )}
                <h3 className="text-balance text-3xl font-black tracking-tight text-white sm:text-5xl">{slide.title}</h3>
                <p className="mt-3 text-sm text-white/80 sm:text-base">{slide.subtitle}</p>
                <div className="mt-6">
                  <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:hover:translate-y-0">
                    <Play className="h-4 w-4" aria-hidden />
                    View case study
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button type="button" aria-label="Previous slide" onClick={prev} className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" aria-label="Next slide" onClick={next} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slides.map((s, i) => {
            const selected = i === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={selected}
                className={cn(
                  "group relative aspect-[16/9] overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  selected ? "border-primary shadow-md" : "border-border opacity-60 hover:opacity-100",
                )}
              >
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, oklch(0.78 0.2 ${s.hue}), oklch(0.5 0.24 ${(s.hue + 50) % 360}))` }} aria-hidden />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white">{s.title.split(" ")[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GalleryCarouselLargeImage;
