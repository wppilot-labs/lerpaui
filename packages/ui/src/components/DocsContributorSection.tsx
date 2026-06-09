"use client";

import React from "react";
import { Github } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsContributorSectionProps {
  className?: string;
}

type Contributor = { name: string; handle: string; commits: number; hue: number };

const CONTRIBUTORS: Contributor[] = [
  { name: "Ada Lovelace", handle: "ada", commits: 482, hue: 200 },
  { name: "Grace Hopper", handle: "ghopper", commits: 311, hue: 150 },
  { name: "Linus Park", handle: "lpark", commits: 197, hue: 40 },
  { name: "Mara Vance", handle: "mara", commits: 88, hue: 330 },
  { name: "Tom Reyes", handle: "treyes", commits: 54, hue: 270 },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DocsContributorSection({ className }: DocsContributorSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Community</p>
          <h3 className="text-base font-bold mt-0.5">Contributors</h3>
        </div>
        <span className="text-xs text-muted-foreground/45">128 total</span>
      </div>

      <ul className="space-y-1">
        {CONTRIBUTORS.map((c) => (
          <li
            key={c.handle}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-foreground/[0.02] transition-colors"
          >
            <span
              aria-hidden
              className="grid place-items-center h-10 w-10 rounded-full text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: `hsl(${c.hue} 55% 45%)` }}
            >
              {initials(c.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground/50 font-mono truncate">@{c.handle}</p>
            </div>
            <span className="text-xs text-muted-foreground/60 tabular-nums">{c.commits} commits</span>
            <a
              href={`https://github.com/${c.handle}`}
              aria-label={`${c.name} on GitHub`}
              className="text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
