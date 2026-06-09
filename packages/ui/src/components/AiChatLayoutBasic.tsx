"use client";

import React, { useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { cn } from "../lib/cn";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const SEED: Msg[] = [
  { id: "m1", role: "user", text: "Can you summarize our Q3 retention numbers?" },
  {
    id: "m2",
    role: "assistant",
    text: "Q3 retention held at 91.4% — up 2.1 points from Q2. The biggest lift came from the onboarding flow changes shipped in August.",
  },
  { id: "m3", role: "user", text: "Which cohort improved the most?" },
];

export interface AiChatLayoutBasicProps {
  className?: string;
}

export function AiChatLayoutBasic({ className }: AiChatLayoutBasicProps) {
  const [draft, setDraft] = useState("");

  return (
    <div
      className={cn(
        "w-full max-w-xl flex flex-col bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/[0.06]">
        <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">Assistant</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 p-4 max-h-80 overflow-y-auto">
        {SEED.map((m) => (
          <div key={m.id} className={cn("flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div
              className={cn(
                "h-7 w-7 shrink-0 rounded-full flex items-center justify-center",
                m.role === "user" ? "bg-secondary text-foreground" : "bg-primary/15 text-primary",
              )}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-foreground/[0.04] border border-foreground/[0.05] rounded-tl-sm",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDraft("");
        }}
        className="flex items-center gap-2 border-t border-foreground/[0.06] p-3"
      >
        <label htmlFor="basic-chat-input" className="sr-only">
          Message
        </label>
        <input
          id="basic-chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Send a message…"
          className="flex-1 bg-foreground/[0.04] border border-foreground/[0.06] rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/45"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="h-9 w-9 shrink-0 grid place-items-center bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
