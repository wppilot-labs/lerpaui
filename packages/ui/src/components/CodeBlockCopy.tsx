"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

const CODE = `import { useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v)] as const;
}`;

export interface CodeBlockCopyProps {
  className?: string;
}

export function CodeBlockCopy({ className }: CodeBlockCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("group relative w-full max-w-md rounded-2xl border border-border bg-muted font-mono shadow-sm", className)}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-border bg-foreground/[0.04] text-muted-foreground opacity-0 transition hover:text-foreground focus:opacity-100 group-hover:opacity-100"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground/85">
        <code>{CODE}</code>
      </pre>
    </div>
  );
}
