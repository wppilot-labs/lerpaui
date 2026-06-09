"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  FileText,
  GitBranch,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface CommandMenuInteractiveBubbleProps {
  className?: string;
}

interface RecentAction {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const RECENT: RecentAction[] = [
  { id: "invite", label: "Invite teammate", hint: "Open invite dialog", icon: UserPlus },
  { id: "branch", label: "Create new branch", hint: "from main", icon: GitBranch },
  { id: "doc", label: "New document", hint: "Untitled", icon: FileText },
  { id: "chat", label: "Start a thread", hint: "in #general", icon: MessageSquare },
  { id: "ask", label: "Ask AI", hint: "Summarize this week", icon: Sparkles },
];

export function CommandMenuInteractiveBubble({ className }: CommandMenuInteractiveBubbleProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const panelId = React.useId();
  const inputId = React.useId();
  const listId = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RECENT;
    return RECENT.filter((r) => r.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <section
      aria-label="Quick actions launcher"
      className={cn(
        "relative isolate flex min-h-[340px] w-full overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-background/40 via-card/30 to-background/40 backdrop-blur-xl",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -bottom-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="absolute right-5 bottom-5 flex items-end justify-end">
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="panel"
              layoutId="bubble-launcher"
              role="dialog"
              aria-modal="false"
              id={panelId}
              aria-label="Quick actions"
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 28, mass: 0.7 }
              }
              className="flex w-[300px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: reduced ? 0 : 0.08 }}
                className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5"
              >
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
                <label htmlFor={inputId} className="sr-only">
                  Search actions
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  role="combobox"
                  aria-expanded
                  aria-controls={listId}
                  aria-autocomplete="list"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to do?"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close launcher"
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </motion.div>

              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: reduced ? 0 : 0.12 }}
                className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Recent
              </motion.div>

              <ul
                id={listId}
                role="listbox"
                aria-label="Recent actions"
                className="flex max-h-64 flex-col gap-0.5 overflow-y-auto px-1.5 pb-2"
              >
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                    Nothing matches &ldquo;{query}&rdquo;
                  </li>
                )}
                {filtered.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.id}
                      role="option"
                      aria-selected={false}
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: reduced ? 0 : 0.14 + idx * 0.03 }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-muted/60 focus:outline-none focus-visible:bg-muted/60"
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm text-foreground">{item.label}</span>
                          <span className="text-[11px] text-muted-foreground">{item.hint}</span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ) : (
            <motion.button
              key="fab"
              layoutId="bubble-launcher"
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open quick actions"
              aria-expanded={false}
              aria-controls={panelId}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 28, mass: 0.7 }
              }
              whileHover={reduced ? undefined : { scale: 1.05 }}
              whileTap={reduced ? undefined : { scale: 0.95 }}
              className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-xl shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Plus className="h-6 w-6" aria-hidden />
              <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-background bg-accent text-[9px] font-bold text-accent-foreground">
                <Bell className="h-2.5 w-2.5" aria-hidden />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="m-6 flex max-w-xs flex-col gap-1 self-start">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Launcher
        </span>
        <h3 className="text-base font-semibold text-foreground">Quick actions, one click away</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Tap the bubble to surface your most-used commands without leaving the page.
        </p>
      </div>
    </section>
  );
}

export default CommandMenuInteractiveBubble;
