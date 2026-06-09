"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface DocsChangelogSectionProps {
  className?: string;
}

type Tag = "Added" | "Fixed" | "Changed";

type Release = {
  version: string;
  date: string;
  entries: { tag: Tag; text: string }[];
};

const TAG_STYLES: Record<Tag, string> = {
  Added: "bg-emerald-500/15 text-emerald-400",
  Fixed: "bg-sky-500/15 text-sky-400",
  Changed: "bg-amber-500/15 text-amber-400",
};

const RELEASES: Release[] = [
  {
    version: "v2.4.0",
    date: "May 28, 2026",
    entries: [
      { tag: "Added", text: "Server-driven theming with runtime CSS variables." },
      { tag: "Fixed", text: "Focus ring clipped inside scroll containers." },
    ],
  },
  {
    version: "v2.3.1",
    date: "May 9, 2026",
    entries: [
      { tag: "Changed", text: "Dropped legacy peer dependency on react-dom 17." },
      { tag: "Fixed", text: "Tooltip arrow misaligned on RTL layouts." },
    ],
  },
];

export function DocsChangelogSection({ className }: DocsChangelogSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-5">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Changelog</p>
        <h3 className="text-base font-bold mt-0.5">What&apos;s new</h3>
      </header>

      <ol className="relative border-l border-foreground/[0.08] ml-1 space-y-6">
        {RELEASES.map((r) => (
          <li key={r.version} className="ml-4">
            <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
            <div className="flex items-baseline gap-2">
              <h4 className="text-base font-bold font-mono text-foreground">{r.version}</h4>
              <time className="text-xs text-muted-foreground/45">{r.date}</time>
            </div>
            <ul className="mt-2 space-y-1.5">
              {r.entries.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className={cn(
                      "shrink-0 mt-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded",
                      TAG_STYLES[e.tag],
                    )}
                  >
                    {e.tag}
                  </span>
                  <span className="text-muted-foreground/75 leading-relaxed">{e.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
