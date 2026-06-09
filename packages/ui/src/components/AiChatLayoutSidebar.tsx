"use client";

import React, { useState } from "react";
import { Send, Sparkles, MessageSquare, Plus, Search } from "lucide-react";
import { cn } from "../lib/cn";

type Convo = { id: string; title: string; preview: string; time: string };

const CONVOS: Convo[] = [
  { id: "c1", title: "Q3 retention review", preview: "Which cohort improved most?", time: "2m" },
  { id: "c2", title: "Pricing experiment ideas", preview: "Let's try a usage-based tier…", time: "1h" },
  { id: "c3", title: "Onboarding copy rewrite", preview: "Shorter, more direct headline.", time: "3h" },
  { id: "c4", title: "SQL: churn by plan", preview: "GROUP BY plan, month…", time: "Yesterday" },
];

export interface AiChatLayoutSidebarProps {
  className?: string;
}

export function AiChatLayoutSidebar({ className }: AiChatLayoutSidebarProps) {
  const [active, setActive] = useState("c1");
  const [draft, setDraft] = useState("");

  return (
    <div
      className={cn(
        "w-full max-w-3xl grid grid-cols-[200px_1fr] h-96 bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <aside className="flex flex-col border-r border-foreground/[0.06] bg-foreground/[0.02]">
        <div className="p-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl py-2 hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" /> New chat
          </button>
        </div>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-1.5 bg-foreground/[0.04] border border-foreground/[0.06] rounded-lg px-2 py-1.5">
            <Search className="w-3 h-3 text-muted-foreground/50" />
            <label htmlFor="convo-search" className="sr-only">
              Search conversations
            </label>
            <input
              id="convo-search"
              placeholder="Search"
              className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {CONVOS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "w-full text-left px-2.5 py-2 rounded-lg transition-colors",
                active === c.id ? "bg-primary/10" : "hover:bg-foreground/[0.04]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <span className="text-xs font-semibold truncate">{c.title}</span>
                </span>
                <span className="text-[11px] text-muted-foreground/40 shrink-0">{c.time}</span>
              </div>
              <div className="text-xs text-muted-foreground/50 truncate mt-0.5 pl-5">{c.preview}</div>
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex flex-col min-w-0">
        <div className="flex-1 space-y-3 p-4 overflow-y-auto">
          <div className="flex gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-foreground/[0.04] border border-foreground/[0.05] px-3.5 py-2 text-sm leading-relaxed">
              The enterprise cohort improved most — retention rose 4.8 points after the new SSO onboarding step.
            </div>
          </div>
          <div className="flex flex-row-reverse gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full bg-secondary grid place-items-center text-xs font-bold">
              You
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm leading-relaxed">
              Great, can you draft a one-line summary for the board deck?
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDraft("");
          }}
          className="flex items-center gap-2 border-t border-foreground/[0.06] p-3"
        >
          <label htmlFor="sidebar-chat-input" className="sr-only">
            Message
          </label>
          <input
            id="sidebar-chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply…"
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
      </section>
    </div>
  );
}
