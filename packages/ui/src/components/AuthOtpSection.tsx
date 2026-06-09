"use client";

import React, { useEffect, useRef, useState } from "react";
import { MailOpen, RotateCw } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthOtpSectionProps {
  className?: string;
}

const LENGTH = 6;
const RESEND_SECONDS = 30;

export function AuthOtpSection({ className }: AuthOtpSectionProps) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setDigit = (idx: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = cleaned;
      return next;
    });
    if (cleaned && idx < LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus();
    else if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
    else if (e.key === "ArrowRight" && idx < LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]!;
      return next;
    });
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const complete = digits.every((d) => d !== "");

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <MailOpen className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-2xl font-black leading-tight">Enter your verification code</h2>
          <p className="text-sm text-muted-foreground/65 mt-1 leading-relaxed">
            We sent a 6-digit one-time code to <span className="font-semibold text-foreground">dev@acme.io</span>. It&apos;s
            valid for the next 10 minutes.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="sr-only">One-time code</legend>
          <div className="flex items-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                <input
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  className="h-14 flex-1 min-w-0 rounded-xl bg-foreground/[0.03] border border-foreground/[0.08] text-center text-2xl font-bold caret-primary focus:border-primary/40 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                />
                {i === 2 && <span className="text-muted-foreground/30 font-bold" aria-hidden>–</span>}
              </React.Fragment>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={!complete}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Verify and continue
          </button>
          {countdown > 0 ? (
            <span className="text-xs text-muted-foreground/60">
              Resend code in <span className="font-semibold text-foreground tabular-nums">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(RESEND_SECONDS)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <RotateCw className="w-4 h-4" aria-hidden /> Resend code
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
