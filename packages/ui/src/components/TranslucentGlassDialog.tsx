"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MapPin, Shield, Smartphone, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface TranslucentGlassDialogProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function TranslucentGlassDialog({
  className,
  isOpen: controlledOpen,
  onClose,
}: TranslucentGlassDialogProps) {
  const reduced = useReducedMotion() ?? false;
  const [localOpen, setLocalOpen] = React.useState(true);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? !!controlledOpen : localOpen;

  const titleId = React.useId();
  const descId = React.useId();

  const close = React.useCallback(() => {
    if (!isControlled) setLocalOpen(false);
    onClose?.();
  }, [isControlled, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <section
      aria-label="Glass dialog preview"
      className={cn(
        "relative isolate flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border/40 p-6",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,oklch(0.6_0.18_280/0.35),transparent_60%),radial-gradient(120%_80%_at_80%_100%,oklch(0.6_0.18_200/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,oklch(0.1_0_0/0.5)_100%)]" />
      </div>

      {!open && (
        <button
          type="button"
          onClick={() => !isControlled && setLocalOpen(true)}
          className="rounded-xl border border-border/60 bg-card/70 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur-xl transition-colors hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Show notification
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-6"
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.08) 100%)",
                  WebkitMaskImage:
                    "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                  WebkitMaskComposite: "xor",
                  padding: 1,
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl"
                style={{
                  background:
                    "linear-gradient(140deg, oklch(0.85_0.15_280/0.5), transparent 40%, transparent 70%, oklch(0.85_0.15_200/0.4))",
                  mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                  WebkitMask:
                    "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                  WebkitMaskComposite: "xor",
                  padding: 1,
                }}
              />

              <div className="relative flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-foreground">
                  <Shield className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-1 flex-col">
                  <h2
                    id={titleId}
                    className="text-sm font-semibold text-foreground"
                  >
                    New device sign-in
                  </h2>
                  <p
                    id={descId}
                    className="mt-0.5 text-xs leading-relaxed text-muted-foreground"
                  >
                    Was this you? Approve to keep your account secure.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Dismiss"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>

              <dl className="relative mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Device</dt>
                  <dd className="text-foreground">MacBook Pro · Safari 17</dd>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  <dt className="sr-only">Location</dt>
                  <dd className="text-foreground">Amsterdam, Netherlands</dd>
                </div>
                <div className="flex items-center gap-2">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <dt className="sr-only">Time</dt>
                  <dd className="text-muted-foreground">Just now · 192.0.2.45</dd>
                </div>
              </dl>

              <div className="relative mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default TranslucentGlassDialog;
