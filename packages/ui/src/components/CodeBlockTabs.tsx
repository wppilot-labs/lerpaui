"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Tab = { label: string; code: string };

const TABS: Tab[] = [
  {
    label: "index.ts",
    code: `export { Button } from "./button";
export { Card } from "./card";
export { Input } from "./input";`,
  },
  {
    label: "button.tsx",
    code: `export function Button(props: ButtonProps) {
  return <button className="btn" {...props} />;
}`,
  },
  {
    label: "styles.css",
    code: `.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}`,
  },
];

export interface CodeBlockTabsProps {
  className?: string;
}

export function CodeBlockTabs({ className }: CodeBlockTabsProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = TABS[active] ?? TABS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted font-mono shadow-sm", className)}>
      <div className="flex items-center justify-between border-b border-border bg-foreground/[0.02] pl-2 pr-2">
        <div role="tablist" aria-label="Source files" className="flex">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={cn(
                "border-b-2 px-3 py-2.5 text-xs transition-colors",
                active === i
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground/85">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
