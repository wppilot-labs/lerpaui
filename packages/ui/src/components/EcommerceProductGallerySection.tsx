"use client";

import React, { useState } from "react";
import { Expand } from "lucide-react";
import { cn } from "../lib/cn";

const VIEWS = [
  { id: "front", label: "Front", tone: "from-orange-400/30 to-amber-500/20" },
  { id: "side", label: "Side", tone: "from-rose-400/30 to-pink-500/20" },
  { id: "back", label: "Back", tone: "from-violet-400/30 to-purple-500/20" },
  { id: "detail", label: "Detail", tone: "from-sky-400/30 to-blue-500/20" },
];

export interface EcommerceProductGallerySectionProps {
  className?: string;
}

export function EcommerceProductGallerySection({ className }: EcommerceProductGallerySectionProps) {
  const [active, setActive] = useState(0);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className={cn("relative aspect-[4/5] rounded-xl border border-foreground/[0.05] bg-gradient-to-br", VIEWS[active].tone)}>
        <span className="absolute left-3 top-3 text-xs font-medium bg-background/60 backdrop-blur px-2 py-1 rounded-md text-muted-foreground">
          {VIEWS[active].label}
        </span>
        <button
          type="button"
          aria-label="Expand image"
          className="absolute right-3 top-3 h-9 w-9 rounded-md bg-background/60 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground transition"
        >
          <Expand className="w-4 h-4" />
        </button>
        <span className="absolute bottom-3 right-3 text-xs text-muted-foreground/70 bg-background/60 backdrop-blur px-2 py-1 rounded-md">
          {active + 1} / {VIEWS.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`View ${v.label}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "aspect-square rounded-lg bg-gradient-to-br border transition",
              v.tone,
              i === active ? "border-primary ring-1 ring-primary/40" : "border-foreground/[0.06] opacity-70 hover:opacity-100",
            )}
          />
        ))}
      </div>
    </div>
  );
}
