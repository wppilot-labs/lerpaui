"use client";

import React, { useMemo, useState } from "react";
import { Search, X, FileText } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsSearchSectionProps {
  className?: string;
}

type Doc = { title: string; excerpt: string; category: string };

const DOCS: Doc[] = [
  { title: "Installation guide", excerpt: "Set up the SDK in a Next.js or Vite project.", category: "Guides" },
  { title: "Authentication", excerpt: "Create API keys and configure OAuth scopes.", category: "Guides" },
  { title: "Button component", excerpt: "Variants, sizes, and accessibility notes.", category: "Components" },
  { title: "useToast hook", excerpt: "Imperatively trigger toast notifications.", category: "Hooks" },
  { title: "Error codes", excerpt: "Full list of API error responses.", category: "Reference" },
];

export function DocsSearchSection({ className }: DocsSearchSectionProps) {
  const [q, setQ] = useState("install");

  const matches = useMemo(
    () => DOCS.filter((d) => (d.title + d.excerpt + d.category).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <div
      className={cn(
        "w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
        <label htmlFor="docs-search-input" className="sr-only">
          Search the documentation
        </label>
        <input
          id="docs-search-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the docs…"
          className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-xl pl-9 pr-9 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none placeholder:text-muted-foreground/40"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQ("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-foreground/[0.06] text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="mt-3 mb-1 text-xs text-muted-foreground/45">
        {matches.length} {matches.length === 1 ? "result" : "results"}
      </p>

      <ul className="divide-y divide-foreground/[0.04]">
        {matches.map((d) => (
          <li key={d.title}>
            <a href="/" className="flex items-start gap-3 py-3 group">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground/40 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                    {d.title}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40 bg-foreground/[0.04] px-1.5 py-0.5 rounded shrink-0">
                    {d.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/55 mt-0.5 leading-relaxed">{d.excerpt}</p>
              </div>
            </a>
          </li>
        ))}
        {matches.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground/50">No matching documents.</li>
        )}
      </ul>
    </div>
  );
}
