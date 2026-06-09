"use client";

import React, { useState } from "react";
import { ListTree } from "lucide-react";
import { cn } from "../lib/cn";

type Heading = { id: string; label: string; level: 2 | 3 };

const HEADINGS: Heading[] = [
  { id: "intro", label: "Introduction", level: 2 },
  { id: "problem", label: "The problem with cold starts", level: 2 },
  { id: "measuring", label: "Measuring p99 latency", level: 3 },
  { id: "edge-cache", label: "Moving to edge caching", level: 2 },
  { id: "invalidation", label: "Cache invalidation strategy", level: 3 },
  { id: "results", label: "Results & benchmarks", level: 2 },
  { id: "takeaways", label: "Key takeaways", level: 2 },
];

export interface BlogTableOfContentsProps {
  className?: string;
}

export function BlogTableOfContents({ className }: BlogTableOfContentsProps) {
  const [active, setActive] = useState("edge-cache");

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <ListTree className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
          On this page
        </span>
      </div>

      <ul className="space-y-0.5">
        {HEADINGS.map((h) => {
          const isActive = active === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(h.id)}
                className={cn(
                  "flex items-center gap-2 border-l-2 py-1.5 text-xs leading-snug transition-colors",
                  h.level === 3 ? "pl-5" : "pl-3",
                  isActive
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {h.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
