"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, FileSpreadsheet, File as FileIcon, X, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Upload = { id: number; name: string; size: string; kind: "doc" | "sheet" | "other"; done: boolean };

const FILES: Upload[] = [
  { id: 1, name: "proposal-v3.pdf", size: "1.2 MB", kind: "doc", done: true },
  { id: 2, name: "budget-2026.xlsx", size: "480 KB", kind: "sheet", done: true },
  { id: 3, name: "notes.txt", size: "12 KB", kind: "other", done: false },
];

const ICONS = { doc: FileText, sheet: FileSpreadsheet, other: FileIcon };

export interface FileUploadSectionProps {
  className?: string;
}

export function FileUploadSection({ className }: FileUploadSectionProps) {
  const [files, setFiles] = useState<Upload[]>(FILES);
  const [dragging, setDragging] = useState(false);

  const remove = (id: number) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <h3 className="text-base font-bold mb-4">Upload files</h3>

      <button
        type="button"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={cn(
          "w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-foreground/[0.12] hover:border-foreground/[0.2] hover:bg-foreground/[0.02]",
        )}
      >
        <UploadCloud className="w-8 h-8 text-muted-foreground/40" />
        <span className="text-sm font-semibold">Drag & drop or <span className="text-primary">browse</span></span>
        <span className="text-xs text-muted-foreground/45">PDF, DOCX, XLSX up to 25 MB</span>
      </button>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => {
            const Icon = ICONS[f.kind];
            return (
              <li key={f.id} className="flex items-center gap-3 rounded-lg border border-foreground/[0.05] bg-foreground/[0.02] px-3 py-2.5">
                <Icon className="w-5 h-5 text-muted-foreground/55 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground/45 tabular-nums">{f.size}</div>
                </div>
                {f.done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">Uploading…</span>
                )}
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => remove(f.id)} className="text-muted-foreground/40 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
