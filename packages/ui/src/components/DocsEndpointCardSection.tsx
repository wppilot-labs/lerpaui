"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsEndpointCardSectionProps {
  className?: string;
}

export function DocsEndpointCardSection({ className }: DocsEndpointCardSectionProps) {
  const [copied, setCopied] = useState(false);
  const path = "https://api.acme.dev/v1/charges";

  const handleCopy = () => {
    navigator.clipboard?.writeText(path).catch(() => {});
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
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-foreground/[0.06]">
        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
          POST
        </span>
        <code className="flex-1 text-sm font-mono text-foreground/90 truncate">/v1/charges</code>
        <button
          type="button"
          aria-label="Copy endpoint URL"
          onClick={handleCopy}
          className="p-1 rounded hover:bg-foreground/[0.05] text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-sm text-muted-foreground/75 leading-relaxed">
          Create a charge against a customer&apos;s saved payment method. Returns the created charge object on success.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-foreground/[0.04] text-muted-foreground/60">
            Idempotent
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-foreground/[0.04] text-muted-foreground/60">
            Requires auth
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/90">
            Rate limited
          </span>
        </div>

        <div className="rounded-lg bg-muted border border-foreground/[0.05] p-3.5 font-mono text-xs leading-relaxed">
          <span className="text-muted-foreground/45 select-none">$ curl -X POST </span>
          <span className="text-sky-300/90 break-all">{path}</span>
          {"\n"}
          <span className="text-muted-foreground/45 select-none">  -H </span>
          <span className="text-emerald-400/90">&quot;Authorization: Bearer sk_live_…&quot;</span>
        </div>
      </div>
    </div>
  );
}
