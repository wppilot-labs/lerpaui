"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LifeBuoy, Paperclip, Send, Check, AlertTriangle, AlertCircle, Info, Flame } from "lucide-react";
import { cn } from "../lib/cn";

export interface ContactSupportTicketFormProps {
  className?: string;
}

const PRIORITIES = [
  { id: "low", label: "Low", icon: Info, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30", desc: "Question or feedback" },
  { id: "medium", label: "Medium", icon: AlertCircle, bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30", desc: "Issue affecting workflow" },
  { id: "high", label: "High", icon: AlertTriangle, bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30", desc: "Blocking work for many" },
  { id: "urgent", label: "Urgent", icon: Flame, bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30", desc: "Production outage" },
] as const;

const CATEGORIES = ["Billing", "API & integrations", "Account & access", "Bug report", "Feature request", "Other"] as const;

export function ContactSupportTicketForm({ className }: ContactSupportTicketFormProps) {
  const reduced = useReducedMotion();
  const [priority, setPriority] = useState<typeof PRIORITIES[number]["id"]>("medium");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Bug report");
  const [sent, setSent] = useState(false);
  const headingId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <LifeBuoy className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div>
            <h2 id={headingId} className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Open a support ticket
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Our team responds within 4 hours during business hours. Average first response: 47 minutes.
            </p>
          </div>
        </div>

        <motion.form
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <fieldset>
            <legend className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Priority</legend>
            <div role="radiogroup" aria-label="Priority" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIORITIES.map((p) => {
                const selected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPriority(p.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      selected ? cn(p.border, p.bg, "shadow-sm") : "border-border bg-background hover:border-border/80",
                    )}
                  >
                    <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg", p.bg, p.text)}>
                      <p.icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div>
                      <div className={cn("text-sm font-semibold", selected ? p.text : "text-foreground")}>{p.label}</div>
                      <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cstf-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <select id="cstf-category" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cstf-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your email</label>
              <input id="cstf-email" type="email" required placeholder="jane@company.com" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="cstf-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
            <input id="cstf-subject" type="text" required placeholder="Brief summary of the issue" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
          </div>

          <div className="mt-4">
            <label htmlFor="cstf-detail" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Describe the issue</label>
            <textarea id="cstf-detail" rows={5} required placeholder="Steps to reproduce, expected vs actual behavior, error messages..." className="w-full resize-none rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-border bg-background/40 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Paperclip className="h-4 w-4" aria-hidden />
              Drop screenshots or logs to attach (max 10MB each)
            </div>
            <button type="button" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              Browse
            </button>
          </div>

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            {sent ? (<><Check className="h-4 w-4" aria-hidden /> Ticket created — check your inbox</>) : (<>Submit ticket <Send className="h-4 w-4" aria-hidden /></>)}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactSupportTicketForm;
