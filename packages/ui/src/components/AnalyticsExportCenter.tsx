"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, FileJson, FileText, Calendar } from "lucide-react";
import { cn } from "../lib/cn";

type Format = { id: string; label: string; ext: string; Icon: typeof FileText };

const FORMATS: Format[] = [
  { id: "csv", label: "CSV", ext: ".csv", Icon: FileSpreadsheet },
  { id: "xlsx", label: "Excel", ext: ".xlsx", Icon: FileSpreadsheet },
  { id: "json", label: "JSON", ext: ".json", Icon: FileJson },
  { id: "pdf", label: "PDF report", ext: ".pdf", Icon: FileText },
];

const RANGES = ["Last 7 days", "Last 30 days", "Last quarter", "Year to date"];

export interface AnalyticsExportCenterProps {
  className?: string;
}

export function AnalyticsExportCenter({ className }: AnalyticsExportCenterProps) {
  const [format, setFormat] = useState("csv");
  const [range, setRange] = useState("Last 30 days");
  const [includeRaw, setIncludeRaw] = useState(false);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Export data</h3>
      </div>

      <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
        Format
      </span>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {FORMATS.map((f) => {
          const on = format === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFormat(f.id)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border transition-colors",
                on
                  ? "bg-primary/10 border-primary/40 text-foreground"
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/70",
              )}
            >
              <f.Icon className={cn("w-4 h-4 shrink-0", on ? "text-primary" : "text-muted-foreground")} />
              <div className="text-left leading-none">
                <span className="text-xs font-semibold block">{f.label}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{f.ext}</span>
              </div>
            </button>
          );
        })}
      </div>

      <label htmlFor="export-range" className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
        Date range
      </label>
      <div className="relative mb-4">
        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        <select
          id="export-range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full bg-muted border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none appearance-none"
        >
          {RANGES.map((r) => (
            <option key={r} value={r} className="bg-card text-foreground">
              {r}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer mb-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={includeRaw}
          onClick={() => setIncludeRaw((v) => !v)}
          className={cn(
            "w-4 h-4 rounded border grid place-items-center transition-colors shrink-0",
            includeRaw ? "bg-primary border-primary" : "border-border bg-background",
          )}
        >
          {includeRaw && (
            <svg viewBox="0 0 12 12" className="w-3 h-3 text-primary-foreground" fill="none">
              <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="text-xs text-muted-foreground">Include raw event data</span>
      </label>

      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" /> Export {format.toUpperCase()}
      </button>
    </div>
  );
}
