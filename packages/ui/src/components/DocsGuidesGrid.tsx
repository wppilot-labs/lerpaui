"use client";

import React from "react";
import { Rocket, Palette, Lock, Plug, Gauge, BookOpen } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsGuidesGridProps {
  className?: string;
}

type Guide = {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  minutes: number;
};

const GUIDES: Guide[] = [
  { title: "Getting started", desc: "Install the SDK and ship your first request.", icon: Rocket, minutes: 5 },
  { title: "Theming", desc: "Customize tokens, colors, and dark mode.", icon: Palette, minutes: 8 },
  { title: "Authentication", desc: "Manage API keys and OAuth scopes.", icon: Lock, minutes: 6 },
  { title: "Webhooks", desc: "Receive and verify event payloads.", icon: Plug, minutes: 10 },
  { title: "Rate limits", desc: "Understand quotas and backoff strategy.", icon: Gauge, minutes: 4 },
  { title: "Migration", desc: "Upgrade from v1 to v2 cleanly.", icon: BookOpen, minutes: 12 },
];

export function DocsGuidesGrid({ className }: DocsGuidesGridProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Learn</p>
        <h3 className="text-base font-bold mt-0.5">Guides</h3>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GUIDES.map((g) => {
          const Icon = g.icon;
          return (
            <a
              key={g.title}
              href="/"
              className="group flex flex-col gap-2 p-4 rounded-xl border border-foreground/[0.06] hover:border-foreground/[0.12] hover:bg-foreground/[0.02] transition-colors"
            >
              <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-semibold">{g.title}</h4>
              <p className="text-xs text-muted-foreground/60 leading-relaxed flex-1">{g.desc}</p>
              <span className="text-[11px] text-muted-foreground/40">{g.minutes} min read</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
