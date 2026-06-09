"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type StageState = "done" | "current" | "upcoming";

type Stage = {
  label: string;
  date: string;
  state: StageState;
};

const STAGES: Stage[] = [
  { label: "Lead captured", date: "Jan 12", state: "done" },
  { label: "Qualified", date: "Jan 20", state: "done" },
  { label: "Trial started", date: "Feb 03", state: "done" },
  { label: "Negotiation", date: "In progress", state: "current" },
  { label: "Closed won", date: "Upcoming", state: "upcoming" },
];

export interface CRMCustomerLifecycleTimelineProps {
  className?: string;
}

export function CRMCustomerLifecycleTimeline({ className }: CRMCustomerLifecycleTimelineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold mb-5">Customer lifecycle</h3>

      <ol className="space-y-0">
        {STAGES.map((stage, idx) => {
          const isLast = idx === STAGES.length - 1;
          const isDone = stage.state === "done";
          const isCurrent = stage.state === "current";
          return (
            <li key={stage.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold",
                    isDone && "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                    isCurrent && "border-primary/50 bg-primary/15 text-primary",
                    stage.state === "upcoming" &&
                      "border-foreground/[0.1] bg-foreground/[0.02] text-muted-foreground/40",
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "w-px flex-1 min-h-[28px]",
                      isDone ? "bg-emerald-500/30" : "bg-foreground/[0.08]",
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-5", isLast && "pb-0")}>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    isCurrent ? "text-foreground" : "text-foreground/85",
                    stage.state === "upcoming" && "text-muted-foreground/60",
                  )}
                >
                  {stage.label}
                </div>
                <div
                  className={cn(
                    "text-[11px]",
                    isCurrent ? "text-primary" : "text-muted-foreground/50",
                  )}
                >
                  {stage.date}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
