"use client";

import React from "react";
import { ListChecks, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "../lib/cn";

type JobStatus = "running" | "queued" | "completed" | "failed";
type Job = {
  id: string;
  name: string;
  status: JobStatus;
  attempt: number;
  duration: string;
};

const JOBS: Job[] = [
  { id: "job_8f21", name: "send_invoice_emails", status: "running", attempt: 1, duration: "12s" },
  { id: "job_8f20", name: "rebuild_search_index", status: "queued", attempt: 0, duration: "—" },
  { id: "job_8f1e", name: "export_analytics_csv", status: "completed", attempt: 1, duration: "1m 04s" },
  { id: "job_8f1c", name: "sync_stripe_webhooks", status: "failed", attempt: 3, duration: "8s" },
  { id: "job_8f1a", name: "purge_expired_sessions", status: "completed", attempt: 1, duration: "3s" },
];

const STATUS: Record<JobStatus, { label: string; tone: string; Icon: typeof Clock; spin?: boolean }> = {
  running: { label: "Running", tone: "text-sky-600 dark:text-sky-400", Icon: Loader2, spin: true },
  queued: { label: "Queued", tone: "text-muted-foreground", Icon: Clock },
  completed: { label: "Completed", tone: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
  failed: { label: "Failed", tone: "text-red-600 dark:text-red-400", Icon: XCircle },
};

export interface AdminJobQueueTableProps {
  className?: string;
}

export function AdminJobQueueTable({ className }: AdminJobQueueTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <ListChecks className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Job queue</h3>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {JOBS.filter((j) => j.status === "queued" || j.status === "running").length} pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-5 py-2.5">Job</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 text-center">Attempt</th>
              <th className="px-5 py-2.5 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {JOBS.map((j) => {
              const { label, tone, Icon, spin } = STATUS[j.status];
              return (
                <tr key={j.id} className="hover:bg-muted transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-mono font-semibold">{j.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{j.id}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn("inline-flex items-center gap-1.5", tone)}>
                      <Icon className={cn("w-4 h-4", spin && "animate-spin")} />
                      {label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                    {j.attempt > 1 ? (
                      <span className="text-amber-600 dark:text-amber-400">{j.attempt}×</span>
                    ) : (
                      j.attempt || "—"
                    )}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {j.duration}
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
