"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Sdk = {
  id: string;
  label: string;
  install: string;
  snippet: string;
};

const SDKS: Sdk[] = [
  {
    id: "node",
    label: "Node.js",
    install: "npm install @acme/sdk",
    snippet: 'import { Acme } from "@acme/sdk";\nconst acme = new Acme(API_KEY);',
  },
  {
    id: "python",
    label: "Python",
    install: "pip install acme-sdk",
    snippet: "from acme import Acme\nacme = Acme(api_key=API_KEY)",
  },
  {
    id: "go",
    label: "Go",
    install: "go get github.com/acme/acme-go",
    snippet: 'client := acme.New("API_KEY")',
  },
  {
    id: "ruby",
    label: "Ruby",
    install: "gem install acme",
    snippet: 'Acme.api_key = "API_KEY"',
  },
];

export interface APISDKInstallTabsProps {
  className?: string;
}

export function APISDKInstallTabs({ className }: APISDKInstallTabsProps) {
  const [active, setActive] = useState("node");
  const [copied, setCopied] = useState(false);
  const sdk = SDKS.find((s) => s.id === active) ?? SDKS[0];

  const copy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="px-4 pt-4">
        <h3 className="text-base font-bold mb-3">Install the SDK</h3>
        <div
          role="tablist"
          aria-label="SDK language"
          className="flex gap-1 border-b border-border -mb-px"
        >
          {SDKS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "px-3 py-2 text-xs font-semibold border-b-2 transition-colors",
                active === s.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <div className="relative bg-muted border border-border rounded-xl px-3 py-2.5 pr-10">
          <span className="text-muted-foreground select-none mr-1.5">$</span>
          <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{sdk.install}</code>
          <button
            type="button"
            aria-label="Copy install command"
            onClick={copy}
            className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <pre className="bg-muted border border-border rounded-xl px-3 py-2.5 text-xs leading-relaxed font-mono text-muted-foreground overflow-x-auto">
          {sdk.snippet}
        </pre>
      </div>
    </div>
  );
}
