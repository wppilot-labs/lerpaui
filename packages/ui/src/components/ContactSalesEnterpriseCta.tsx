"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, CheckCircle2, Building2, Users, ShieldCheck, Phone, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface ContactSalesEnterpriseCtaProps {
  className?: string;
}

const PROOF_POINTS = [
  { icon: ShieldCheck, label: "SOC 2 Type II & HIPAA" },
  { icon: Users, label: "Dedicated CSM" },
  { icon: Building2, label: "Custom MSAs & DPAs" },
];

const SLOTS = [
  { day: "Tue", date: "12 May", time: "10:00 AM PT" },
  { day: "Tue", date: "12 May", time: "2:30 PM PT" },
  { day: "Wed", date: "13 May", time: "9:00 AM PT" },
  { day: "Wed", date: "13 May", time: "1:00 PM PT" },
];

export function ContactSalesEnterpriseCta({ className }: ContactSalesEnterpriseCtaProps) {
  const reduced = useReducedMotion();
  const [slot, setSlot] = useState(0);
  const [booked, setBooked] = useState(false);
  const headingId = React.useId();

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => setBooked(false), 4000);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full overflow-hidden bg-background px-6 py-16 md:py-24", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.7_0.22_260/0.18),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Building2 className="h-3.5 w-3.5" aria-hidden />
            Enterprise
          </div>
          <h2 id={headingId} className="mt-5 text-balance text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Built for the way enterprises actually buy software.
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Custom volume pricing, SSO/SCIM, dedicated infra, and a real human you can call. Talk to sales — most calls take 22 minutes.
          </p>

          <ul className="mt-7 space-y-2.5">
            {PROOF_POINTS.map((p) => (
              <li key={p.label} className="flex items-center gap-3 text-sm text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-4 w-4" aria-hidden />
                </span>
                {p.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
            <Phone className="h-4 w-4" aria-hidden />
            <span>Or call us directly at</span>
            <a href="tel:+14155550142" className="font-semibold text-foreground hover:underline">+1 (415) 555-0142</a>
          </div>
        </motion.div>

        <motion.form
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleBook}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Book a 22-min discovery call</h3>
              <p className="text-xs text-muted-foreground">Times shown in your local timezone.</p>
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pick a time</legend>
            <div role="radiogroup" aria-label="Available time slots" className="grid grid-cols-2 gap-2">
              {SLOTS.map((s, i) => {
                const selected = slot === i;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSlot(i)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      selected ? "border-primary/40 bg-primary/10 text-primary shadow-sm" : "border-border bg-background text-foreground hover:border-border/80",
                    )}
                  >
                    <span className="text-xs uppercase tracking-wider opacity-70">{s.day} · {s.date}</span>
                    <span className="font-semibold">{s.time}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input type="text" required placeholder="Work email" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
            <input type="text" required placeholder="Company name" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
          </div>

          <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            {booked ? (<><CheckCircle2 className="h-4 w-4" aria-hidden /> Booked — calendar invite sent</>) : (<>Confirm {SLOTS[slot]?.time} <ArrowRight className="h-4 w-4" aria-hidden /></>)}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactSalesEnterpriseCta;
