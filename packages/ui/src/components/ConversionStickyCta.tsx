"use client";

import React, { useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface ConversionStickyCtaProps {
  className?: string;
}

export function ConversionStickyCta({ className }: ConversionStickyCtaProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <span className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="w-4 h-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold sm:text-base">Start your free 14-day trial</p>
          <p className="text-xs text-muted-foreground/65 truncate">
            No credit card required. Cancel anytime.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:px-4"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
