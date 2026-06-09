"use client";

import React, { useState } from "react";
import { LifeBuoy, Check } from "lucide-react";
import { cn } from "../lib/cn";

const TOPICS = ["Billing", "Bug report", "Account", "Feature request", "Other"];
const PRIORITIES = [
  { id: "low", label: "Low", tint: "text-emerald-600 border-emerald-500/30 bg-emerald-500/10 dark:text-emerald-400" },
  { id: "normal", label: "Normal", tint: "text-sky-600 border-sky-500/30 bg-sky-500/10 dark:text-sky-400" },
  { id: "urgent", label: "Urgent", tint: "text-rose-600 border-rose-500/30 bg-rose-500/10 dark:text-rose-400" },
];

export interface SupportFormSectionProps {
  className?: string;
}

export function SupportFormSection({ className }: SupportFormSectionProps) {
  const [priority, setPriority] = useState("normal");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <LifeBuoy className="h-5 w-5 text-primary" />
        <h3 className="text-base font-bold">Open a support ticket</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground/55">Our team typically responds within a few hours.</p>

      <div className="space-y-3">
        <div>
          <label htmlFor="sup-subject" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            Subject
          </label>
          <input
            id="sup-subject"
            type="text"
            placeholder="Brief summary of the issue"
            className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="sup-topic" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            Topic
          </label>
          <select
            id="sup-topic"
            defaultValue="Bug report"
            className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground/80">Priority</span>
          <div className="grid grid-cols-3 gap-1.5">
            {PRIORITIES.map((p) => {
              const active = priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    "rounded-xl border py-2 text-sm font-semibold transition-colors",
                    active ? p.tint : "border-foreground/[0.06] text-muted-foreground/70 hover:bg-foreground/[0.04]",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="sup-message" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            Describe the problem
          </label>
          <textarea
            id="sup-message"
            rows={3}
            placeholder="What happened, and what did you expect?"
            className="w-full resize-none rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
      >
        {sent ? (
          <>
            <Check className="h-4 w-4" /> Ticket submitted
          </>
        ) : (
          "Submit ticket"
        )}
      </button>
    </form>
  );
}
