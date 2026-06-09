"use client";

import React from "react";
import { Chrome, Slack, Github, Figma, Instagram, Twitter } from "lucide-react";
import { cn } from "../lib/cn";

export function InfiniteBentoMarquee({ className }: { className?: string }) {
  const icons = [
    { Icon: Github, label: "GitHub" },
    { Icon: Slack, label: "Slack" },
    { Icon: Figma, label: "Figma" },
    { Icon: Chrome, label: "Chrome" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Twitter, label: "Twitter" },
  ];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl overflow-hidden space-y-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">Bento Loop Marquee</h3>
        <p className="text-[10px] text-muted-foreground">Endless seamless horizontal slider</p>
      </div>

      <div className="relative flex w-full overflow-hidden bg-zinc-950/60 rounded-xl border border-border/40 py-3.5">
        <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full">
          {icons.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 border border-border/30 rounded-lg text-xs font-bold text-foreground/80 shrink-0"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
