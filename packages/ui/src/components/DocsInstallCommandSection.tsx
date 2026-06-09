"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsInstallCommandSectionProps {
  className?: string;
}

const COMMAND = "npm install @acme/ui";

export function DocsInstallCommandSection({ className }: DocsInstallCommandSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(COMMAND).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground/55">Install</h3>
      </div>

      <p className="text-sm text-muted-foreground/60 mb-3 leading-relaxed">
        Add the package to your project with your preferred package manager.
      </p>

      <div className="relative rounded-xl bg-muted border border-foreground/[0.05] p-4 pr-10 font-mono text-sm">
        <span className="text-muted-foreground/40 select-none">$ </span>
        <span className="text-emerald-400/90">{COMMAND}</span>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={handleCopy}
          className="absolute right-2.5 top-2.5 p-1 rounded hover:bg-foreground/[0.05] text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
