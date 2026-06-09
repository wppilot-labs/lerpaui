"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

const CATEGORIES = ["All", "Articles", "Videos", "Templates", "People"];
const TAGS = ["Free", "New", "Popular", "Beginner"];

export interface SearchFilterFormSectionProps {
  className?: string;
}

export function SearchFilterFormSection({ className }: SearchFilterFormSectionProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tags, setTags] = useState<string[]>(["Free"]);

  const toggleTag = (t: string) =>
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold">Search &amp; filter</h3>
      </div>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        <label htmlFor="sf-query" className="sr-only">
          Search
        </label>
        <input
          id="sf-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the library…"
          className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sf-category" className="mb-1.5 block text-xs font-medium text-muted-foreground/80">
          Category
        </label>
        <select
          id="sf-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground/80">Filters</span>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((t) => {
            const active = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-foreground/[0.06] pt-3">
        <button
          type="reset"
          onClick={() => {
            setQuery("");
            setCategory("All");
            setTags([]);
          }}
          className="text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
