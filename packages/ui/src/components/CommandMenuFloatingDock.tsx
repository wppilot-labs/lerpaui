"use client";

import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Command,
  Compass,
  Folder,
  LayoutGrid,
  Mail,
  Search,
  Settings,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface CommandMenuFloatingDockProps {
  className?: string;
}

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "home", label: "Workspace", icon: LayoutGrid, tone: "text-primary" },
  { id: "search", label: "Search", icon: Search, tone: "text-foreground" },
  { id: "explore", label: "Explore", icon: Compass, tone: "text-foreground" },
  { id: "files", label: "Files", icon: Folder, tone: "text-foreground" },
  { id: "terminal", label: "Terminal", icon: Terminal, tone: "text-foreground" },
  { id: "mail", label: "Inbox", icon: Mail, tone: "text-foreground" },
  { id: "ai", label: "Ask AI", icon: Sparkles, tone: "text-primary" },
  { id: "settings", label: "Settings", icon: Settings, tone: "text-foreground" },
];

function DockButton({
  item,
  mouseX,
  reduced,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  reduced: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [hovered, setHovered] = React.useState(false);

  const distance = useTransform(mouseX, (v) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return v - (rect.x + rect.width / 2);
  });

  const scaleTransform = useTransform(distance, [-110, 0, 110], [1, reduced ? 1 : 1.55, 1]);
  const scale = useSpring(scaleTransform, { stiffness: 260, damping: 22, mass: 0.3 });

  const Icon = item.icon;

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={item.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={reduced ? undefined : { scale }}
      className={cn(
        "relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-card/70 text-foreground/80 shadow-inner shadow-black/20 backdrop-blur-md transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        item.tone === "text-primary" && "text-primary"
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
      <AnimatePresence>
        {hovered && (
          <motion.span
            role="tooltip"
            initial={reduced ? false : { opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-popover px-2.5 py-1 text-[11px] font-medium text-popover-foreground shadow-lg"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function CommandMenuFloatingDock({ className }: CommandMenuFloatingDockProps) {
  const reduced = useReducedMotion() ?? false;
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const inputId = React.useId();
  const listboxId = React.useId();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  React.useEffect(() => {
    if (paletteOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [paletteOpen]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOCK_ITEMS;
    return DOCK_ITEMS.filter((i) => i.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <section
      aria-label="Floating command dock"
      className={cn(
        "relative isolate flex min-h-[260px] w-full items-end justify-center overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-background/40 via-background/20 to-card/40 p-6 backdrop-blur-xl",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <Command className="h-3 w-3" aria-hidden />
        Press
        <kbd className="rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground/90">
          ⌘K
        </kbd>
        to search
      </div>

      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Command palette"
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute bottom-28 left-1/2 w-[min(420px,90%)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <label htmlFor={inputId} className="sr-only">
                Search commands
              </label>
              <input
                ref={inputRef}
                id={inputId}
                role="combobox"
                aria-expanded
                aria-controls={listboxId}
                aria-autocomplete="list"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Close command palette"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Commands"
              className="max-h-56 overflow-y-auto p-1.5"
            >
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </li>
              )}
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => setPaletteOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted/60 focus:outline-none focus-visible:bg-muted/60"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card/70 px-3 py-2.5 shadow-2xl shadow-black/30 backdrop-blur-xl"
      >
        {DOCK_ITEMS.map((item) => (
          <DockButton key={item.id} item={item} mouseX={mouseX} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}

export default CommandMenuFloatingDock;
