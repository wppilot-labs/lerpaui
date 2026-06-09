"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { cn } from "../lib/cn";

type InfoItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
};

const ITEMS: InfoItem[] = [
  { icon: MapPin, label: "Office", value: "548 Market Street", sub: "San Francisco, CA 94104" },
  { icon: Phone, label: "Phone", value: "+1 (415) 555-0199", sub: "Mon–Fri, 9am–6pm PT" },
  { icon: Mail, label: "Email", value: "hello@company.com", sub: "We reply within 24h" },
  { icon: Clock, label: "Hours", value: "9:00 — 18:00", sub: "Pacific Time" },
];

export interface ContactInfoSectionProps {
  className?: string;
}

export function ContactInfoSection({ className }: ContactInfoSectionProps) {
  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="relative h-36 bg-secondary/30 border-b border-foreground/[0.05]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
        </div>
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-card/80 px-2 py-1 text-[11px] font-medium text-muted-foreground/80">
          <Navigation className="w-3 h-3" />
          Map
        </span>
      </div>

      <div className="p-5">
        <h2 className="text-base font-bold mb-4">Visit or reach us</h2>
        <ul className="space-y-3.5">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground/45">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground/90">{item.value}</div>
                  <div className="text-xs text-muted-foreground/60">{item.sub}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
