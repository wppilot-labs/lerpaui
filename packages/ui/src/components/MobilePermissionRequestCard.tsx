"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "../lib/cn";

const REASONS = [
  "Show nearby results and stores",
  "Improve delivery time estimates",
  "Tag photos with where they were taken",
];

export interface MobilePermissionRequestCardProps {
  className?: string;
}

export function MobilePermissionRequestCard({ className }: MobilePermissionRequestCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <MapPin className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold">Allow location access?</h3>
      <p className="mt-1.5 text-sm text-muted-foreground/70 leading-relaxed">
        We use your location to personalize your experience. You can change this
        anytime in settings.
      </p>

      <ul className="mt-4 space-y-2 text-left">
        {REASONS.map((reason) => (
          <li key={reason} className="flex items-start gap-2 text-xs text-muted-foreground/75">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {reason}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Allow while using the app
        </button>
        <button
          type="button"
          className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground/70 transition hover:bg-foreground/[0.04] hover:text-foreground"
        >
          Don&apos;t allow
        </button>
      </div>
    </div>
  );
}
