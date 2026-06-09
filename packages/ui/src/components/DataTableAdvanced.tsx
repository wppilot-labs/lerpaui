"use client";

import React, { useMemo, useState } from "react";
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { name: string; role: string; mrr: number };

const ROWS: Row[] = [
  { name: "Northwind Inc", role: "Enterprise", mrr: 2480 },
  { name: "Vertex Labs", role: "Pro", mrr: 290 },
  { name: "Lumen Co", role: "Pro", mrr: 290 },
  { name: "Delta App", role: "Starter", mrr: 49 },
  { name: "Orbit Studio", role: "Pro", mrr: 320 },
  { name: "Quill HQ", role: "Enterprise", mrr: 1900 },
];

const PAGE_SIZE = 3;

export interface DataTableAdvancedProps {
  className?: string;
}

export function DataTableAdvanced({ className }: DataTableAdvancedProps) {
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const filtered = ROWS.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => (sortDir === "asc" ? a.mrr - b.mrr : b.mrr - a.mrr));
  }, [query, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-base font-bold whitespace-nowrap">Accounts</h3>
        <div className="relative w-full max-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground/40" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Filter accounts"
            aria-label="Filter accounts"
            className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Account</th>
              <th scope="col" className="px-4 py-2.5">Plan</th>
              <th scope="col" className="px-4 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors uppercase"
                >
                  MRR
                  {sortDir === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground/70">{r.role}</td>
                <td className="px-4 py-3 text-right tabular-nums">${r.mrr.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground/55">
        <span>{sorted.length} results</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-1.5 rounded-md hover:bg-foreground/[0.05] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="tabular-nums">{safePage + 1} / {pageCount}</span>
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="p-1.5 rounded-md hover:bg-foreground/[0.05] disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
