"use client";

import React, { useState } from "react";
import { Download, FileText, FileJson, FileSpreadsheet, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Row = { id: string; name: string; revenue: string };

const ROWS: Row[] = [
  { id: "1", name: "Northwind", revenue: "$24,800" },
  { id: "2", name: "Vertex", revenue: "$2,900" },
  { id: "3", name: "Lumen", revenue: "$2,900" },
  { id: "4", name: "Orbit", revenue: "$3,200" },
];

const FORMATS = [
  { id: "csv", label: "CSV", Icon: FileSpreadsheet },
  { id: "json", label: "JSON", Icon: FileJson },
  { id: "pdf", label: "PDF", Icon: FileText },
] as const;

export interface DataTableExportToolbarProps {
  className?: string;
}

export function DataTableExportToolbar({ className }: DataTableExportToolbarProps) {
  const [exported, setExported] = useState<string | null>(null);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold whitespace-nowrap">Revenue by account</h3>
        <div className="flex items-center gap-1 rounded-lg border border-foreground/[0.08] p-0.5">
          <span className="px-1.5 text-muted-foreground/40" aria-hidden="true">
            <Download className="w-4 h-4" />
          </span>
          {FORMATS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={`Export as ${label}`}
              onClick={() => setExported(id)}
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors",
                exported === id ? "bg-primary/15 text-primary" : "text-muted-foreground/70 hover:bg-foreground/[0.05]",
              )}
            >
              {exported === id ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-4 py-2.5">Account</th>
              <th scope="col" className="px-4 py-2.5 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm">
            {ROWS.map((r) => (
              <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exported && (
        <p className="mt-3 text-xs text-muted-foreground/55" role="status">
          Exported {ROWS.length} rows as {exported.toUpperCase()}.
        </p>
      )}
    </div>
  );
}
