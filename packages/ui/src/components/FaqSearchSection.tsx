"use client";

import React, { useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import { cn } from "../lib/cn";

const ARTICLES: string[] = [
  "How do I reset my password?",
  "How do I update my billing information?",
  "How do I invite teammates to my workspace?",
  "How do I export my data?",
  "How do I enable two-factor authentication?",
  "How do I cancel my subscription?",
];

export interface FaqSearchSectionProps {
  className?: string;
}

export function FaqSearchSection({ className }: FaqSearchSectionProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTICLES;
    return ARTICLES.filter((a) => a.toLowerCase().includes(q));
  }, [query]);

  return (
    <section
      className={cn(
        "w-full max-w-lg bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h2 className="text-base font-bold mb-3">How can we help?</h2>

      <label htmlFor="faq-search" className="sr-only">
        Search help articles
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
        <input
          id="faq-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for answers…"
          className="w-full rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <ul className="mt-4 space-y-1">
        {results.length === 0 ? (
          <li className="py-6 text-center text-sm text-muted-foreground/55">
            No articles match &ldquo;{query}&rdquo;.
          </li>
        ) : (
          results.map((article) => (
            <li key={article}>
              <button
                type="button"
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.03]"
              >
                <FileText className="w-4 h-4 shrink-0 text-muted-foreground/50" />
                <span className="text-sm text-foreground/90">{article}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
