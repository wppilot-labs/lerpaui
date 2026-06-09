"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type Reco = { id: string; name: string; price: string; rating: number; tint: string };

const RECOS: Reco[] = [
  { id: "1", name: "Canvas Tote", price: "$42", rating: 4.5, tint: "from-amber-500/30 to-orange-500/10" },
  { id: "2", name: "Leather Belt", price: "$58", rating: 4.8, tint: "from-stone-500/30 to-neutral-500/10" },
  { id: "3", name: "Knit Beanie", price: "$28", rating: 4.6, tint: "from-emerald-500/30 to-teal-500/10" },
  { id: "4", name: "Wool Socks", price: "$16", rating: 4.9, tint: "from-sky-500/30 to-indigo-500/10" },
  { id: "5", name: "Card Holder", price: "$34", rating: 4.4, tint: "from-fuchsia-500/30 to-purple-500/10" },
];

const PER_PAGE = 2;

export interface ProductRecommendationCarouselProps {
  className?: string;
}

export function ProductRecommendationCarousel({
  className,
}: ProductRecommendationCarouselProps) {
  const [page, setPage] = useState(0);
  const reduced = usePrefersReducedMotion();
  const pages = Math.ceil(RECOS.length / PER_PAGE);

  const next = () => setPage((p) => Math.min(p + 1, pages - 1));
  const prev = () => setPage((p) => Math.max(p - 1, 0));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold">You may also like</h3>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            disabled={page === 0}
            className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            disabled={page >= pages - 1}
            className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${page * 100}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 260 }}
        >
          {Array.from({ length: pages }).map((_, pi) => (
            <div key={pi} className="grid grid-cols-2 gap-3 shrink-0 w-full">
              {RECOS.slice(pi * PER_PAGE, pi * PER_PAGE + PER_PAGE).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-foreground/[0.05] overflow-hidden"
                >
                  <div className={cn("h-24 bg-gradient-to-br", r.tint)} />
                  <div className="p-2.5">
                    <div className="text-sm font-semibold truncate">{r.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold">{r.price}</span>
                      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground/65">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {r.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to page ${i + 1}`}
            aria-current={page === i}
            onClick={() => setPage(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              page === i ? "w-4 bg-primary" : "w-1.5 bg-foreground/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}
