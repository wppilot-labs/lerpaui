"use client";

import React, { useState } from "react";
import { Send, Paperclip, Mic, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

const MODELS = ["GPT-4o", "Claude 3.5", "Gemini 1.5"];

export interface AiPromptInputSectionProps {
  className?: string;
}

export function AiPromptInputSection({ className }: AiPromptInputSectionProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const max = 4000;

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-4 font-sans text-foreground",
        className,
      )}
    >
      <label htmlFor="prompt-textarea" className="sr-only">
        Prompt
      </label>
      <textarea
        id="prompt-textarea"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, max))}
        rows={3}
        placeholder="Ask anything, or describe a task…"
        className="w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Attach file"
            className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/70 hover:bg-foreground/[0.05] transition"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Voice input"
            className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/70 hover:bg-foreground/[0.05] transition"
          >
            <Mic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 ml-1">
            {MODELS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={model === m}
                onClick={() => setModel(m)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition",
                  model === m
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground/60 hover:bg-foreground/[0.05]",
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-muted-foreground/40">
            {text.length}/{max}
          </span>
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send prompt"
            className="h-9 w-9 grid place-items-center bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/40">
        <ChevronDown className="w-3.5 h-3.5" /> Shift + Enter for new line
      </div>
    </div>
  );
}
