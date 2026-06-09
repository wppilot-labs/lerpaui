"use client";

import React, { useState } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsCodeExampleSectionProps {
  className?: string;
}

const LINES: { text: string; tone?: "str" | "fn" | "comment" }[] = [
  { text: "// Initialize the client", tone: "comment" },
  { text: 'import { Acme } from "@acme/sdk";', tone: "str" },
  { text: "" },
  { text: "const acme = new Acme(process.env.ACME_KEY);" },
  { text: "" },
  { text: "const user = await acme.users.create({", tone: "fn" },
  { text: '  email: "ada@example.com",' },
  { text: '  plan: "pro",' },
  { text: "});" },
];

const TONE: Record<NonNullable<(typeof LINES)[number]["tone"]>, string> = {
  str: "text-emerald-400/90",
  fn: "text-sky-300/90",
  comment: "text-muted-foreground/40",
};

export function DocsCodeExampleSection({ className }: DocsCodeExampleSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(LINES.map((l) => l.text).join("\n")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-foreground/[0.06] bg-foreground/[0.02]">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground/70">
          <FileCode2 className="w-4 h-4 text-sky-400" />
          <span className="font-mono">create-user.ts</span>
        </div>
        <button
          type="button"
          aria-label="Copy code example"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-foreground/[0.05] text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
      </div>

      <pre className="p-4 bg-muted font-mono text-sm leading-relaxed overflow-x-auto">
        <code>
          {LINES.map((l, i) => (
            <div key={i} className="flex">
              <span className="select-none w-8 shrink-0 text-right pr-3 text-muted-foreground/25">{i + 1}</span>
              <span className={l.tone ? TONE[l.tone] : "text-foreground/85"}>{l.text || " "}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
