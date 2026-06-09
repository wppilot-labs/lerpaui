"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";

export interface GalleryFilterableItem {
  id: string;
  title: string;
  category: string;
  hue: number;
}

export interface GalleryFilterableCategoriesProps {
  className?: string;
  title?: string;
  description?: string;
  items?: GalleryFilterableItem[];
}

const DEFAULT_ITEMS: GalleryFilterableItem[] = [
  { id: "1", title: "Mercury", category: "Branding", hue: 12 },
  { id: "2", title: "Atlas", category: "Web", hue: 220 },
  { id: "3", title: "Helix", category: "Mobile", hue: 280 },
  { id: "4", title: "Nimbus", category: "Web", hue: 195 },
  { id: "5", title: "Quartz", category: "Branding", hue: 50 },
  { id: "6", title: "Forge", category: "Product", hue: 350 },
  { id: "7", title: "Lumen", category: "Mobile", hue: 145 },
  { id: "8", title: "Cipher", category: "Product", hue: 310 },
  { id: "9", title: "Drift", category: "Web", hue: 170 },
  { id: "10", title: "Vector", category: "Branding", hue: 95 },
  { id: "11", title: "Echo", category: "Product", hue: 25 },
  { id: "12", title: "Pulse", category: "Mobile", hue: 250 },
];

export function GalleryFilterableCategories({
  className,
  title = "Selected work",
  description = "Filter by what you're looking for.",
  items = DEFAULT_ITEMS,
}: GalleryFilterableCategoriesProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">{description}</p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Categories"
          className="mb-8 inline-flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm"
        >
          {categories.map((c) => {
            const selected = c === active;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(c)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background hover:text-foreground",
                )}
              >
                {c}
                {c === "All" && (
                  <span className={cn("ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold", selected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/5 text-muted-foreground")}>
                    {items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.article
                key={item.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    style={{ background: `linear-gradient(135deg, oklch(0.78 0.18 ${item.hue}), oklch(0.55 0.22 ${(item.hue + 50) % 360}))` }}
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    {item.category}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <span className="text-xs text-muted-foreground">View</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">
            No works in <span className="font-semibold text-foreground">{active}</span> yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default GalleryFilterableCategories;
