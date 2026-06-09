"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, Trophy, Medal, Star, Crown } from "lucide-react";
import { cn } from "../lib/cn";

export interface AwardItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  category: string;
  year: string;
  tone: string;
}

export interface AwardsRecognitionStripProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  awards?: AwardItem[];
}

const DEFAULT_AWARDS: AwardItem[] = [
  {
    id: "a",
    icon: Trophy,
    title: "Product Hunt #1",
    category: "Design tools",
    year: "2026",
    tone: "from-amber-400 to-orange-500",
  },
  {
    id: "b",
    icon: Award,
    title: "Awwwards SOTD",
    category: "Site of the Day",
    year: "2026",
    tone: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "c",
    icon: Star,
    title: "G2 Leader",
    category: "Spring",
    year: "2026",
    tone: "from-emerald-500 to-teal-500",
  },
  {
    id: "d",
    icon: Medal,
    title: "CSS Awards",
    category: "UI Design",
    year: "2025",
    tone: "from-cyan-500 to-blue-500",
  },
  {
    id: "e",
    icon: Crown,
    title: "Fast Company",
    category: "Innovation by Design",
    year: "2025",
    tone: "from-pink-500 to-rose-500",
  },
];

export function AwardsRecognitionStrip({
  className,
  eyebrow = "Recognition",
  title = "Award-winning, peer-loved",
  awards = DEFAULT_AWARDS,
}: AwardsRecognitionStripProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-24",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Award className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </span>
          <h2
            id={headingId}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {awards.map((a, i) => (
            <motion.li
              key={a.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                  a.tone,
                )}
                aria-hidden
              >
                <a.icon className="h-7 w-7" aria-hidden />
              </div>
              <div className="mt-4 font-semibold text-foreground">{a.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{a.category}</div>
              <span className="mt-3 rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                {a.year}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AwardsRecognitionStrip;
