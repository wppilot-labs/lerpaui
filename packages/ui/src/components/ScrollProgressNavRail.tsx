"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

interface ScrollProgressNavRailProps {
  className?: string;
}

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "install", label: "Install" },
  { id: "config", label: "Config" },
  { id: "themes", label: "Themes" },
  { id: "deploy", label: "Deploy" },
];

export function ScrollProgressNavRail({ className }: ScrollProgressNavRailProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max <= 0 ? 0 : el.scrollTop / max);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!v) return;
        const id = (v.target as HTMLElement).dataset.section;
        if (id) setActive(id);
      },
      { root, threshold: [0.3, 0.6] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={cn("flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full", className)}>
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SCROLL_PROGRESS_NAV_RAIL</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Vertical TOC with rAF-throttled progress bar</span>
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-3">
        <nav aria-label="Page sections" className="relative flex flex-col gap-1 rounded-lg border border-white/10 bg-black/40 p-2">
          <div aria-hidden="true" className="absolute left-3 top-3 bottom-3 w-px bg-white/10">
            <div
              className="absolute left-0 top-0 w-px bg-primary transition-[height] duration-150"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => jumpTo(s.id)}
                className={cn(
                  "relative z-10 pl-4 pr-2 py-1.5 text-left text-[11px] font-semibold rounded transition-colors",
                  isActive ? "text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                <span aria-hidden="true" className={cn(
                  "absolute left-[10px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors",
                  isActive ? "bg-primary ring-2 ring-primary/30" : "bg-white/20",
                )} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div ref={scrollRef} className="h-52 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 scroll-smooth">
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              data-section={s.id}
              ref={(el) => { sectionRefs.current[s.id] = el; }}
              className="mb-4"
            >
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary">{s.label}</h4>
              <p className="mt-1 text-xs text-white/70 leading-relaxed">
                Section content for {s.label.toLowerCase()}. Scrollspy promotes the active anchor in the rail as it intersects.
              </p>
              <div className="mt-2 h-20 rounded bg-gradient-to-br from-white/5 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
        progress: <span className="text-primary">{Math.round(progress * 100)}%</span> · active: <span className="text-primary">{active}</span>
      </div>
    </div>
  );
}
