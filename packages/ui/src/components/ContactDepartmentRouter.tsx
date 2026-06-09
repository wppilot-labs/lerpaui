"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, Check, ChevronDown, Briefcase, LifeBuoy, DollarSign, Megaphone, Code } from "lucide-react";
import { cn } from "../lib/cn";

export interface ContactDepartmentRouterProps {
  className?: string;
}

const DEPARTMENTS = [
  { id: "sales", label: "Sales inquiry", icon: DollarSign, sla: "1 business day", color: "text-emerald-500" },
  { id: "support", label: "Customer support", icon: LifeBuoy, sla: "4 hours", color: "text-blue-500" },
  { id: "partners", label: "Partnerships", icon: Briefcase, sla: "2 business days", color: "text-violet-500" },
  { id: "press", label: "Press & media", icon: Megaphone, sla: "1 business day", color: "text-amber-500" },
  { id: "engineering", label: "Engineering & API", icon: Code, sla: "8 hours", color: "text-cyan-500" },
] as const;

export function ContactDepartmentRouter({ className }: ContactDepartmentRouterProps) {
  const reduced = useReducedMotion();
  const [dept, setDept] = useState<typeof DEPARTMENTS[number]["id"]>("sales");
  const [sent, setSent] = useState(false);
  const headingId = React.useId();
  const active = DEPARTMENTS.find((d) => d.id === dept) ?? DEPARTMENTS[0];

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
        <div className="mb-10 text-center">
          <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Route your message
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Pick the right team so we can get back to you faster.
          </p>
        </div>

        <motion.form
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <label htmlFor="cdr-dept" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Which team should this go to?
            </label>
            <div className="relative">
              <select
                id="cdr-dept"
                value={dept}
                onChange={(e) => setDept(e.target.value as typeof dept)}
                className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-4 pr-10 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <motion.div
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
            >
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5", active.color)}>
                <active.icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="text-sm">
                <div className="font-semibold text-foreground">{active.label}</div>
                <div className="text-xs text-muted-foreground">Typical response: {active.sla}</div>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cdr-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
              <input id="cdr-name" type="text" required placeholder="Jane Cooper" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
            </div>
            <div>
              <label htmlFor="cdr-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              <input id="cdr-email" type="email" required placeholder="jane@company.com" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="cdr-msg" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea id="cdr-msg" rows={4} required placeholder={`Tell ${active.label.toLowerCase().split(' ')[0]} team what's on your mind...`} className="w-full resize-none rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
          </div>

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            {sent ? (<><Check className="h-4 w-4" aria-hidden /> Routed to {active.label}!</>) : (<>Send to {active.label} <Send className="h-4 w-4" aria-hidden /></>)}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactDepartmentRouter;
