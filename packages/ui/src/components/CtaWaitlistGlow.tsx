"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaWaitlistGlowProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  initialCount?: number;
  targetCount?: number;
  placeholder?: string;
  ctaLabel?: string;
  successLabel?: string;
  avatars?: Array<{ name: string; color?: string }>;
  onSubmit?: (email: string) => void | Promise<void>;
  className?: string;
}

const DEFAULT_AVATARS = [
  { name: "Mara Choi", color: "oklch(0.72 0.18 280)" },
  { name: "Jules Aramide", color: "oklch(0.75 0.15 200)" },
  { name: "Sage Okonjo", color: "oklch(0.78 0.16 340)" },
  { name: "Iris Vela", color: "oklch(0.7 0.18 140)" },
];

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function CtaWaitlistGlow({
  eyebrow = "Private beta",
  title = "Be first when we open the doors.",
  description = "Join a small group of early builders shaping the launch. We send one email a week — never spam, easy unsubscribe.",
  initialCount = 1240,
  targetCount = 1500,
  placeholder = "you@company.com",
  ctaLabel = "Join the waitlist",
  successLabel = "You're on the list",
  avatars = DEFAULT_AVATARS,
  onSubmit,
  className,
}: CtaWaitlistGlowProps) {
  const reduced = useReducedMotion() ?? false;
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [count, setCount] = React.useState(initialCount);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (reduced) return;
    if (count >= targetCount) return;
    const t = setTimeout(() => setCount((c) => Math.min(targetCount, c + 1)), 6000);
    return () => clearTimeout(t);
  }, [count, targetCount, reduced]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }
    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(trimmed);
      setSubmitted(true);
      setCount((c) => c + 1);
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={cn("relative isolate w-full overflow-hidden bg-background py-20 sm:py-28", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: reduced ? 0.5 : 0.3, scale: reduced ? 1 : 0.9 }}
          animate={reduced ? { opacity: 0.5, scale: 1 } : { opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 7, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(closest-side, oklch(0.72 0.18 280) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <motion.span
          initial={reduced ? false : { opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur"
        >
          <Sparkles className="h-3 w-3 text-primary" aria-hidden /> {eyebrow}
        </motion.span>

        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: reduced ? 0 : 0.05 }}
          className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {title}
        </motion.h2>

        {description ? (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: reduced ? 0 : 0.12 }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        ) : null}

        <motion.form
          onSubmit={handleSubmit}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: reduced ? 0 : 0.2 }}
          className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          aria-label="Waitlist signup"
          noValidate
        >
          <div className="relative flex-1">
            <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
            <input
              id={`${id}-email`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={submitted || submitting}
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-err` : undefined}
              className="h-11 w-full rounded-md border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={submitted || submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" aria-hidden /> {successLabel}
              </>
            ) : (
              <>
                {submitting ? "Joining…" : ctaLabel}
                {!submitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
              </>
            )}
          </button>
        </motion.form>
        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 text-xs font-medium text-destructive">{error}</p>
        ) : null}

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: reduced ? 0 : 0.35 }}
          className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3"
        >
          <div className="flex -space-x-2" aria-hidden>
            {avatars.slice(0, 4).map((a) => (
              <span
                key={a.name}
                title={a.name}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
                style={{ background: a.color ?? "oklch(0.7 0.18 280)" }}
              >
                {initialsOf(a.name)}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground tabular-nums">{count.toLocaleString()}</span> builders already in the queue.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaWaitlistGlow;
