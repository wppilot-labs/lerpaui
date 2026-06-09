"use client";

import React, { useState } from "react";
import { Package, Copy, Check, Tag, HardDrive, Boxes } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsPackageInstallPanelProps {
  className?: string;
}

const PKG = {
  name: "@acme/ui",
  version: "2.4.0",
  size: "42 kB",
  deps: 3,
};

const COMMAND = `npm install ${PKG.name}@${PKG.version}`;

export function DocsPackageInstallPanel({ className }: DocsPackageInstallPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(COMMAND).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-foreground/[0.06]">
        <span className="grid place-items-center h-11 w-11 rounded-lg bg-primary/10 text-primary shrink-0">
          <Package className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-base font-bold font-mono truncate">{PKG.name}</p>
          <p className="text-xs text-muted-foreground/50">Latest stable release</p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-foreground/[0.05] border-b border-foreground/[0.06] text-center">
        <div className="py-3">
          <Tag className="w-4 h-4 mx-auto text-muted-foreground/40 mb-1" />
          <p className="text-sm font-semibold">v{PKG.version}</p>
        </div>
        <div className="py-3">
          <HardDrive className="w-4 h-4 mx-auto text-muted-foreground/40 mb-1" />
          <p className="text-sm font-semibold">{PKG.size}</p>
        </div>
        <div className="py-3">
          <Boxes className="w-4 h-4 mx-auto text-muted-foreground/40 mb-1" />
          <p className="text-sm font-semibold">{PKG.deps} deps</p>
        </div>
      </div>

      <div className="p-5">
        <div className="relative rounded-xl bg-muted border border-foreground/[0.05] p-4 pr-10 font-mono text-sm">
          <span className="text-muted-foreground/40 select-none">$ </span>
          <span className="text-emerald-400/90 break-all">{COMMAND}</span>
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
    </div>
  );
}
