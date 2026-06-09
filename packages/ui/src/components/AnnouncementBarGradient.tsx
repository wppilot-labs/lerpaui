"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface AnnouncementBarGradientProps {
  className?: string;
}

export function AnnouncementBarGradient({ className }: AnnouncementBarGradientProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-4 py-3 text-white shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 text-center text-sm font-medium">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>
          <span className="font-bold">Spring sale</span> — 40% off all annual plans this week
        </span>
        <a
          href="/"
          className="hidden items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm transition hover:bg-white/30 sm:inline-flex"
        >
          Claim offer <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Dismiss announcement"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
