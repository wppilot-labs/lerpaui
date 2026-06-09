"use client";

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthEmailVerificationCardProps {
  className?: string;
}

const RESEND_SECONDS = 45;
const EMAIL = "jordan.rivera@example.com";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

export function AuthEmailVerificationCard({ className }: AuthEmailVerificationCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const canResend = secondsLeft <= 0;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Mail className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-foreground">Verify your email</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
        We sent a verification link to{" "}
        <span className="font-medium text-foreground">{maskEmail(EMAIL)}</span>. Open it to activate your
        account.
      </p>

      <button
        type="button"
        disabled={!canResend}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          canResend
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        {canResend ? "Resend email" : `Resend in ${secondsLeft}s`}
      </button>

      <p className="mt-4 text-xs text-muted-foreground">
        Wrong address?{" "}
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Change email
        </button>
      </p>
    </div>
  );
}

export default AuthEmailVerificationCard;
