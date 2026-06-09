"use client";

import React, { useRef, useState } from "react";
import { Smartphone, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthOTPVerificationProps {
  className?: string;
}

const LENGTH = 6;

export function AuthOTPVerification({ className }: AuthOTPVerificationProps) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

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
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-4">
        <Smartphone className="w-6 h-6" aria-hidden />
      </div>
      <h3 className="text-lg font-bold">Verify your phone</h3>
      <p className="text-sm text-muted-foreground/65 mt-1.5 leading-relaxed">
        Enter the 6-digit code we texted to <span className="font-semibold text-foreground">+1 (•••) •••-4821</span>.
      </p>

      <form onSubmit={(e) => e.preventDefault()} className="mt-5">
        <fieldset>
          <legend className="sr-only">One-time verification code</legend>
          <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
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
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1}`}
                className="h-14 w-12 rounded-xl bg-foreground/[0.03] border border-foreground/[0.08] text-center text-2xl font-bold caret-primary focus:border-primary/40 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
              />
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!complete}
          className="w-full mt-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-1.5"
        >
          Verify code
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
      </form>

      <p className="text-xs text-muted-foreground/60 mt-4">
        Didn&apos;t get a code?{" "}
        <button type="button" className="font-semibold text-primary hover:underline">
          Resend
        </button>
      </p>
    </div>
  );
}
