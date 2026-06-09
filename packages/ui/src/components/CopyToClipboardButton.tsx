"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface CopyToClipboardButtonProps {
  className?: string;
}

const VALUE = "sk_live_a1b2c3d4e5f6g7h8";

export function CopyToClipboardButton({ className }: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(VALUE);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-foreground/[0.03] px-3 py-2 font-mono text-sm text-foreground/90 transition-colors hover:bg-foreground/[0.06]",
        className
      )}
    >
      <span className="text-muted-foreground">{VALUE}</span>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
