"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Resizable two-pane splitter, horizontal or vertical, with keyboard support. */
export interface SplitterPaneProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: 'horizontal' | 'vertical';
  defaultRatio?: number;
  min?: number;
  max?: number;
  className?: string;
  ariaLabel?: string;
}

export function SplitterPane({
  children,
  direction = 'horizontal',
  defaultRatio = 0.5,
  min = 0.1,
  max = 0.9,
  className,
  ariaLabel = 'Resize pane',
}: SplitterPaneProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = React.useState(defaultRatio);
  const [dragging, setDragging] = React.useState(false);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const r = direction === 'horizontal'
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;
      setRatio(clamp(r));
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clamp is a stable utility defined outside component scope
  }, [dragging, direction]);

  const onKey: React.KeyboardEventHandler = (e) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    if (direction === 'horizontal') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setRatio((r) => clamp(r - step)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setRatio((r) => clamp(r + step)); }
    } else {
      if (e.key === 'ArrowUp') { e.preventDefault(); setRatio((r) => clamp(r - step)); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setRatio((r) => clamp(r + step)); }
    }
    if (e.key === 'Home') { e.preventDefault(); setRatio(min); }
    if (e.key === 'End') { e.preventDefault(); setRatio(max); }
  };

  const pct = `${(ratio * 100).toFixed(2)}%`;
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={ref}
      style={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column' }}
      className={cn('h-full min-h-40 w-full overflow-hidden rounded-lg border border-border bg-card', className)}
    >
      <div style={{ flex: `0 0 ${pct}`, overflow: 'auto' }} className="bg-background">
        {children[0]}
      </div>
      <div
        role="slider"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={Math.round(min * 100)}
        aria-valuemax={Math.round(max * 100)}
        aria-label={ariaLabel}
        tabIndex={0}
        onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
        onKeyDown={onKey}
        className={cn(
          'relative shrink-0 border-border bg-border transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none motion-reduce:transition-none',
          isHorizontal ? 'w-1 cursor-col-resize border-x' : 'h-1 cursor-row-resize border-y',
          dragging && 'bg-accent'
        )}
      >
        <span aria-hidden="true" className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/40', isHorizontal ? 'h-6 w-0.5' : 'h-0.5 w-6')} />
      </div>
      <div style={{ flex: '1 1 auto', overflow: 'auto' }} className="bg-background">
        {children[1]}
      </div>
    </div>
  );
}

SplitterPane.displayName = 'SplitterPane';
