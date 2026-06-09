"use client";

import React from "react";
import { MessageCircle, Mail, Github, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsSupportSectionProps {
  className?: string;
}

type Channel = {
  title: string;
  desc: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const CHANNELS: Channel[] = [
  { title: "Community Discord", desc: "Chat with the team and other developers.", action: "Join server", icon: MessageCircle, href: "#" },
  { title: "Email support", desc: "Reach us for account or billing issues.", action: "support@acme.dev", icon: Mail, href: "mailto:support@acme.dev" },
  { title: "GitHub issues", desc: "Report bugs or request a feature.", action: "Open an issue", icon: Github, href: "#" },
  { title: "Browse guides", desc: "Find answers in the documentation.", action: "Read docs", icon: BookOpen, href: "#" },
];

export function DocsSupportSection({ className }: DocsSupportSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Help</p>
        <h3 className="text-base font-bold mt-0.5">Need support?</h3>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col gap-2 p-4 rounded-xl border border-foreground/[0.06] hover:border-foreground/[0.12] hover:bg-foreground/[0.02] transition-colors"
            >
              <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <p className="text-xs text-muted-foreground/60 leading-relaxed flex-1">{c.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                {c.action}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
