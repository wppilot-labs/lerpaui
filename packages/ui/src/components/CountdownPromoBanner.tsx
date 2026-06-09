"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, X, Tag } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface CountdownPromoBannerProps {
  /** ISO date string or Date. Defaults to 24h from mount. */
  endsAt?: string | Date;
  promoCode?: string;
  discountLabel?: string;
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function diffParts(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  return {
    h: Math.floor(totalSec / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
    done: clamped === 0,
  };
}

export function CountdownPromoBanner({
  endsAt,
  promoCode = "BLACK24",
  discountLabel = "30% OFF",
  className,
}: CountdownPromoBannerProps) {
  // Stable target so timer doesn't reset on re-render
  const targetRef = useRef<number>(
    endsAt ? new Date(endsAt).getTime() : Date.now() + 1000 * 60 * 60 * 24,
  );
  const [now, setNow] = useState(() => Date.now());
  const [open, setOpen] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const parts = useMemo(() => diffParts(targetRef.current - now), [now]);

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">PROMO_BANNER</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Live countdown · dismissable</span>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="banner"
            role="region"
            aria-label="Limited-time promotion"
            aria-live="polite"
            initial={reduced ? { opacity: 1 } : { y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
                backgroundSize: "200% 100%",
                animation: reduced ? undefined : "ai-shimmer 3.6s linear infinite",
              }}
            />

            <div className="relative flex items-center gap-3 p-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-zinc-950 shrink-0">
                <Flame aria-hidden="true" className="w-4 h-4" />
              </span>

              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">
                  {discountLabel}
                </span>
                <span className="text-[9px] font-mono text-white/60 truncate inline-flex items-center gap-1">
                  <Tag aria-hidden="true" className="w-2.5 h-2.5" />
                  code <span className="text-white">{promoCode}</span>
                </span>
              </div>

              <div
                className="flex items-center gap-1 tabular-nums font-mono"
                role="timer"
                aria-label={
                  parts.done
                    ? "Promotion ended"
                    : `Ends in ${parts.h} hours ${parts.m} minutes ${parts.s} seconds`
                }
              >
                {parts.done ? (
                  <span className="text-[10px] text-white/40 uppercase">Ended</span>
                ) : (
                  (
                    [
                      { v: parts.h, l: "h" },
                      { v: parts.m, l: "m" },
                      { v: parts.s, l: "s" },
                    ] as const
                  ).map((u) => (
                    <span
                      key={u.l}
                      className="flex flex-col items-center px-1.5 py-0.5 rounded bg-black/40 border border-white/5"
                    >
                      <span className="text-[11px] font-black text-white leading-none">
                        {pad(u.v)}
                      </span>
                      <span className="text-[6px] uppercase tracking-widest text-white/40 leading-none mt-0.5">
                        {u.l}
                      </span>
                    </span>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Dismiss promotion"
                className="ml-1 w-6 h-6 grid place-items-center rounded-md text-white/40 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <X aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            key="restore"
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-primary hover:border-primary/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Restore promo
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
