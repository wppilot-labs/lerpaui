"use client";

import React, { useId } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface GradientBorderCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Signature card with an animated conic-gradient border. Original IP.
 * Production scale, light + dark via tokens, reduced-motion freezes the spin.
 */
export function GradientBorderCard({
  title = "Pro plan",
  description = "Everything in Starter, plus unlimited projects, priority support, and advanced analytics.",
  children,
  className,
}: GradientBorderCardProps) {
  const reduced = usePrefersReducedMotion();
  const id = useId().replace(/:/g, "");

  return (
    <div className={cn("relative w-full max-w-sm overflow-hidden rounded-2xl p-px", className)}>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, var(--color-primary, #6366f1) 12%, transparent 28%)",
          animation: reduced ? undefined : `gbc-${id} 5s linear infinite`,
        }}
      />
      <div className="relative rounded-[15px] bg-card p-6 text-card-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {children}
      </div>
      <style>{`@keyframes gbc-${id}{to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
    </div>
  );
}
