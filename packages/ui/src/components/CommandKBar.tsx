"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Hash, FileText, Settings, User, Zap } from "lucide-react";
import { cn } from "../lib/cn";

interface CommandKBarProps {
  className?: string;
}

const ITEMS = [
  { id: "new-doc", label: "Create new document", group: "Actions", icon: FileText },
  { id: "settings", label: "Open settings", group: "Actions", icon: Settings },
  { id: "profile", label: "Open profile", group: "Actions", icon: User },
  { id: "boost", label: "Boost performance", group: "Actions", icon: Zap },
  { id: "ch-general", label: "general", group: "Channels", icon: Hash },
  { id: "ch-launches", label: "launches", group: "Channels", icon: Hash },
  { id: "ch-incidents", label: "incidents", group: "Channels", icon: Hash },
];

export function CommandKBar({ className }: CommandKBarProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ITEMS.filter((i) => i.label.toLowerCase().includes(s) || i.group.toLowerCase().includes(s)) : ITEMS;
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered.length]);

  useEffect(() => { if (open) inputRef.current?.focus(); else { setQ(""); setIdx(0); } }, [open]);
  useEffect(() => { setIdx(0); }, [q]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof ITEMS>();
    filtered.forEach((i) => { const a = m.get(i.group) ?? []; a.push(i); m.set(i.group, a); });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className={cn("relative flex flex-col items-center justify-center gap-4 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl min-h-[260px]", className)}>
      <div className="flex flex-col gap-1 font-mono select-none w-full">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">COMMAND_K_BAR</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Cmd/Ctrl + K · fuzzy filter · keyboard nav</span>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full max-w-md items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/50 hover:border-white/20 hover:text-white/80 transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Search className="h-3.5 w-3.5" /> Search commands…
        </span>
        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/70">⌘ K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-start justify-center rounded-2xl bg-black/70 backdrop-blur-sm p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <motion.div
              initial={{ y: -10, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
                  aria-label="Command input"
                />
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50">esc</kbd>
              </div>

              <div className="max-h-64 overflow-y-auto p-1.5">
                {filtered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-white/40">No matches.</div>
                ) : grouped.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <div className="px-2 py-1 text-[9px] uppercase tracking-widest text-white/30 font-mono">{group}</div>
                    {items.map((it) => {
                      const flatIdx = filtered.indexOf(it);
                      const active = flatIdx === idx;
                      const Icon = it.icon;
                      return (
                        <button
                          key={it.id}
                          onMouseEnter={() => setIdx(flatIdx)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                            active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-white/50" />
                            {it.label}
                          </span>
                          {active && <ArrowRight className="h-3 w-3 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
