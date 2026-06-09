"use client";

import React from "react";
import { Mail, Phone, Building2, MapPin, Tag, Pencil } from "lucide-react";
import { cn } from "../lib/cn";

type Field = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

const FIELDS: Field[] = [
  { icon: Mail, label: "Email", value: "dana.whitfield@acme.com" },
  { icon: Phone, label: "Phone", value: "+1 (415) 555-0182" },
  { icon: Building2, label: "Company", value: "Acme Corporation" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
];

const TAGS = ["Enterprise", "Decision maker", "Renewal Q3"];

export interface CRMContactProfilePanelProps {
  className?: string;
}

export function CRMContactProfilePanel({ className }: CRMContactProfilePanelProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
          DW
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold truncate">Dana Whitfield</h3>
            <button
              type="button"
              aria-label="Edit contact"
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground/70">VP of Operations</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active customer
          </span>
        </div>
      </div>

      <dl className="mt-5 space-y-3">
        {FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0 text-muted-foreground/50" />
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/45">{f.label}</dt>
                <dd className="text-sm text-foreground/90 truncate">{f.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>

      <div className="mt-5 border-t border-foreground/[0.05] pt-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground/45">
          <Tag className="w-3 h-3" />
          Tags
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] font-medium text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
