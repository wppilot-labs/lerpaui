"use client";

import React, { useState } from "react";
import { GitCompareArrows, Check, ThumbsUp } from "lucide-react";
import { cn } from "../lib/cn";

type Answer = {
  id: "a" | "b";
  model: string;
  latency: string;
  tokens: number;
  text: string;
};

const ANSWERS: Answer[] = [
  {
    id: "a",
    model: "GPT-4o",
    latency: "1.1s",
    tokens: 142,
    text: "Use a debounce hook to delay the API call until the user stops typing, then cancel stale requests with an AbortController.",
  },
  {
    id: "b",
    model: "Claude 3.5",
    latency: "0.9s",
    tokens: 168,
    text: "Wrap the search in a useDeferredValue and a transition so typing stays responsive, and dedupe in-flight requests by key.",
  },
];

export interface AiResponseCompareSectionProps {
  className?: string;
}

export function AiResponseCompareSection({ className }: AiResponseCompareSectionProps) {
  const [preferred, setPreferred] = useState<"a" | "b" | null>(null);

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <GitCompareArrows className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Compare responses</h3>
        <span className="ml-auto text-xs text-muted-foreground/45">Which is better?</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ANSWERS.map((a) => {
          const chosen = preferred === a.id;
          return (
            <div
              key={a.id}
              className={cn(
                "flex flex-col rounded-xl border p-3.5 transition",
                chosen ? "border-emerald-400/40 bg-emerald-500/[0.06]" : "border-foreground/[0.06] bg-foreground/[0.02]",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-6 w-6 grid place-items-center rounded text-xs font-black",
                      a.id === "a" ? "bg-violet-500/20 text-violet-300" : "bg-sky-500/20 text-sky-300",
                    )}
                  >
                    {a.id.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold">{a.model}</span>
                </span>
                {chosen && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Picked
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-foreground/85 flex-1">{a.text}</p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-foreground/[0.06]">
                <span className="text-xs text-muted-foreground/45 tabular-nums">
                  {a.latency} · {a.tokens} tok
                </span>
                <button
                  type="button"
                  onClick={() => setPreferred(a.id)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition",
                    chosen
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-foreground/[0.05] text-muted-foreground/70 hover:bg-foreground/[0.08]",
                  )}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Prefer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
