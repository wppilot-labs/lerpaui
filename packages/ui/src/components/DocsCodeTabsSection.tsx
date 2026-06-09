"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsCodeTabsSectionProps {
  className?: string;
}

const TABS = [
  { id: "npm", label: "npm", command: "npm install @acme/ui" },
  { id: "pnpm", label: "pnpm", command: "pnpm add @acme/ui" },
  { id: "yarn", label: "yarn", command: "yarn add @acme/ui" },
] as const;

export function DocsCodeTabsSection({ className }: DocsCodeTabsSectionProps) {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("npm");
  const [copied, setCopied] = useState(false);
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  const handleCopy = () => {
    navigator.clipboard?.writeText(current.command).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div role="tablist" aria-label="Package manager" className="flex items-center gap-1 px-2 pt-2 border-b border-foreground/[0.06]">
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={selected}
              id={`codetab-${t.id}`}
              aria-controls={`codepanel-${t.id}`}
              onClick={() => {
                setActive(t.id);
                setCopied(false);
              }}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors",
                selected
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground/55 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`codepanel-${current.id}`}
        aria-labelledby={`codetab-${current.id}`}
        className="relative bg-muted p-4 pr-10 font-mono text-sm"
      >
        <span className="text-muted-foreground/40 select-none">$ </span>
        <span className="text-emerald-400/90 break-all">{current.command}</span>
        <button
          type="button"
          aria-label={`Copy ${current.label} command`}
          onClick={handleCopy}
          className="absolute right-2.5 top-2.5 p-1 rounded hover:bg-foreground/[0.05] text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
