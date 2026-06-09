"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ArrowRight, RotateCw } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthTwoFactorOtpGridProps {
  className?: string;
  length?: number;
  contactHint?: string;
  resendSeconds?: number;
}

export function AuthTwoFactorOtpGrid({
  className,
  length = 6,
  contactHint = "jane@company.com",
  resendSeconds = 30,
}: AuthTwoFactorOtpGridProps) {
  const reduced = useReducedMotion();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [countdown, setCountdown] = useState(resendSeconds);
  const headingId = React.useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (idx: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = cleaned;
      return next;
    });
    if (cleaned && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      return next;
    });
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full bg-background px-6 py-16 md:py-24",
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <h2 id={headingId} className="mt-5 text-2xl font-black tracking-tight text-foreground">
            Two-factor verification
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the {length}-digit code we sent to <span className="font-semibold text-foreground">{contactHint}</span>.
          </p>
        </div>

        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend className="sr-only">Verification code</legend>
            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  className="h-14 w-12 rounded-xl border border-border bg-card text-center text-2xl font-black text-foreground caret-primary shadow-sm transition-all focus:border-primary focus:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!isComplete}
            className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verify and continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </button>

          <div className="mt-5 flex items-center justify-center text-xs text-muted-foreground">
            {countdown > 0 ? (
              <span>Resend code in <span className="font-semibold text-foreground">{countdown}s</span></span>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(resendSeconds)}
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden />
                Resend code
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </section>
  );
}

export default AuthTwoFactorOtpGrid;
