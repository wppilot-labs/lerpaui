"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

const PKG = "@tanstack/react-query";

const MANAGERS = [
  { id: "npm", label: "npm", cmd: `npm install ${PKG}` },
  { id: "pnpm", label: "pnpm", cmd: `pnpm add ${PKG}` },
  { id: "yarn", label: "yarn", cmd: `yarn add ${PKG}` },
  { id: "bun", label: "bun", cmd: `bun add ${PKG}` },
];

export interface PackageInstallPanelProps {
  className?: string;
}

export function PackageInstallPanel({ className }: PackageInstallPanelProps) {
  const [active, setActive] = useState("npm");
  const [copied, setCopied] = useState(false);
  const current = MANAGERS.find((m) => m.id === active)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-2xl border border-border/50 bg-card/70 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div role="tablist" aria-label="Package manager" className="flex border-b border-foreground/[0.06]">
        {MANAGERS.map((m) => {
          const isActive = active === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(m.id)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground/55 hover:text-foreground",
              )}
            >
              {m.label}
              {isActive && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 px-4 py-3.5">
        <Terminal className="h-5 w-5 shrink-0 text-primary" />
        <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-muted-foreground">
          <span className="select-none text-muted-foreground/40">$ </span>
          {current.cmd}
        </code>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={handleCopy}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
