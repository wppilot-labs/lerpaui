"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Breadcrumb trail where each segment opens a dropdown of sibling routes. */
export interface BreadcrumbSegment {
  id: string;
  label: string;
  href?: string;
  siblings?: { id: string; label: string; href?: string }[];
  onSelect?: (id: string) => void;
}

export interface BreadcrumbDropdownProps {
  segments?: BreadcrumbSegment[];
  separator?: React.ReactNode;
  className?: string;
}

const demo: BreadcrumbSegment[] = [
  { id: 'workspace', label: 'Workspace', href: '#', siblings: [
    { id: 'personal', label: 'Personal' }, { id: 'team', label: 'Team' }, { id: 'org', label: 'Acme Org' },
  ]},
  { id: 'projects', label: 'Projects', href: '#', siblings: [
    { id: 'lerpa', label: 'Lerpa UI' }, { id: 'shippable', label: 'Shippable' }, { id: 'datalab', label: 'Datalab' },
  ]},
  { id: 'dashboard', label: 'Dashboard', siblings: [
    { id: 'overview', label: 'Overview' }, { id: 'metrics', label: 'Metrics' }, { id: 'logs', label: 'Logs' },
  ]},
];

function Segment({ seg, last }: { seg: BreadcrumbSegment; last: boolean }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const hasSiblings = !!seg.siblings?.length;

  return (
    <div ref={ref} className="relative flex items-center">
      {seg.href ? (
        <a href={seg.href} className={cn('rounded px-1.5 py-0.5 text-sm transition-colors hover:bg-accent/40 hover:text-foreground motion-reduce:transition-none', last ? 'font-medium text-foreground' : 'text-muted-foreground')}>
          {seg.label}
        </a>
      ) : (
        <span className={cn('px-1.5 py-0.5 text-sm', last ? 'font-medium text-foreground' : 'text-muted-foreground')}>{seg.label}</span>
      )}
      {hasSiblings && (
        <button
          type="button"
          aria-haspopup="menu" aria-expanded={open} aria-label={`Switch ${seg.label}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
      {open && hasSiblings && (
        <ul role="menu" className="absolute left-0 top-full z-30 mt-1 min-w-40 rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
          {seg.siblings!.map((s) => (
            <li key={s.id} role="none">
              <button
                role="menuitem"
                type="button"
                onClick={() => { seg.onSelect?.(s.id); setOpen(false); if (s.href) window.location.assign(s.href); }}
                className="block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BreadcrumbDropdown({ segments, separator = '/', className }: BreadcrumbDropdownProps) {
  const list = segments ?? demo;
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {list.map((seg, i) => (
          <React.Fragment key={seg.id}>
            <li><Segment seg={seg} last={i === list.length - 1} /></li>
            {i < list.length - 1 && <li aria-hidden="true" className="px-0.5 text-sm text-muted-foreground">{separator}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

BreadcrumbDropdown.displayName = 'BreadcrumbDropdown';
