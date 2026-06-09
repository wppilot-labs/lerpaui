"use client";

import React from "react";
import { FileText, Check, Clock, MessageCircle, Download } from "lucide-react";
import { cn } from "../lib/cn";

type ReviewState = "approved" | "pending" | "changes";

type Reviewer = {
  name: string;
  initials: string;
  tint: string;
  state: ReviewState;
};

const STATE_META: Record<
  ReviewState,
  { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }
> = {
  approved: {
    label: "Approved",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Check,
  },
  pending: {
    label: "Pending",
    cls: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: Clock,
  },
  changes: {
    label: "Changes",
    cls: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    icon: MessageCircle,
  },
};

const REVIEWERS: Reviewer[] = [
  { name: "Jane Doe", initials: "JD", tint: "bg-emerald-500/15 text-emerald-300", state: "approved" },
  { name: "Marcus Lee", initials: "ML", tint: "bg-sky-500/15 text-sky-300", state: "approved" },
  { name: "Priya Patel", initials: "PP", tint: "bg-violet-500/15 text-violet-300", state: "changes" },
  { name: "Alex Kim", initials: "AK", tint: "bg-amber-500/15 text-amber-300", state: "pending" },
];

export interface TeamDocumentReviewPanelProps {
  className?: string;
}

export function TeamDocumentReviewPanel({
  className,
}: TeamDocumentReviewPanelProps) {
  const approved = REVIEWERS.filter((r) => r.state === "approved").length;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-secondary/40 text-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold">Pricing-v3-spec.pdf</h3>
          <p className="text-xs text-muted-foreground/55">
            Updated 20m ago · 14 pages
          </p>
        </div>
        <button
          type="button"
          aria-label="Download document"
          className="text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-border/50 bg-secondary/25 px-3.5 py-2.5">
        <span className="text-xs text-muted-foreground">Review status</span>
        <span className="text-xs font-bold text-foreground">
          {approved}/{REVIEWERS.length} approved
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {REVIEWERS.map((r) => {
          const meta = STATE_META[r.state];
          const Icon = meta.icon;
          return (
            <li key={r.name} className="flex items-center gap-3 py-1.5">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  r.tint,
                )}
              >
                {r.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {r.name}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                  meta.cls,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-lg border border-border/60 bg-secondary/40 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Request changes
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
