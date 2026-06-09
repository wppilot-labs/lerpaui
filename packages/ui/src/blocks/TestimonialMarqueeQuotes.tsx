"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface MarqueeQuote {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Optional avatar color (any CSS color, prefers oklch tokens). */
  avatarColor?: string;
  /** Optional 1-5 rating. */
  rating?: number;
}

export interface TestimonialMarqueeQuotesProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  quotes?: MarqueeQuote[];
  /** Seconds for one full loop on each row. Lower = faster. */
  speed?: number;
  /** Pause when hovered. */
  pauseOnHover?: boolean;
  className?: string;
}

const DEFAULT_QUOTES: MarqueeQuote[] = [
  {
    id: "q1",
    quote:
      "We replaced three internal libraries with Lerpa UI in a week. The token system is the cleanest I have ever shipped against.",
    name: "Mara Choi",
    role: "Staff Engineer",
    company: "Northwind",
    avatarColor: "oklch(0.72 0.18 280)",
    rating: 5,
  },
  {
    id: "q2",
    quote:
      "Reduced-motion was hooked up everywhere by default. Our a11y review caught zero motion bugs on the new pages.",
    name: "Jules Aramide",
    role: "Design Systems Lead",
    company: "Helios",
    avatarColor: "oklch(0.75 0.15 200)",
    rating: 5,
  },
  {
    id: "q3",
    quote:
      "Static export with Next 16 was the unlock. We ship the docs to a CDN now and the LCP dropped under one second.",
    name: "Sage Okonjo",
    role: "Frontend Architect",
    company: "Kestrel",
    avatarColor: "oklch(0.78 0.16 340)",
    rating: 5,
  },
  {
    id: "q4",
    quote:
      "The registry workflow is brilliant — we copy what we need, transform our own tokens on top, and own the source forever.",
    name: "Iris Vela",
    role: "Product Engineer",
    company: "Beacon",
    avatarColor: "oklch(0.7 0.18 140)",
    rating: 5,
  },
  {
    id: "q5",
    quote:
      "Motion choreography across blocks just works. I no longer have to negotiate between designers and reduced-motion users.",
    name: "Linus Wei",
    role: "Senior Frontend",
    company: "Tessera",
    avatarColor: "oklch(0.74 0.17 60)",
    rating: 4,
  },
  {
    id: "q6",
    quote:
      "Type-safe props everywhere, sensible defaults, and zero unwanted dependencies. This is what design systems should feel like.",
    name: "Ami Nakajima",
    role: "Engineering Manager",
    company: "Drift",
    avatarColor: "oklch(0.76 0.14 320)",
    rating: 5,
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface RowProps {
  quotes: MarqueeQuote[];
  direction: "left" | "right";
  speed: number;
  reduced: boolean;
  pauseOnHover: boolean;
}

function MarqueeRow({ quotes, direction, speed, reduced, pauseOnHover }: RowProps) {
  const loop = React.useMemo(() => [...quotes, ...quotes], [quotes]);
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        pauseOnHover && !reduced && "[--play:running] hover:[--play:paused]"
      )}
    >
      <motion.div
        animate={
          reduced
            ? { x: 0 }
            : { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }
        }
        transition={{
          duration: speed,
          ease: "linear",
          repeat: reduced ? 0 : Infinity,
        }}
        className="flex shrink-0 gap-4 pr-4"
        style={{ animationPlayState: "var(--play, running)" } as React.CSSProperties}
      >
        {(reduced ? quotes : loop).map((q, idx) => (
          <figure
            key={`${q.id}-${idx}`}
            className="flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:w-[380px]"
          >
            <Quote className="h-5 w-5 text-primary/60" aria-hidden />
            <blockquote className="text-sm leading-relaxed text-foreground/90">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: q.avatarColor ?? "var(--accent, oklch(0.7 0.18 280))" }}
              >
                {initials(q.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">{q.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {q.role} · <span className="font-semibold text-primary">{q.company}</span>
                </p>
              </div>
              {typeof q.rating === "number" ? (
                <div
                  role="img"
                  className="flex items-center gap-0.5 text-amber-500"
                  aria-label={`${q.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3 fill-current",
                        i < q.rating! ? "text-amber-500" : "text-muted/30"
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialMarqueeQuotes({
  eyebrow = "Loved by builders",
  title = "Teams shipping faster on Lerpa UI.",
  description = "Honest words from engineers who replaced their old design systems and didn't look back.",
  quotes = DEFAULT_QUOTES,
  speed = 45,
  pauseOnHover = true,
  className,
}: TestimonialMarqueeQuotesProps) {
  const reduced = usePrefersReducedMotion();
  const safe = quotes.length ? quotes : DEFAULT_QUOTES;
  const mid = Math.ceil(safe.length / 2);
  const top = safe.slice(0, mid);
  const bottom = safe.slice(mid).length >= 2 ? safe.slice(mid) : [...safe.slice(mid), ...safe.slice(0, mid)];

  return (
    <section className={cn("relative w-full overflow-hidden bg-background py-20 sm:py-28", className)}>
      <Container>
        <SectionHeader align="center" tag={eyebrow} title={title} description={description} />
      </Container>

      <div className="relative">
        {/* edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex flex-col gap-4">
          <MarqueeRow
            quotes={top}
            direction="left"
            speed={speed}
            reduced={reduced}
            pauseOnHover={pauseOnHover}
          />
          <MarqueeRow
            quotes={bottom}
            direction="right"
            speed={speed * 1.15}
            reduced={reduced}
            pauseOnHover={pauseOnHover}
          />
        </div>
      </div>
    </section>
  );
}

export default TestimonialMarqueeQuotes;
