"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthAccountCreatedSuccessProps {
  className?: string;
}

export function AuthAccountCreatedSuccess({ className }: AuthAccountCreatedSuccessProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-6 w-6" strokeWidth={3} />
        </span>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-foreground">Account created</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
        Your workspace is ready. We&apos;ve sent a confirmation to your inbox so you can verify your email
        anytime.
      </p>

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Continue to dashboard
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default AuthAccountCreatedSuccess;
