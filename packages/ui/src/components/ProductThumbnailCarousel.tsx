"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Shot = { id: string; label: string; tint: string };

const SHOTS: Shot[] = [
  { id: "front", label: "Front", tint: "from-sky-500/30 to-indigo-500/15" },
  { id: "back", label: "Back", tint: "from-emerald-500/30 to-teal-500/15" },
  { id: "side", label: "Side", tint: "from-amber-500/30 to-orange-500/15" },
  { id: "detail", label: "Detail", tint: "from-fuchsia-500/30 to-purple-500/15" },
];

export interface ProductThumbnailCarouselProps {
  className?: string;
}

export function ProductThumbnailCarousel({ className }: ProductThumbnailCarouselProps) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const shot = SHOTS[active];

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-3 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="relative h-52 rounded-xl overflow-hidden border border-foreground/[0.05]">
        <AnimatePresence mode="wait">
          <motion.div
            key={shot.id}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
              shot.tint,
            )}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              {shot.label} view
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3" role="tablist" aria-label="Product images">
        {SHOTS.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`${s.label} view`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-14 flex-1 rounded-lg overflow-hidden border-2 transition-all",
                selected
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  s.tint,
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
