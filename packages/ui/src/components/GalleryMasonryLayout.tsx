"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "../lib/cn";

export interface GalleryMasonryItem {
  id: string;
  title: string;
  author: string;
  hue: number;
  saturation?: number;
  aspect: number; // height/width ratio for column flow
}

export interface GalleryMasonryLayoutProps {
  className?: string;
  title?: string;
  description?: string;
  items?: GalleryMasonryItem[];
}

const DEFAULT_ITEMS: GalleryMasonryItem[] = [
  { id: "1", title: "Aurora", author: "Lena Park", hue: 280, aspect: 1.3 },
  { id: "2", title: "Tideline", author: "Marcus Vale", hue: 210, aspect: 0.85 },
  { id: "3", title: "Citrine", author: "Yuki Tanaka", hue: 45, aspect: 1.1 },
  { id: "4", title: "Verdant", author: "Sara Okonkwo", hue: 145, aspect: 1.5 },
  { id: "5", title: "Rosé", author: "Daniel Lim", hue: 340, aspect: 0.9 },
  { id: "6", title: "Cobalt", author: "Iris Mendez", hue: 230, aspect: 1.2 },
  { id: "7", title: "Saffron", author: "Adi Mehta", hue: 30, aspect: 1.4 },
  { id: "8", title: "Mist", author: "Hana Joon", hue: 190, aspect: 0.95 },
  { id: "9", title: "Plum", author: "Theo Bauer", hue: 305, aspect: 1.25 },
];

export function GalleryMasonryLayout({
  className,
  title = "Featured works",
  description = "A curated collection from independent artists in our community.",
  items = DEFAULT_ITEMS,
}: GalleryMasonryLayoutProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">{description}</p>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            <span className="font-bold text-foreground">{items.length}</span> works
          </div>
        </div>

        <div
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          style={{ columnFill: "balance" }}
        >
          {items.map((item, idx) => (
            <motion.figure
              key={item.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: `1 / ${item.aspect}` }}
                aria-hidden
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.78 ${(item.saturation ?? 0.18)} ${item.hue}), oklch(0.62 ${(item.saturation ?? 0.18) + 0.04} ${(item.hue + 35) % 360}))`,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100">
                  <div className="text-xs font-semibold text-white">{item.title}</div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Like ${item.title}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                      <Heart className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button type="button" aria-label={`Save ${item.title}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                      <Bookmark className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
              <figcaption className="flex items-center justify-between px-4 py-3 text-xs">
                <span className="font-semibold text-foreground">{item.title}</span>
                <span className="text-muted-foreground">by {item.author}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GalleryMasonryLayout;
