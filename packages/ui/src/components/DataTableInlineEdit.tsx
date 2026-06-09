"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pencil, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; name: string; price: string };

const INITIAL: Row[] = [
  { id: "1", name: "Starter", price: "29" },
  { id: "2", name: "Growth", price: "79" },
  { id: "3", name: "Scale", price: "149" },
];

export interface DataTableInlineEditProps {
  className?: string;
}

export function DataTableInlineEdit({ className }: DataTableInlineEditProps) {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const start = (row: Row) => {
    setEditing(row.id);
    setDraft(row.price);
  };
  const commit = () => {
    setRows((rs) => rs.map((r) => (r.id === editing ? { ...r, price: draft.trim() || r.price } : r)));
    setEditing(null);
  };

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Pricing plans</h3>
      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Plan</th>
              <th scope="col" className="px-4 py-2.5">Price / mo</th>
              <th scope="col" className="px-4 py-2.5 w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {rows.map((r) => {
              const isEditing = editing === r.id;
              return (
                <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold">{r.name}</td>
                  <td className="px-4 py-2.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground/50">$</span>
                        <input
                          ref={inputRef}
                          value={draft}
                          inputMode="numeric"
                          aria-label={`Edit price for ${r.name}`}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={commit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commit();
                            if (e.key === "Escape") setEditing(null);
                          }}
                          className="w-20 bg-foreground/[0.04] border border-primary/40 rounded-md px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    ) : (
                      <span className="tabular-nums">${r.price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <button type="button" aria-label="Save" onMouseDown={(e) => e.preventDefault()} onClick={commit} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button type="button" aria-label={`Edit ${r.name}`} onClick={() => start(r)} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
