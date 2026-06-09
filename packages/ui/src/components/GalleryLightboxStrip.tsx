"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface GalleryLightboxItem {
  id: string;
  caption: string;
  hue: number;
}

export interface GalleryLightboxStripProps {
  className?: string;
  title?: string;
  items?: GalleryLightboxItem[];
}

const DEFAULT_ITEMS: GalleryLightboxItem[] = [
  { id: "a", caption: "Sunlit Atrium · Lisbon", hue: 35 },
  { id: "b", caption: "Glass Cathedral · Tokyo", hue: 210 },
  { id: "c", caption: "Tide Pools · Big Sur", hue: 180 },
  { id: "d", caption: "Spice Souk · Marrakech", hue: 12 },
  { id: "e", caption: "Aurora Camp · Tromsø", hue: 270 },
  { id: "f", caption: "Bamboo Path · Kyoto", hue: 130 },
  { id: "g", caption: "Steel Skyline · Hong Kong", hue: 230 },
  { id: "h", caption: "Sahara Dunes · Merzouga", hue: 25 },
];

export function GalleryLightboxStrip({
  className,
  title = "On location",
  items = DEFAULT_ITEMS,
}: GalleryLightboxStripProps) {
  const reduced = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const headingId = React.useId();

  const open = useCallback((i: number) => setOpenIdx(i), []);
  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(() => setOpenIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length)), [items.length]);
  const next = useCallback(() => setOpenIdx((i) => (i === null ? null : (i + 1) % items.length)), [items.length]);

  React.useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, close, prev, next]);

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Scroll horizontally. Click any frame to expand.</p>
      </div>

      <div className="mt-8 overflow-x-auto pb-4 [scrollbar-width:thin]">
        <ul className="flex gap-4 px-6">
          {items.map((it, i) => (
            <li key={it.id} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative block aspect-[3/4] w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-64"
                aria-label={`Open ${it.caption}`}
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  style={{ background: `linear-gradient(135deg, oklch(0.78 0.18 ${it.hue}), oklch(0.55 0.2 ${(it.hue + 40) % 360}))` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" aria-hidden />
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100" aria-hidden>
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-sm font-semibold text-white">{it.caption}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {openIdx !== null && items[openIdx] && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={items[openIdx].caption}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
            onClick={close}
          >
            <button type="button" aria-label="Close lightbox" onClick={close} className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <X className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-8">
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-8">
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>

            <motion.div
              key={openIdx}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, oklch(0.78 0.18 ${items[openIdx].hue}), oklch(0.55 0.2 ${(items[openIdx].hue + 40) % 360}))` }}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <div className="text-xs uppercase tracking-wider opacity-80">{openIdx + 1} of {items.length}</div>
                <div className="mt-1 text-xl font-bold">{items[openIdx].caption}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default GalleryLightboxStrip;
