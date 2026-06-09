"use client";

import React, { useState } from "react";
import { Copy, Check, Braces } from "lucide-react";
import { cn } from "../lib/cn";

type Tab = "body" | "headers";

const BODY: { line: string }[] = [
  { line: "{" },
  { line: '  "id": "evt_3kP9",' },
  { line: '  "type": "payment.succeeded",' },
  { line: '  "livemode": true,' },
  { line: '  "amount": 4900,' },
  { line: '  "currency": "usd",' },
  { line: '  "customer": "cus_8aZ12"' },
  { line: "}" },
];

const HEADERS: [string, string][] = [
  ["content-type", "application/json"],
  ["request-id", "req_91baf2"],
  ["ratelimit-remaining", "4982"],
  ["cache-control", "no-store"],
];

function colorize(line: string) {
  const m = line.match(/^(\s*)"([^"]+)":\s*(.*?)(,?)$/);
  if (!m) return <span className="text-muted-foreground">{line}</span>;
  const [, indent, key, val, comma] = m;
  const isString = val.startsWith('"');
  return (
    <>
      {indent}
      <span className="text-sky-600 dark:text-sky-400">&quot;{key}&quot;</span>
      <span className="text-muted-foreground">: </span>
      <span className={isString ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{val}</span>
      <span className="text-muted-foreground">{comma}</span>
    </>
  );
}

export interface APIResponseViewerProps {
  className?: string;
}

export function APIResponseViewer({ className }: APIResponseViewerProps) {
  const [tab, setTab] = useState<Tab>("body");
  const [copied, setCopied] = useState(false);

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
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Braces className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold">Response</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
          200 OK
        </span>
        <button
          type="button"
          aria-label="Copy response"
          onClick={copy}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex gap-1 px-3 pt-2.5">
        {(["body", "headers"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors",
              tab === t
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "body" ? (
        <pre className="px-4 py-3 text-xs leading-relaxed font-mono overflow-x-auto">
          {BODY.map((b, i) => (
            <div key={i}>{colorize(b.line)}</div>
          ))}
        </pre>
      ) : (
        <ul className="px-4 py-3 space-y-1.5 text-xs font-mono">
          {HEADERS.map(([k, v]) => (
            <li key={k} className="flex gap-2">
              <span className="text-sky-600 dark:text-sky-400">{k}:</span>
              <span className="text-muted-foreground break-all">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
