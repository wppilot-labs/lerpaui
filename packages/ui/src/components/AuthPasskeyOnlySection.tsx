"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Fingerprint, ShieldCheck, KeyRound, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthPasskeyOnlySectionProps {
  className?: string;
  brandName?: string;
}

const BENEFITS = [
  { icon: ShieldCheck, label: "Phishing-resistant by design" },
  { icon: Fingerprint, label: "Unlock with Face ID or Touch ID" },
  { icon: KeyRound, label: "No password to remember" },
];

export function AuthPasskeyOnlySection({
  className,
  brandName = "Lerpa UI",
}: AuthPasskeyOnlySectionProps) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<"idle" | "verifying" | "done">("idle");
  const headingId = React.useId();

  const handleAuth = () => {
    setState("verifying");
    setTimeout(() => setState("done"), 1500);
    setTimeout(() => setState("idle"), 3500);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden bg-background px-6 py-16 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.22_260/0.18),transparent_55%)]" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md"
      >
        <div className="text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={reduced ? undefined : { duration: 2.4, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
              aria-hidden
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
              <Fingerprint className="h-10 w-10 text-primary" aria-hidden />
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" aria-hidden />
            {brandName} · Passwordless
          </div>

          <h2 id={headingId} className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Sign in with passkey
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Skip the password. Authenticate with your device&apos;s biometrics or PIN.
          </p>
        </div>

        <ul className="mt-7 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b.label} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm text-foreground">{b.label}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleAuth}
          disabled={state === "verifying"}
          className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed"
        >
          {state === "idle" && (
            <>
              <Fingerprint className="h-4 w-4" aria-hidden />
              Continue with passkey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
            </>
          )}
          {state === "verifying" && (
            <>
              <motion.span
                animate={reduced ? undefined : { rotate: 360 }}
                transition={reduced ? undefined : { duration: 1, ease: "linear", repeat: Infinity }}
                className="inline-block"
                aria-hidden
              >
                <Fingerprint className="h-4 w-4" />
              </motion.span>
              Verifying...
            </>
          )}
          {state === "done" && (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Welcome back
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          New here?{" "}
          <a href="/" className="font-semibold text-primary hover:underline">Create an account</a>
        </p>
      </motion.div>
    </section>
  );
}

export default AuthPasskeyOnlySection;
