"use client";

import React from "react";
import { Sparkles, PenLine, Code2, Lightbulb, FileText, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Suggestion = { id: string; label: string; sub: string; icon: React.ComponentType<{ className?: string }> };

const SUGGESTIONS: Suggestion[] = [
  { id: "s1", label: "Draft an email", sub: "to a customer about a delay", icon: PenLine },
  { id: "s2", label: "Explain this code", sub: "and suggest improvements", icon: Code2 },
  { id: "s3", label: "Brainstorm ideas", sub: "for a product launch", icon: Lightbulb },
  { id: "s4", label: "Summarize a doc", sub: "into key bullet points", icon: FileText },
];

export interface AiEmptyChatStateProps {
  className?: string;
}

export function AiEmptyChatState({ className }: AiEmptyChatStateProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-6 font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold">How can I help today?</h3>
      <p className="text-sm text-muted-foreground/60 mt-1 mb-5">
        Ask a question or pick a suggestion to get started.
      </p>

      <div className="grid grid-cols-2 gap-2 text-left">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              className="group flex flex-col gap-1.5 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3 hover:bg-foreground/[0.05] hover:border-primary/30 transition"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold leading-tight">{s.label}</span>
              <span className="text-xs text-muted-foreground/55 leading-tight flex items-center gap-1">
                {s.sub}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
