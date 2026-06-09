"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Scissors, Clipboard, Trash2, Share2, Star, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

interface RailAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
}

interface ContextActionRailMenuProps {
  className?: string;
}

const ACTIONS: RailAction[] = [
  { id: "copy", icon: Copy, label: "Copy" },
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "paste", icon: Clipboard, label: "Paste" },
  { id: "share", icon: Share2, label: "Share" },
  { id: "star", icon: Star, label: "Star" },
  { id: "delete", icon: Trash2, label: "Delete", danger: true },
];

export function ContextActionRailMenu({ className }: ContextActionRailMenuProps) {
  const [open, setOpen] = useState(true);
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className={cn("relative flex flex-col items-stretch gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl min-h-[280px]", className)}>
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">CONTEXT_ACTION_RAIL</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">Floating right-edge action stack · stagger reveal</span>
      </div>

      <div className="relative flex-1 rounded-lg border border-white/10 bg-black/30 p-3">
        <div className="text-xs text-white/60">
          Selected: <span className="text-white">launch-os-readme.md</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="h-12 rounded border border-white/5 bg-white/[0.03]" />
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-white/70 hover:text-white"
          aria-label={open ? "Hide actions" : "Show actions"}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="menu"
              aria-label="Context actions"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute right-2 top-12 flex flex-col gap-1 rounded-xl border border-white/10 bg-black/80 p-1.5 backdrop-blur-md shadow-2xl"
            >
              {ACTIONS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.button
                    key={a.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.18 }}
                    onClick={() => setLast(a.label)}
                    role="menuitem"
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                      a.danger ? "text-rose-300 hover:bg-rose-500/20" : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
                    {a.label}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
        last: <span className="text-primary">{last ?? "—"}</span>
      </div>
    </div>
  );
}
