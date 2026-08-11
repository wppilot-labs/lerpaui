'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, Search, Github, Sun, Menu, X } from 'lucide-react';
import { cn } from '../lib/cn';

const LINKS = ['Docs', 'API', 'Examples', 'Blog'];

export function NavbarDocsBasic({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav
      aria-label="Documentation"
      className={cn(
        'relative w-full max-w-3xl mx-auto px-5 py-3 font-sans text-foreground',
        'border-b border-white/[0.06] bg-bg/70 backdrop-blur-xl',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-primary" strokeWidth={2.3} />
          <span className="text-sm font-semibold tracking-tight">Lerpa UI</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70">
            v0.3
          </span>
        </a>

        <ul role="menubar" className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l, i) => (
            <li key={l} role="none">
              <button
                role="menuitem"
                aria-current={i === 0 ? 'page' : undefined}
                className={cn(
                  'relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                  i === 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {l}
                {i === 0 && (
                  <span
                    aria-hidden
                    className="absolute -bottom-3 left-2 right-2 h-px bg-primary shadow-[0_0_8px_var(--accent-glow)]"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search docs (Ctrl K)"
            className="hidden sm:inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors w-44"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search documentation</span>
            <kbd className="ml-auto rounded border border-white/10 px-1 py-px font-mono text-[9px]">
              ⌘K
            </kbd>
          </button>
          <button
            aria-label="Toggle theme"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            aria-label="GitHub repository"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </button>
          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="navbar-docs-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navbar-docs-menu"
            role="menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden mt-3"
          >
            <ul className="border-t border-white/[0.06] pt-3 flex flex-col gap-0.5">
              {LINKS.map((l) => (
                <li key={l}>
                  <button
                    role="menuitem"
                    className="w-full text-left rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
