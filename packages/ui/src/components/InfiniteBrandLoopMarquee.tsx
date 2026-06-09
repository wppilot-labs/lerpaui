"use client";

import React from "react";
import { Slack, Figma, Github, Chrome, Twitter } from "lucide-react";
import { cn } from "../lib/cn";

export interface BrandLoopItem {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
}

export interface InfiniteBrandLoopMarqueeProps {
  className?: string;
  title?: string;
  subtitle?: string;
  brands?: BrandLoopItem[];
}

const DEFAULT_BRANDS: BrandLoopItem[] = [
  { Icon: Slack, name: "Slack" },
  { Icon: Figma, name: "Figma" },
  { Icon: Github, name: "GitHub" },
  { Icon: Chrome, name: "Chrome" },
  { Icon: Twitter, name: "Twitter" },
];

export function InfiniteBrandLoopMarquee({
  className,
  title = "Integrations",
  subtitle = "Lightweight brand loop marquee",
  brands = DEFAULT_BRANDS,
}: InfiniteBrandLoopMarqueeProps) {

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/45 p-5 backdrop-blur-xl shadow-2xl overflow-hidden space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative flex w-full overflow-hidden bg-zinc-950/60 rounded-xl border border-border/40 py-3.5">
        <div className="flex gap-6 animate-marquee whitespace-nowrap min-w-full">
          {brands.map((b, idx) => {
            const Icon = b.Icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 border border-border/30 rounded-lg text-xs font-bold text-foreground/80 shrink-0"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
