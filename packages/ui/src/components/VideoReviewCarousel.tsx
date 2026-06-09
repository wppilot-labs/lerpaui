"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "../lib/cn";
import { useShouldAnimate } from "../animation/hooks";

interface VideoReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  caption: string;
  hue: number;
}

const REVIEWS: VideoReview[] = [
  { id: "v1", author: "Maya R.", city: "Lisbon", rating: 5, caption: "Unboxing the matte ceramic edition", hue: 280 },
  { id: "v2", author: "Jordan K.", city: "Brooklyn", rating: 5, caption: "30 days in — still flawless", hue: 195 },
  { id: "v3", author: "Aiko S.", city: "Kyoto", rating: 4, caption: "Honest fit & feel review", hue: 330 },
  { id: "v4", author: "Leo M.", city: "Berlin", rating: 5, caption: "Side by side with the v1", hue: 145 },
];

export interface VideoReviewCarouselProps {
  className?: string;
  autoplayMs?: number;
}

export function VideoReviewCarousel({ className, autoplayMs = 4200 }: VideoReviewCarouselProps) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shouldAnimate || !playing) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), autoplayMs);
    return () => window.clearInterval(id);
  }, [shouldAnimate, playing, autoplayMs]);

  const current = REVIEWS[idx];

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none mb-4">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">VIDEO_REVIEWS.MP4</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Autoplay muted carousel · social UGC</span>
      </div>

      <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 80% at 30% 20%, hsl(${current.hue} 80% 55% / 0.55), transparent 60%), radial-gradient(100% 70% at 80% 90%, hsl(${(current.hue + 50) % 360} 70% 45% / 0.6), transparent 55%), #0a0a0f`,
            }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-center"
              animate={shouldAnimate && playing ? { y: [0, -6, 0] } : { y: 0 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-3 top-3 flex gap-1.5 z-10">
          {REVIEWS.map((r, i) => (
            <div key={r.id} className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                ref={i === idx ? progressRef : null}
                className="h-full bg-white/85"
                initial={{ width: i < idx ? "100%" : "0%" }}
                animate={{ width: i < idx ? "100%" : i === idx && shouldAnimate && playing ? "100%" : i === idx ? "0%" : "0%" }}
                transition={{ duration: i === idx && shouldAnimate && playing ? autoplayMs / 1000 : 0.2, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute inset-0 flex items-center justify-center group z-10"
        >
          <span className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
            {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </span>
        </button>

        <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-3 h-3", i < current.rating ? "fill-yellow-400 text-yellow-400" : "text-white/30")}
                />
              ))}
            </div>
            <p className="text-[11px] text-white font-medium leading-tight truncate">{current.caption}</p>
            <p className="text-[9px] text-white/60 uppercase tracking-wider font-bold">
              {current.author} · {current.city}
            </p>
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-colors shrink-0"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)}
          aria-label="Previous review"
          className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="Select review">
          {REVIEWS.map((r, i) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Review ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-6 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx((i) => (i + 1) % REVIEWS.length)}
          aria-label="Next review"
          className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}
