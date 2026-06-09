"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface AnnouncementBarSimpleProps {
  className?: string;
}

export function AnnouncementBarSimple({ className }: AnnouncementBarSimpleProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 text-center text-sm">
        <Megaphone className="w-4 h-4 shrink-0 text-primary" />
        <span className="text-muted-foreground">
          We just shipped v2.4 —{" "}
          <a href="/" className="font-semibold text-foreground underline-offset-2 hover:underline">
            read the changelog
          </a>
        </span>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Dismiss announcement"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:bg-foreground/[0.05] hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
