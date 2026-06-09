"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface WaitlistAvatar {
  initials: string;
  tone: string;
}

export interface CtaWaitlistCounterBlockProps {
  className?: string;
  count?: number;
  spotsLeft?: number;
  onSubmit?: (email: string) => void;
  eyebrow?: string;
  title?: string;
  avatars?: WaitlistAvatar[];
  placeholder?: string;
  submitLabel?: string;
}

const DEFAULT_AVATARS: WaitlistAvatar[] = [
  { initials: "AL", tone: "bg-primary/80" },
  { initials: "MK", tone: "bg-emerald-500/80" },
  { initials: "RT", tone: "bg-amber-500/80" },
  { initials: "SO", tone: "bg-sky-500/80" },
  { initials: "JP", tone: "bg-violet-500/80" },
];

export function CtaWaitlistCounterBlock({
  className,
  count = 8421,
  spotsLeft = 124,
  onSubmit,
  eyebrow = "Closed beta · early access",
  title = "Join the waitlist",
  avatars = DEFAULT_AVATARS,
  placeholder = "you@company.com",
  submitLabel = "Reserve spot",
}: CtaWaitlistCounterBlockProps) {
  const reduced = useReducedMotion() ?? false;
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
    setDone(true);
  }

  return (
    <section
      aria-label="Join waitlist"
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 text-center shadow-sm transition-shadow hover:shadow-md md:py-24",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,oklch(0.65_0.2_280/0.18),transparent_60%)]" />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-xl flex-col items-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" aria-hidden /> {eyebrow}
        </span>

        <h2 className="mt-5 text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-pretty text-base text-muted-foreground">
          Get one of the last <span className="font-semibold text-foreground">{spotsLeft}</span> founder spots and lock in lifetime pricing.
        </p>

        <div className="mt-7 flex items-center gap-3 rounded-2xl border bg-muted/30 px-4 py-3">
          <div className="flex -space-x-2">
            {avatars.map((a) => (
              <span
                key={a.initials}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border-2 border-card text-[10px] font-semibold text-white",
                  a.tone
                )}
              >
                {a.initials}
              </span>
            ))}
          </div>
          <div className="text-left">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
              <span className="tabular-nums">{count.toLocaleString()}</span> joined
            </p>
            <p className="text-[11px] text-muted-foreground">{spotsLeft} founder spots remaining</p>
          </div>
        </div>

        {!done ? (
          <form onSubmit={handle} className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-label="Email address"
              className="flex-1 rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
            >
              {submitLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </button>
          </form>
        ) : (
          <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> You&apos;re on the list — we&apos;ll be in touch.
          </p>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">No spam. Unsubscribe in one click.</p>
      </motion.div>
    </section>
  );
}

export default CtaWaitlistCounterBlock;
