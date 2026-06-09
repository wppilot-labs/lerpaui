"use client";

import React, { useState } from "react";
import { BookOpen, Search, FileText, Globe, FileCode, RefreshCw, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Doc = {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  chunks: number;
  status: "indexed" | "syncing";
  updated: string;
};

const DOCS: Doc[] = [
  { id: "d1", name: "Product documentation", type: "Web", icon: Globe, chunks: 342, status: "indexed", updated: "2h ago" },
  { id: "d2", name: "API reference.pdf", type: "PDF", icon: FileText, chunks: 128, status: "indexed", updated: "1d ago" },
  { id: "d3", name: "Onboarding runbook.md", type: "Markdown", icon: FileCode, chunks: 56, status: "syncing", updated: "now" },
  { id: "d4", name: "Support macros.pdf", type: "PDF", icon: FileText, chunks: 74, status: "indexed", updated: "3d ago" },
];

export interface AiKnowledgeBaseSectionProps {
  className?: string;
}

export function AiKnowledgeBaseSection({ className }: AiKnowledgeBaseSectionProps) {
  const [q, setQ] = useState("");
  const filtered = DOCS.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
  const totalChunks = DOCS.reduce((s, d) => s + d.chunks, 0);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Knowledge base</h3>
        <button
          type="button"
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold hover:bg-primary/25 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add source
        </button>
      </div>
      <p className="text-xs text-muted-foreground/45 mb-3">
        {DOCS.length} sources · {totalChunks.toLocaleString()} chunks embedded
      </p>

      <div className="flex items-center gap-2 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] px-3 py-2 mb-3">
        <Search className="w-3.5 h-3.5 text-muted-foreground/50" />
        <label htmlFor="kb-search" className="sr-only">
          Search knowledge base
        </label>
        <input
          id="kb-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sources…"
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      <ul className="space-y-1.5">
        {filtered.map((d) => {
          const Icon = d.icon;
          return (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-3 py-2.5"
            >
              <div className="h-8 w-8 shrink-0 grid place-items-center rounded-lg bg-foreground/[0.04] text-muted-foreground/70">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{d.name}</div>
                <div className="text-xs text-muted-foreground/50">
                  {d.type} · {d.chunks} chunks · {d.updated}
                </div>
              </div>
              {d.status === "syncing" ? (
                <span className="flex items-center gap-1 text-xs text-sky-400 shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing
                </span>
              ) : (
                <span className="text-xs font-medium text-emerald-400 shrink-0">Indexed</span>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground/45">No sources found</li>
        )}
      </ul>
    </div>
  );
}
