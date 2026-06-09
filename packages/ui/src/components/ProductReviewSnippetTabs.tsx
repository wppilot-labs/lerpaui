"use client";

import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, MessageSquare, Sparkles, Star } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProductReviewSnippetTabsProps {
  className?: string;
}

type TabKey = "overview" | "specs" | "reviews" | "qa";

interface TabDef {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

const TABS: TabDef[] = [
  { key: "overview", label: "Overview", icon: Sparkles },
  { key: "specs", label: "Specs", icon: FileText },
  { key: "reviews", label: "Reviews", icon: Star, count: 312 },
  { key: "qa", label: "Q & A", icon: MessageSquare, count: 47 },
];

const SPECS: [string, string][] = [
  ["Driver", "40 mm beryllium"],
  ["Impedance", "32 Ω"],
  ["Battery", "38 h ANC off"],
  ["Weight", "248 g"],
];

const REVIEWS = [
  {
    name: "Maya R.",
    rating: 5,
    text: "Stage-monitor clarity at consumer weight. Wore them through a 9-hour mix session and forgot they were on.",
  },
  {
    name: "Theo K.",
    rating: 4,
    text: "ANC is a touch warm but the rebalance app fixes it. Build is real metal, not the painted plastic you see at this price.",
  },
];

export function ProductReviewSnippetTabs({
  className,
}: ProductReviewSnippetTabsProps) {
  const [active, setActive] = useState<TabKey>("overview");
  const groupId = useId();

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl select-none overflow-hidden text-foreground p-4 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">
            REVIEW_TABS
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            Morphing underline · 4 panels
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Product detail panels"
        className="relative flex border-b border-white/5"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              type="button"
              key={t.key}
              role="tab"
              id={`${groupId}-tab-${t.key}`}
              aria-selected={isActive}
              aria-controls={`${groupId}-panel-${t.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.key)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
                isActive ? "text-primary" : "text-white/50 hover:text-white/80",
              )}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="text-[8px] text-white/40 font-mono">
                  ({t.count})
                </span>
              )}
              {isActive && (
                <motion.span
                  layoutId={`${groupId}-underline`}
                  className="absolute left-2 right-2 bottom-0 h-0.5 rounded-full bg-primary shadow-[0_0_8px_var(--accent-glow)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`${groupId}-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`${groupId}-tab-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-[11px] text-white/70 leading-relaxed"
          >
            {active === "overview" && (
              <p>
                A studio reference can that fits in your bag. The Aurora wraps
                hi-fi drivers in a milled aluminium chassis tuned for long
                listening sessions. ANC adapts 240 times per second.
              </p>
            )}
            {active === "specs" && (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[10.5px]">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-white/40">{k}</dt>
                    <dd className="text-foreground text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {active === "reviews" && (
              <ul className="space-y-2.5">
                {REVIEWS.map((r) => (
                  <li
                    key={r.name}
                    className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-bold">{r.name}</span>
                      <span
                        className="flex items-center gap-0.5 text-amber"
                        aria-label={`${r.rating} of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-2.5 h-2.5",
                              i < r.rating ? "fill-current" : "text-white/15",
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-white/60">{r.text}</p>
                  </li>
                ))}
              </ul>
            )}
            {active === "qa" && (
              <div className="space-y-2">
                <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10.5px] font-bold mb-0.5">
                    Q: Does it support LDAC?
                  </p>
                  <p className="text-[10.5px] text-white/60">
                    A: Yes — LDAC, aptX Adaptive, and AAC. Codec switches on the
                    fly when the source changes.
                  </p>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10.5px] font-bold mb-0.5">
                    Q: USB audio class compliant?
                  </p>
                  <p className="text-[10.5px] text-white/60">
                    A: USB Audio Class 2 on macOS, Linux, iPadOS. Windows uses
                    the bundled ASIO driver for sub-3 ms latency.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
