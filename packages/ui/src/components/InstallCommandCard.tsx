"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

const PKG = "@acme/ui";
const MANAGERS = [
  { id: "npm", cmd: `npm install ${PKG}` },
  { id: "pnpm", cmd: `pnpm add ${PKG}` },
  { id: "yarn", cmd: `yarn add ${PKG}` },
  { id: "bun", cmd: `bun add ${PKG}` },
] as const;

export interface InstallCommandCardProps {
  className?: string;
}

export function InstallCommandCard({ className }: InstallCommandCardProps) {
  const [active, setActive] = useState<(typeof MANAGERS)[number]["id"]>("pnpm");
  const [copied, setCopied] = useState(false);
  const current = MANAGERS.find((m) => m.id === active) ?? MANAGERS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("w-full max-w-md rounded-2xl border border-border bg-muted backdrop-blur-xl shadow-xl overflow-hidden font-sans", className)}>
      <div className="flex items-center justify-between border-b border-foreground/[0.06] px-3 pt-2">
        <div role="tablist" aria-label="Package manager" className="flex gap-1">
          {MANAGERS.map((m) => {
            const on = m.id === active;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => { setActive(m.id); setCopied(false); }}
                className={cn(
                  "text-xs font-semibold px-3 py-2.5 -mb-px border-b-2 transition-colors",
                  on ? "border-primary text-foreground" : "border-transparent text-muted-foreground/55 hover:text-foreground",
                )}
              >
                {m.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto font-mono text-sm text-muted-foreground">
          <Terminal className="w-4 h-4 text-primary shrink-0" />
          <span className="whitespace-nowrap select-all">{current.cmd}</span>
        </div>
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy install command"}
          onClick={copy}
          className="shrink-0 p-2 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
