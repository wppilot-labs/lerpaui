"use client";

import React from "react";
import { Download, FileArchive, FileText, FileImage } from "lucide-react";
import { cn } from "../lib/cn";

type DownloadItem = {
  name: string;
  meta: string;
  size: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
};

const DOWNLOADS: DownloadItem[] = [
  { name: "UI Kit — Source files", meta: "Order #1042 · Figma", size: "48.2 MB", icon: FileArchive, tint: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
  { name: "License certificate", meta: "Order #1042 · PDF", size: "112 KB", icon: FileText, tint: "text-sky-600 dark:text-sky-400 bg-sky-500/10" },
  { name: "Brand assets pack", meta: "Order #0987 · ZIP", size: "23.7 MB", icon: FileArchive, tint: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  { name: "Hero illustrations", meta: "Order #0987 · PNG", size: "9.4 MB", icon: FileImage, tint: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
];

export interface CustomerDownloadsPanelProps {
  className?: string;
}

export function CustomerDownloadsPanel({ className }: CustomerDownloadsPanelProps) {
  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Download className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Downloads</h3>
      </div>

      <ul className="space-y-1.5">
        {DOWNLOADS.map((d) => (
          <li
            key={d.name}
            className="flex items-center gap-3 rounded-xl border border-border bg-foreground/[0.02] p-3.5 transition-colors hover:bg-foreground/[0.04]"
          >
            <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-lg", d.tint)}>
              <d.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{d.name}</p>
              <p className="truncate text-xs text-muted-foreground">{d.meta}</p>
            </div>
            <span className="text-xs text-muted-foreground">{d.size}</span>
            <button
              type="button"
              aria-label={`Download ${d.name}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-foreground/[0.03] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
