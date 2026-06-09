"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsCliCommandSectionProps {
  className?: string;
}

const COMMAND = "acme deploy --env production --force";

const FLAGS: { flag: string; desc: string }[] = [
  { flag: "--env <name>", desc: "Target environment to deploy to." },
  { flag: "--force", desc: "Skip the interactive confirmation prompt." },
  { flag: "--dry-run", desc: "Print the plan without applying changes." },
];

export function DocsCliCommandSection({ className }: DocsCliCommandSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(COMMAND).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground/55">
          Deploy command
        </h3>
      </div>

      <div className="relative rounded-xl bg-muted border border-foreground/[0.05] p-4 pr-10 font-mono text-sm">
        <span className="text-muted-foreground/40 select-none">$ </span>
        <span className="text-emerald-400/90 break-all">{COMMAND}</span>
        <button
          type="button"
          aria-label="Copy command"
          onClick={handleCopy}
          className="absolute right-2.5 top-2.5 p-1 rounded hover:bg-foreground/[0.05] text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <dl className="mt-4 space-y-2.5">
        {FLAGS.map((f) => (
          <div key={f.flag} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
            <dt className="shrink-0 w-44 font-mono text-sm text-sky-300/90">{f.flag}</dt>
            <dd className="text-sm text-muted-foreground/65 leading-relaxed">{f.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
