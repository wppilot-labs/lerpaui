"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Hour/minute/period picker with arrow-key step controls and 12/24h modes. */
export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  mode?: '12h' | '24h';
  step?: number;
  className?: string;
  ariaLabel?: string;
}

function parse(value: string | undefined, mode: '12h' | '24h'): { h: number; m: number; period: 'AM' | 'PM' } {
  let h = 9, m = 0;
  if (value) {
    const m24 = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (m24) { h = parseInt(m24[1], 10); m = parseInt(m24[2], 10); }
  }
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const displayH = mode === '12h' ? ((h + 11) % 12) + 1 : h;
  return { h: displayH, m, period };
}

function format24(h: number, m: number, period: 'AM' | 'PM' | null, mode: '12h' | '24h'): string {
  let H = h;
  if (mode === '12h' && period) {
    if (period === 'AM') H = h === 12 ? 0 : h;
    else H = h === 12 ? 12 : h + 12;
  }
  return `${String(H).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function TimePicker({ value, onChange, mode = '24h', step = 1, className, ariaLabel = 'Time picker' }: TimePickerProps) {
  const initial = parse(value, mode);
  const [h, setH] = React.useState(initial.h);
  const [m, setM] = React.useState(initial.m);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(initial.period);

  React.useEffect(() => {
    const p = parse(value, mode); setH(p.h); setM(p.m); setPeriod(p.period);
  }, [value, mode]);

  const emit = (nh: number, nm: number, np: 'AM' | 'PM') => onChange?.(format24(nh, nm, mode === '12h' ? np : null, mode));

  const cap = (n: number, max: number) => ((n % max) + max) % max;

  const adjustH = (delta: number) => {
    const max = mode === '12h' ? 12 : 24;
    const base = mode === '12h' ? cap(h - 1 + delta, max) + 1 : cap(h + delta, max);
    setH(base);
    emit(base, m, period);
  };
  const adjustM = (delta: number) => {
    const nm = cap(m + delta * step, 60);
    setM(nm);
    emit(h, nm, period);
  };
  const togglePeriod = () => {
    const np = period === 'AM' ? 'PM' : 'AM';
    setPeriod(np);
    emit(h, m, np);
  };

  const Cell = ({ val, label, onUp, onDown, format }: { val: number; label: string; onUp: () => void; onDown: () => void; format?: (v: number) => string }) => (
    <div className="flex flex-col items-center">
      <button type="button" aria-label={`Increase ${label}`} onClick={onUp}
        className="rounded text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
        <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 6l3-3 3 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <input
        type="text" readOnly value={format ? format(val) : String(val).padStart(2, '0')}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') { e.preventDefault(); onUp(); }
          if (e.key === 'ArrowDown') { e.preventDefault(); onDown(); }
        }}
        className="w-12 rounded-md bg-muted/30 py-1.5 text-center font-mono text-lg tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button type="button" aria-label={`Decrease ${label}`} onClick={onDown}
        className="rounded text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
        <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );

  return (
    <div role="group" aria-label={ariaLabel} className={cn('inline-flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground', className)}>
      <Cell val={h} label="Hour" onUp={() => adjustH(1)} onDown={() => adjustH(-1)} />
      <span aria-hidden="true" className="text-xl font-semibold text-muted-foreground">:</span>
      <Cell val={m} label="Minute" onUp={() => adjustM(1)} onDown={() => adjustM(-1)} />
      {mode === '12h' && (
        <button type="button" onClick={togglePeriod} aria-label={`Period, current ${period}`}
          className="ml-1 inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
          {period}
        </button>
      )}
    </div>
  );
}

TimePicker.displayName = 'TimePicker';
