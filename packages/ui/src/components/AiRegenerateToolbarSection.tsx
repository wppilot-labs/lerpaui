"use client";

import React, { useState } from "react";
import { RefreshCw, Copy, Check, Share2, Pencil, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AiRegenerateToolbarSectionProps {
  className?: string;
}

export function AiRegenerateToolbarSection({ className }: AiRegenerateToolbarSectionProps) {
  const [copied, setCopied] = useState(false);
  const [variant, setVariant] = useState(2);
  const total = 3;

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const actions = [
    { id: "regen", label: "Regenerate", icon: RefreshCw },
    { id: "edit", label: "Edit prompt", icon: Pencil },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-2 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/75 hover:bg-foreground/[0.05] transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>

        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/75 hover:bg-foreground/[0.05] transition"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{a.label}</span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Good response"
            className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/60 hover:bg-foreground/[0.05] transition"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Bad response"
            className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/60 hover:bg-foreground/[0.05] transition"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-2 border-t border-foreground/[0.06] pt-1.5">
        <button
          type="button"
          aria-label="Previous version"
          disabled={variant <= 1}
          onClick={() => setVariant((v) => Math.max(1, v - 1))}
          className="h-7 w-7 grid place-items-center rounded text-muted-foreground/60 hover:bg-foreground/[0.05] transition disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tabular-nums text-muted-foreground/60">
          {variant} / {total}
        </span>
        <button
          type="button"
          aria-label="Next version"
          disabled={variant >= total}
          onClick={() => setVariant((v) => Math.min(total, v + 1))}
          className="h-7 w-7 grid place-items-center rounded text-muted-foreground/60 hover:bg-foreground/[0.05] transition disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
