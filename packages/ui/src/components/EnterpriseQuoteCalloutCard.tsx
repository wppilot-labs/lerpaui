"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Headphones, Building2 } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface EnterpriseQuoteCalloutCardProps {
  className?: string;
  onContact?: () => void;
}

const TRUST = [
  { name: "Acme", mark: "A" },
  { name: "Northwind", mark: "N" },
  { name: "Initech", mark: "I" },
  { name: "Hooli", mark: "H" },
  { name: "Vandelay", mark: "V" },
];

const FEATURES = [
  { Icon: ShieldCheck, label: "SOC 2 + HIPAA" },
  { Icon: Headphones, label: "24/7 dedicated CSM" },
  { Icon: Building2, label: "Volume invoicing" },
];

export function EnterpriseQuoteCalloutCard({
  className,
  onContact,
}: EnterpriseQuoteCalloutCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "w-full max-w-sm border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">ENTERPRISE_QUOTE</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Custom quote · trust strip</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/[0.04] to-transparent p-4 flex flex-col gap-3">
        {/* ambient glow */}
        <motion.span
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow, rgba(201,255,55,0.55)), transparent 60%)",
            filter: "blur(36px)",
          }}
          animate={reduced ? undefined : { opacity: [0.45, 0.7, 0.45] }}
          transition={reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          <span className="text-[9px] font-mono uppercase tracking-widest text-primary/80 inline-flex items-center gap-1">
            <Building2 aria-hidden="true" className="w-3 h-3" />
            For teams 50+
          </span>
          <h3 className="mt-1 text-base font-bold text-white leading-snug">
            Tailored pricing for your <span className="text-primary">scale</span>.
          </h3>
          <p className="text-[11px] text-white/60 leading-relaxed mt-1">
            Volume discounts, custom SSO, and a named engineer. We&apos;ll get back within one business day.
          </p>
        </div>

        <ul className="relative grid grid-cols-1 gap-1.5">
          {FEATURES.map((f) => (
            <li
              key={f.label}
              className="flex items-center gap-2 text-[10px] font-mono text-white/70"
            >
              <f.Icon aria-hidden="true" className="w-3 h-3 text-primary shrink-0" />
              {f.label}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onContact}
          className="relative group inline-flex items-center justify-center gap-1.5 w-full h-9 px-3 rounded-lg bg-primary text-zinc-950 text-[11px] font-bold uppercase tracking-widest shadow-[0_0_24px_-6px_var(--accent-glow,rgba(201,255,55,0.55))] transition-transform hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Talk to sales
          <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[8px] font-mono uppercase tracking-widest text-white/30">
          Trusted by
        </span>
        <ul
          aria-label="Customer logos"
          className="flex items-center gap-1.5 flex-wrap"
        >
          {TRUST.map((t) => (
            <li
              key={t.name}
              title={t.name}
              className="grid place-items-center w-8 h-8 rounded-md border border-white/5 bg-white/[0.02] text-[10px] font-bold text-white/70 font-mono"
            >
              {t.mark}
            </li>
          ))}
          <li className="text-[9px] font-mono text-white/40 ml-1">+220 teams</li>
        </ul>
      </div>
    </div>
  );
}
