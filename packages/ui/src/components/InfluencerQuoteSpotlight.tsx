"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, BadgeCheck, Users } from "lucide-react";
import { cn } from "../lib/cn";
import { useShouldAnimate } from "../animation/hooks";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  followers: string;
  platform: string;
  quote: string;
  hue: number;
  initials: string;
}

const INFLUENCERS: Influencer[] = [
  {
    id: "i1",
    name: "Maya Okafor",
    handle: "@mayareviews",
    followers: "812k",
    platform: "YouTube",
    initials: "MO",
    hue: 320,
    quote: "The fit is genuinely the best I have tested this year — I packed it for three trips already.",
  },
  {
    id: "i2",
    name: "Theo Lin",
    handle: "@theolin",
    followers: "1.4M",
    platform: "TikTok",
    initials: "TL",
    hue: 195,
    quote: "Stupidly comfortable and the stitching has not budged after eight wash cycles.",
  },
  {
    id: "i3",
    name: "Sasha Vidal",
    handle: "@sasha.style",
    followers: "490k",
    platform: "Instagram",
    initials: "SV",
    hue: 145,
    quote: "Cult-level packaging and the colorway photographs even better than the studio shots.",
  },
  {
    id: "i4",
    name: "Idris Nakamura",
    handle: "@idris.makes",
    followers: "265k",
    platform: "Substack",
    initials: "IN",
    hue: 38,
    quote: "If you only buy one this season — this is the one that earns its shelf space.",
  },
];

export interface InfluencerQuoteSpotlightProps {
  className?: string;
  rotateMs?: number;
}

export function InfluencerQuoteSpotlight({ className, rotateMs = 5200 }: InfluencerQuoteSpotlightProps) {
  const [idx, setIdx] = useState(0);
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % INFLUENCERS.length), rotateMs);
    return () => window.clearInterval(id);
  }, [shouldAnimate, rotateMs]);

  const current = INFLUENCERS[idx];

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground relative overflow-hidden",
        className,
      )}
    >
      <motion.div
        key={`bg-${current.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
        className="absolute -inset-12 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 20% 20%, hsl(${current.hue} 80% 55% / 0.35), transparent 60%), radial-gradient(60% 60% at 80% 80%, hsl(${(current.hue + 60) % 360} 80% 50% / 0.3), transparent 65%)`,
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-1 font-mono select-none mb-4 relative">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">CREATOR_SPOTLIGHT</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Rotating press · verified creators</span>
      </div>

      <div className="relative min-h-[200px]">
        <Quote className="w-7 h-7 text-primary/30 absolute -top-1 -left-1" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pl-7 pr-1 pt-1 text-sm leading-relaxed text-foreground/90 font-medium"
          >
            &ldquo;{current.quote}&rdquo;
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06] relative">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`av-${current.id}`}
              layoutId="influencer-avatar"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 border-2 border-white/15 shadow-lg"
              style={{
                background: `linear-gradient(135deg, hsl(${current.hue} 75% 55%), hsl(${(current.hue + 60) % 360} 75% 45%))`,
              }}
              aria-hidden="true"
            >
              {current.initials}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`meta-${current.id}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-foreground">{current.name}</span>
                <BadgeCheck className="w-3.5 h-3.5 text-sky-400" aria-label="Verified creator" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>{current.handle}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" aria-hidden="true" />
                <span className="flex items-center gap-0.5">
                  <Users className="w-2.5 h-2.5" /> {current.followers}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 tracking-wider">
          {current.platform}
        </span>
      </div>

      <div className="flex justify-center gap-1.5 mt-3 relative" role="tablist" aria-label="Select creator">
        {INFLUENCERS.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Quote from ${c.name}`}
            onClick={() => setIdx(i)}
            className={cn(
              "h-1 rounded-full transition-all",
              i === idx ? "w-8 bg-primary" : "w-1 bg-white/20 hover:bg-white/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
