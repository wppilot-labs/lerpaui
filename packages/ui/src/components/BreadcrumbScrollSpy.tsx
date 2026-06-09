"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../lib/cn";

interface BreadcrumbScrollSpyProps {
  className?: string;
}

const SECTIONS = [
  { id: "root", label: "Root", body: "Top-level overview · always pinned" },
  { id: "products", label: "Products", body: "Catalog · 42 SKUs · q2 refresh" },
  { id: "category-a", label: "Audio", body: "Headphones · speakers · pro gear" },
  { id: "sku-9012", label: "ANC-9012", body: "Active-noise-canceling · titanium build" },
];

export function BreadcrumbScrollSpy({ className }: BreadcrumbScrollSpyProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = (visible.target as HTMLElement).dataset.section;
        const i = SECTIONS.findIndex((s) => s.id === id);
        if (i >= 0) setActiveIdx(i);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const trail = SECTIONS.slice(0, activeIdx + 1);

  return (
    <div className={cn("flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full", className)}>
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">BREADCRUMB_SCROLL_SPY</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Trail auto-syncs to scroll position via IntersectionObserver</span>
      </div>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 overflow-x-auto rounded-lg border border-white/10 bg-black/40 px-3 py-2">
        <Home className="h-3.5 w-3.5 shrink-0 text-white/50" />
        {trail.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className={cn(
              "whitespace-nowrap text-xs font-semibold",
              i === trail.length - 1 ? "text-white" : "text-white/50",
            )}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </nav>

      <div
        ref={scrollRef}
        className="h-44 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 scroll-smooth"
      >
        {SECTIONS.map((s) => (
          <div
            key={s.id}
            data-section={s.id}
            ref={(el) => { sectionRefs.current[s.id] = el; }}
            className="mb-3 rounded border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{s.label}</div>
            <p className="mt-1 text-xs text-white/70">{s.body}</p>
            <div className="mt-2 h-16 rounded bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
