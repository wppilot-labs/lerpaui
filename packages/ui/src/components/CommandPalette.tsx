"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

/** Cmd/Ctrl+K command palette with fuzzy search, keyboard nav, and grouped results. */
export interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  shortcut?: string;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  commands?: PaletteCommand[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  triggerKey?: string;
}

const demo: PaletteCommand[] = [
  { id: '1', label: 'Create new file', group: 'File', shortcut: 'N' },
  { id: '2', label: 'Open recent', group: 'File', shortcut: 'O' },
  { id: '3', label: 'Save workspace', group: 'File', shortcut: 'S' },
  { id: '4', label: 'Toggle theme', group: 'View', shortcut: 'T' },
  { id: '5', label: 'Go to dashboard', group: 'Navigate' },
  { id: '6', label: 'Go to settings', group: 'Navigate' },
  { id: '7', label: 'Sign out', group: 'Account' },
];

function fuzzy(q: string, label: string) {
  if (!q) return true;
  const s = label.toLowerCase();
  let i = 0;
  for (const c of q.toLowerCase()) {
    i = s.indexOf(c, i);
    if (i === -1) return false;
    i++;
  }
  return true;
}

export function CommandPalette({
  commands = demo,
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  triggerKey = 'k',
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (v: boolean) => { if (!isControlled) setInternalOpen(v); onOpenChange?.(v); };
  const reduce = useReducedMotion();
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === triggerKey) { e.preventDefault(); setOpen(!isOpen); }
      if (e.key === 'Escape' && isOpen) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setOpen is stable from useState/props; intentional dep list
  }, [isOpen, triggerKey]);

  React.useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 10); else { setQ(''); setActive(0); } }, [isOpen]);

  const results = React.useMemo(() => commands.filter((c) => fuzzy(q, c.label)), [commands, q]);
  const groups = React.useMemo(() => {
    const map = new Map<string, PaletteCommand[]>();
    results.forEach((c) => { const k = c.group ?? 'Commands'; if (!map.has(k)) map.set(k, []); map.get(k)!.push(c); });
    return Array.from(map.entries());
  }, [results]);

  const run = (cmd: PaletteCommand) => { cmd.onSelect?.(); setOpen(false); };

  const onKey: React.KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); const c = results[active]; if (c) run(c); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <motion.div
            initial={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.14, ease: 'easeOut' }}
            role="dialog" aria-modal="true" aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full max-w-xl rounded-xl border border-border bg-popover text-popover-foreground shadow-xl')}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setActive(0); }}
              onKeyDown={onKey}
              placeholder={placeholder}
              role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={results[active]?.id}
              className="h-12 w-full rounded-t-xl border-b border-border bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <ul id="cmdk-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</li>}
              {groups.map(([group, cmds]) => (
                <li key={group} role="none">
                  <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</div>
                  <ul role="none" className="m-0 list-none p-0">
                    {cmds.map((c) => {
                      const idx = results.indexOf(c);
                      const isActive = idx === active;
                      return (
                        <li
                          key={c.id} id={c.id} role="option" aria-selected={isActive}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => run(c)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(c); } }}
                          className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm', isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/40')}
                        >
                          <span className="truncate">{c.label}</span>
                          {c.shortcut && <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{c.shortcut}</kbd>}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

CommandPalette.displayName = 'CommandPalette';
