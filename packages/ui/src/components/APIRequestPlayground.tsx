"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
type Method = (typeof METHODS)[number];

const METHOD_TONE: Record<Method, string> = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-sky-600 dark:text-sky-400",
  PUT: "text-amber-600 dark:text-amber-400",
  DELETE: "text-red-600 dark:text-red-400",
};

const RESPONSE = `{
  "id": "cus_8aZ12",
  "object": "customer",
  "email": "ada@acme.co",
  "created": 1717372800
}`;

export interface APIRequestPlaygroundProps {
  className?: string;
}

export function APIRequestPlayground({ className }: APIRequestPlaygroundProps) {
  const reduced = usePrefersReducedMotion();
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("https://api.acme.co/v1/customers/cus_8aZ12");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(true);

  const send = () => {
    setLoading(true);
    setSent(false);
    window.setTimeout(
      () => {
        setLoading(false);
        setSent(true);
      },
      reduced ? 0 : 700,
    );
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <select
          aria-label="HTTP method"
          value={method}
          onChange={(e) => setMethod(e.target.value as Method)}
          className={cn(
            "bg-muted border border-border rounded-lg px-2 py-2.5 text-xs font-bold font-mono focus:ring-1 focus:ring-primary/50 focus:outline-none",
            METHOD_TONE[method],
          )}
        >
          {METHODS.map((m) => (
            <option key={m} value={m} className="bg-card text-foreground">
              {m}
            </option>
          ))}
        </select>
        <input
          aria-label="Request URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 min-w-0 bg-muted border border-border rounded-lg px-2.5 py-2.5 text-xs font-mono focus:ring-1 focus:ring-primary/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>

      <div className="rounded-xl bg-muted border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-xs">
          <span className="text-muted-foreground font-semibold uppercase tracking-wide">Response</span>
          {sent && !loading && (
            <>
              <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-mono font-bold">200 OK</span>
              <span className="text-muted-foreground font-mono">128 ms</span>
            </>
          )}
        </div>
        <pre className="px-3 py-3 text-xs leading-relaxed font-mono text-muted-foreground overflow-x-auto min-h-[6.5rem]">
          {loading ? (
            <span className="text-muted-foreground">Sending request…</span>
          ) : (
            RESPONSE
          )}
        </pre>
      </div>
    </div>
  );
}
