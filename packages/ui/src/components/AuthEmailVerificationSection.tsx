"use client";

import React, { useEffect, useState } from "react";
import { MailCheck, RotateCw, PenLine, Inbox } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthEmailVerificationSectionProps {
  className?: string;
}

const RESEND_SECONDS = 45;

export function AuthEmailVerificationSection({ className }: AuthEmailVerificationSectionProps) {
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-7 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-5">
        <MailCheck className="w-7 h-7" aria-hidden />
      </div>

      <h2 className="text-2xl font-black leading-tight">Verify your email address</h2>
      <p className="text-sm text-muted-foreground/65 mt-2 leading-relaxed max-w-sm mx-auto">
        We sent a verification link to <span className="font-semibold text-foreground">jordan@acme.io</span>. Click the link in
        that email to activate your account.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          type="button"
          disabled={countdown > 0}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <RotateCw className="w-4 h-4" aria-hidden />
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend email"}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-secondary border border-foreground/[0.06] hover:brightness-110 transition-all"
        >
          <PenLine className="w-4 h-4" aria-hidden /> Change email
        </button>
      </div>

      <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] text-left">
        <Inbox className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" aria-hidden />
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          Can&apos;t find it? Check your spam or promotions folder. The link expires 24 hours after it was sent.
        </p>
      </div>
    </div>
  );
}
