"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, FileImage, FileSpreadsheet, Check, Loader2, X } from "lucide-react";
import { cn } from "../lib/cn";

type Upload = {
  id: string;
  name: string;
  size: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
  status: "done" | "uploading";
};

const INITIAL: Upload[] = [
  { id: "f1", name: "q3-report.pdf", size: "2.4 MB", icon: FileText, progress: 100, status: "done" },
  { id: "f2", name: "revenue.xlsx", size: "812 KB", icon: FileSpreadsheet, progress: 100, status: "done" },
  { id: "f3", name: "diagram.png", size: "1.1 MB", icon: FileImage, progress: 64, status: "uploading" },
];

export interface AiFileUploadSectionProps {
  className?: string;
}

export function AiFileUploadSection({ className }: AiFileUploadSectionProps) {
  const [files, setFiles] = useState<Upload[]>(INITIAL);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-3">
        <UploadCloud className="w-4 h-4 text-primary" /> Attach files
      </h3>

      <label
        htmlFor="ai-file-input"
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-foreground/[0.12] bg-foreground/[0.02] py-6 cursor-pointer hover:border-primary/40 hover:bg-foreground/[0.04] transition"
      >
        <UploadCloud className="w-6 h-6 text-muted-foreground/40" />
        <span className="text-sm font-medium">
          Drop files or <span className="text-primary">browse</span>
        </span>
        <span className="text-xs text-muted-foreground/45">PDF, PNG, XLSX up to 25 MB</span>
        <input id="ai-file-input" type="file" multiple className="sr-only" />
      </label>

      <ul className="mt-3 space-y-2">
        {files.map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.id} className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-3 py-2.5">
              <div className="h-8 w-8 shrink-0 grid place-items-center rounded-lg bg-foreground/[0.04] text-muted-foreground/70">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground/45 shrink-0">{f.size}</span>
                </div>
                {f.status === "uploading" ? (
                  <div className="mt-1.5 h-1 w-full rounded-full bg-foreground/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${f.progress}%` }} />
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" /> Uploaded
                  </div>
                )}
              </div>
              {f.status === "uploading" ? (
                <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
              ) : (
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                  className="h-7 w-7 grid place-items-center rounded-lg text-muted-foreground/50 hover:bg-foreground/[0.06] hover:text-foreground transition shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
