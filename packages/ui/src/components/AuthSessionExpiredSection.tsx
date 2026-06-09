"use client";

import React, { useEffect, useState } from "react";
import { Clock, LogIn, ShieldAlert } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthSessionExpiredSectionProps {
  className?: string;
}

const REDIRECT_SECONDS = 20;

export function AuthSessionExpiredSection({ className }: AuthSessionExpiredSectionProps) {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const progress = ((REDIRECT_SECONDS - seconds) / REDIRECT_SECONDS) * 100;

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight">Your session has expired</h2>
          <p className="text-sm text-muted-foreground/65 mt-1.5 leading-relaxed">
            For your security, you were signed out after a period of inactivity. Sign in again to pick up where you left off.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground/65" aria-live="polite">
        <Clock className="w-4 h-4 shrink-0" aria-hidden />
        Redirecting to sign in in <span className="font-semibold text-foreground tabular-nums">{seconds}s</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full rounded-full bg-foreground/[0.06] overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={REDIRECT_SECONDS}
        aria-valuenow={REDIRECT_SECONDS - seconds}
      >
        <div className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
        >
          <LogIn className="w-4 h-4" aria-hidden /> Sign in again
        </button>
        <button
          type="button"
          onClick={() => setSeconds(REDIRECT_SECONDS)}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all text-muted-foreground hover:text-foreground"
        >
          Stay on this page
        </button>
      </div>
    </div>
  );
}
