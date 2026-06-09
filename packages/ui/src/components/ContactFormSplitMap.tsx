"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Mail, Phone, Send, Check, Clock, Globe } from "lucide-react";
import { cn } from "../lib/cn";

export interface ContactFormSplitMapProps {
  className?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  email?: string;
  phone?: string;
}

export function ContactFormSplitMap({
  className,
  addressLine1 = "548 Market Street",
  addressLine2 = "Suite 41218",
  city = "San Francisco, CA 94104",
  email = "hello@lerpaui.com",
  phone = "+1 (415) 555-0142",
}: ContactFormSplitMapProps) {
  const reduced = useReducedMotion();
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            We&apos;d love to hear from you. Drop a message or visit our office.
          </p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cfsm-first" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">First name</label>
                  <input id="cfsm-first" type="text" required placeholder="Jane" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
                </div>
                <div>
                  <label htmlFor="cfsm-last" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last name</label>
                  <input id="cfsm-last" type="text" required placeholder="Cooper" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
                </div>
              </div>
              <div>
                <label htmlFor="cfsm-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <input id="cfsm-email" type="email" required placeholder="jane@company.com" className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
              </div>
              <div>
                <label htmlFor="cfsm-msg" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea id="cfsm-msg" rows={5} required placeholder="How can we help?" className="w-full resize-none rounded-xl border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                {sent ? (<><Check className="h-4 w-4" aria-hidden /> Message sent!</>) : (<>Send message <Send className="h-4 w-4" aria-hidden /></>)}
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-64 w-full overflow-hidden" aria-hidden>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cyan-500/15 to-fuchsia-500/15" />
              <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60">
                <defs>
                  <pattern id="grid-cfsm" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#grid-cfsm)" />
                <path d="M0 180 Q100 150 200 175 T400 165" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/30" strokeLinecap="round" />
                <path d="M50 0 Q70 120 90 200 T150 300" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/20" strokeLinecap="round" />
              </svg>
              <motion.div
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl">
                  <MapPin className="h-6 w-6" aria-hidden />
                  <motion.span
                    animate={reduced ? undefined : { scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={reduced ? undefined : { duration: 2, ease: "easeOut", repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                </div>
              </motion.div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                <div className="text-sm">
                  <div className="font-semibold text-foreground">{addressLine1}</div>
                  <div className="text-muted-foreground">{addressLine2}</div>
                  <div className="text-muted-foreground">{city}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                <a href={`mailto:${email}`} className="text-sm text-foreground hover:underline">{email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                <a href={`tel:${phone}`} className="text-sm text-foreground hover:underline">{phone}</a>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Mon–Fri · 9am–6pm PT
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  24/7 chat support
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactFormSplitMap;
