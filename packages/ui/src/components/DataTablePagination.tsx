"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; product: string; sku: string; stock: number };

const ROWS: Row[] = Array.from({ length: 18 }, (_, i) => ({
  id: `p-${i}`,
  product: ["Wireless Mouse", "USB-C Hub", "Desk Mat", "Webcam Pro", "Keyboard K2", "Monitor Arm"][i % 6],
  sku: `SKU-${1042 + i}`,
  stock: [12, 0, 240, 5, 88, 31][i % 6],
}));

const PAGE_SIZE = 4;

export interface DataTablePaginationProps {
  className?: string;
}

export function DataTablePagination({ className }: DataTablePaginationProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(ROWS.length / PAGE_SIZE);
  const rows = ROWS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const from = page * PAGE_SIZE + 1;
  const to = Math.min(ROWS.length, (page + 1) * PAGE_SIZE);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Inventory</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Product</th>
              <th scope="col" className="px-4 py-2.5">SKU</th>
              <th scope="col" className="px-4 py-2.5 text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.product}</td>
                <td className="px-4 py-3 text-muted-foreground/55 tabular-nums">{r.sku}</td>
                <td className={cn("px-4 py-3 text-right tabular-nums", r.stock === 0 ? "text-rose-500 dark:text-rose-400" : "text-muted-foreground/70")}>{r.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground/55 tabular-nums">{from}–{to} of {ROWS.length}</span>
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="p-2 rounded-md border border-foreground/[0.06] hover:bg-foreground/[0.05] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              aria-current={i === page ? "page" : undefined}
              onClick={() => setPage(i)}
              className={cn(
                "h-8 min-w-8 px-2.5 rounded-md text-xs font-semibold tabular-nums transition-colors",
                i === page ? "bg-primary text-primary-foreground" : "border border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.05]",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="p-2 rounded-md border border-foreground/[0.06] hover:bg-foreground/[0.05] disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
