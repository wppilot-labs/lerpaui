"use client";

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

/** Dropdown notification center grouped into unread and read sections. */
export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  read?: boolean;
  variant?: 'info' | 'success' | 'warning' | 'error';
  href?: string;
}

export interface NotificationCenterProps {
  items?: NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  className?: string;
  label?: string;
}

const variantStyles: Record<NonNullable<NotificationItem['variant']>, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

const demo: NotificationItem[] = [
  { id: '1', title: 'New deployment failed', description: 'web-app build #482 returned exit code 1', time: '2m ago', variant: 'error' },
  { id: '2', title: 'Pull request approved', description: 'Riley approved your PR #214', time: '15m ago', variant: 'success' },
  { id: '3', title: 'Billing reminder', description: 'Invoice #88-104 is due in 3 days', time: '1h ago', variant: 'warning' },
  { id: '4', title: 'New comment', description: 'Sam mentioned you in “Spec v2”', time: '3h ago', read: true, variant: 'info' },
  { id: '5', title: 'Daily digest', description: '12 tasks completed yesterday', time: 'Yesterday', read: true, variant: 'info' },
];

export function NotificationCenter({
  items,
  onItemClick,
  onMarkAllRead,
  className,
  label = 'Notifications',
}: NotificationCenterProps) {
  const [list, setList] = React.useState<NotificationItem[]>(items ?? demo);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => { if (items) setList(items); }, [items]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const unread = list.filter((i) => !i.read);
  const read = list.filter((i) => i.read);

  const markAll = () => { setList((l) => l.map((i) => ({ ...i, read: true }))); onMarkAllRead?.(); };
  const select = (item: NotificationItem) => {
    setList((l) => l.map((i) => i.id === item.id ? { ...i, read: true } : i));
    onItemClick?.(item);
  };

  const Section = ({ title, group }: { title: string; group: NotificationItem[] }) => (
    <div>
      <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {group.length === 0 ? (
        <div className="px-3 py-4 text-center text-xs text-muted-foreground">Nothing here.</div>
      ) : (
        <ul className="m-0 list-none p-1">
          {group.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => select(i)}
                className={cn(
                  'flex w-full gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none motion-reduce:transition-none',
                  !i.read && 'bg-accent/20'
                )}
              >
                <span aria-hidden="true" className={cn('mt-1.5 inline-block size-2 shrink-0 rounded-full', variantStyles[i.variant ?? 'info'], i.read && 'opacity-30')} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{i.title}</span>
                    {!i.read && <span aria-label="Unread" className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  </span>
                  {i.description && <span className="line-clamp-2 text-xs text-muted-foreground">{i.description}</span>}
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">{i.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog" aria-expanded={open} aria-label={`${label}${unread.length ? `, ${unread.length} unread` : ''}`}
        className="relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a4 4 0 0 0-4 4v2.6L2.5 10h11L12 8.1V5.5a4 4 0 0 0-4-4zM6.5 12.5a1.5 1.5 0 1 0 3 0" stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {unread.length > 0 && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unread.length > 99 ? '99+' : unread.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-label={label}
            initial={{ opacity: 0, y: reduce ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <h3 className="text-sm font-semibold">{label}</h3>
              <button type="button" onClick={markAll} disabled={unread.length === 0}
                className="text-xs text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50">Mark all read</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Section title={`Unread (${unread.length})`} group={unread} />
              <Section title={`Earlier (${read.length})`} group={read} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

NotificationCenter.displayName = 'NotificationCenter';
