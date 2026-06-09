"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsExampleGalleryProps {
  className?: string;
}

type Example = { title: string; tag: string; from: string; to: string };

const EXAMPLES: Example[] = [
  { title: "SaaS Dashboard", tag: "App", from: "#6366f1", to: "#8b5cf6" },
  { title: "Pricing Page", tag: "Marketing", from: "#0ea5e9", to: "#22d3ee" },
  { title: "Auth Flow", tag: "Starter", from: "#10b981", to: "#34d399" },
  { title: "Blog Theme", tag: "Content", from: "#f59e0b", to: "#fb7185" },
];

export function DocsExampleGallery({ className }: DocsExampleGalleryProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Showcase</p>
        <h3 className="text-base font-bold mt-0.5">Example gallery</h3>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {EXAMPLES.map((ex) => (
          <a
            key={ex.title}
            href="/"
            onMouseEnter={() => setHovered(ex.title)}
            onMouseLeave={() => setHovered(null)}
            className="group rounded-xl border border-foreground/[0.06] overflow-hidden hover:border-foreground/[0.12] transition-colors"
          >
            <div
              className="relative h-24 flex items-end p-2.5"
              style={{ backgroundImage: `linear-gradient(135deg, ${ex.from}, ${ex.to})` }}
            >
              <ArrowUpRight
                className={cn(
                  "absolute top-2 right-2 w-4 h-4 text-white/80 transition-transform",
                  hovered === ex.title && "translate-x-0.5 -translate-y-0.5",
                )}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/25 px-1.5 py-0.5 rounded">
                {ex.tag}
              </span>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">{ex.title}</p>
              <p className="text-xs text-muted-foreground/50">Live preview &amp; source</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
