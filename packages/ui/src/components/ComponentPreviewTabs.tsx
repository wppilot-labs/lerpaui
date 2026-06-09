"use client";

import { useState } from "react";
import { Eye, Code2, Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

const CODE = `import { Badge } from "@/components/badge";

export default function Example() {
  return <Badge variant="success">Active</Badge>;
}`;

export interface ComponentPreviewTabsProps {
  className?: string;
}

export function ComponentPreviewTabs({ className }: ComponentPreviewTabsProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
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
    <div className={cn("w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm backdrop-blur-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
        <div role="tablist" aria-label="Component preview" className="flex gap-1">
          <button
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              tab === "preview" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            role="tab"
            aria-selected={tab === "code"}
            onClick={() => setTab("code")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              tab === "code" ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-4 w-4" />
            Code
          </button>
        </div>

        {tab === "code" && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div className="grid min-h-[140px] place-items-center bg-foreground/[0.01] p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
      ) : (
        <pre className="min-h-[140px] overflow-x-auto bg-muted p-5 font-mono text-xs leading-relaxed text-foreground/85">
          <code>{CODE}</code>
        </pre>
      )}
    </div>
  );
}
