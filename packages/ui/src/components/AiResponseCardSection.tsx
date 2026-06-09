"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface AiResponseCardSectionProps {
  className?: string;
}

export function AiResponseCardSection({ className }: AiResponseCardSectionProps) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold">Assistant</span>
        <span className="ml-auto text-xs text-muted-foreground/40">GPT-4o · 1.2s</span>
      </div>

      <div className="space-y-2.5 text-sm leading-relaxed text-foreground/90">
        <p>
          To reduce churn, focus on the first-week experience — that&apos;s where 60% of cancellations originate.
          Three high-leverage moves:
        </p>
        <ul className="space-y-1.5 pl-1">
          {[
            "Trigger a guided setup checklist on first login.",
            "Send a value-recap email at day 3 highlighting usage.",
            "Surface an in-app nudge before the trial ends.",
          ].map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-foreground/[0.06] pt-3">
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/70 hover:bg-foreground/[0.05] transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/70 hover:bg-foreground/[0.05] transition"
        >
          <RefreshCw className="w-4 h-4" /> Regenerate
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Good response"
            aria-pressed={vote === "up"}
            onClick={() => setVote(vote === "up" ? null : "up")}
            className={cn(
              "h-8 w-8 grid place-items-center rounded-lg transition",
              vote === "up" ? "bg-emerald-500/15 text-emerald-400" : "text-muted-foreground/60 hover:bg-foreground/[0.05]",
            )}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Bad response"
            aria-pressed={vote === "down"}
            onClick={() => setVote(vote === "down" ? null : "down")}
            className={cn(
              "h-8 w-8 grid place-items-center rounded-lg transition",
              vote === "down" ? "bg-red-500/15 text-red-400" : "text-muted-foreground/60 hover:bg-foreground/[0.05]",
            )}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
