"use client";

import React, { useState } from "react";
import { History, Search, Star, Clock, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type Entry = { id: string; text: string; time: string; starred: boolean };

const ENTRIES: Entry[] = [
  { id: "h1", text: "Write a cold outreach email for a fintech CFO", time: "Just now", starred: true },
  { id: "h2", text: "Refactor this React hook to avoid re-renders", time: "20m ago", starred: false },
  { id: "h3", text: "Summarize the attached contract in plain English", time: "1h ago", starred: true },
  { id: "h4", text: "Generate 10 blog title ideas about AI agents", time: "Yesterday", starred: false },
  { id: "h5", text: "Explain the difference between OLTP and OLAP", time: "2d ago", starred: false },
];

export interface AiPromptHistoryPanelBlockProps {
  className?: string;
}

export function AiPromptHistoryPanelBlock({ className }: AiPromptHistoryPanelBlockProps) {
  const [items, setItems] = useState<Entry[]>(ENTRIES);
  const [q, setQ] = useState("");

  const filtered = items.filter((e) => e.text.toLowerCase().includes(q.toLowerCase()));

  const toggleStar = (id: string) =>
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));

  return (
    <div
      className={cn(
        "w-full max-w-md flex flex-col bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/[0.06]">
        <History className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Prompt history</h3>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] px-3 py-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground/50" />
          <label htmlFor="history-search" className="sr-only">
            Search prompts
          </label>
          <input
            id="history-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prompts…"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      <ul className="p-2 space-y-0.5 max-h-72 overflow-y-auto">
        {filtered.map((e) => (
          <li
            key={e.id}
            className="group flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-foreground/[0.04] transition-colors"
          >
            <button
              type="button"
              aria-label={e.starred ? "Unstar prompt" : "Star prompt"}
              aria-pressed={e.starred}
              onClick={() => toggleStar(e.id)}
              className="mt-0.5 shrink-0"
            >
              <Star
                className={cn(
                  "w-4 h-4 transition",
                  e.starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-muted-foreground/60",
                )}
              />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug line-clamp-2">{e.text}</p>
              <span className="text-xs text-muted-foreground/45 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> {e.time}
              </span>
            </div>
            <button
              type="button"
              aria-label="Delete prompt"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== e.id))}
              className="h-7 w-7 grid place-items-center rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:bg-foreground/[0.06] hover:text-red-400 transition shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground/45">No matching prompts</li>
        )}
      </ul>
    </div>
  );
}
