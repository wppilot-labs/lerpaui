"use client";

import { useState } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";
import { cn } from "../lib/cn";

const FILENAME = "fetch-user.ts";
const CODE = `async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}`;

export interface CodeBlockWithCopyProps {
  className?: string;
}

export function CodeBlockWithCopy({ className }: CodeBlockWithCopyProps) {
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

  const lines = CODE.split("\n");

  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted font-mono shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-border bg-foreground/[0.02] px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileCode2 className="h-4 w-4" />
          <span className="text-xs">{FILENAME}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.04] px-2 py-1 text-xs text-muted-foreground transition hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground/85">
        <code className="grid">
          {lines.map((line, i) => (
            <span key={i} className="grid grid-cols-[1.5rem_1fr] gap-3">
              <span className="select-none text-right text-muted-foreground/40">{i + 1}</span>
              <span>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
