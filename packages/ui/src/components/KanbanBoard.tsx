"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** HTML5 drag-and-drop multi-column Kanban board with sensible defaults. */
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tag?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  accent?: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  columns?: KanbanColumn[];
  onChange?: (next: KanbanColumn[]) => void;
  className?: string;
}

const demo: KanbanColumn[] = [
  {
    id: 'todo', title: 'To Do', accent: 'var(--accent)', cards: [
      { id: 'c1', title: 'Spec dashboard primitives', tag: 'design' },
      { id: 'c2', title: 'Audit a11y rules', tag: 'a11y' },
    ],
  },
  {
    id: 'doing', title: 'In Progress', cards: [
      { id: 'c3', title: 'Wire registry build', tag: 'infra' },
    ],
  },
  {
    id: 'done', title: 'Done', cards: [
      { id: 'c4', title: 'Land Tabs polish', tag: 'ui' },
      { id: 'c5', title: 'Reduce-motion sweep', tag: 'a11y' },
    ],
  },
];

export function KanbanBoard({ columns, onChange, className }: KanbanBoardProps) {
  const [cols, setCols] = React.useState<KanbanColumn[]>(columns ?? demo);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<string | null>(null);

  React.useEffect(() => { if (columns) setCols(columns); }, [columns]);

  const update = (next: KanbanColumn[]) => {
    setCols(next);
    onChange?.(next);
  };

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const onDropCol = (targetCol: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = dragId ?? e.dataTransfer.getData('text/plain');
    if (!id) return;
    let card: KanbanCard | undefined;
    const removed = cols.map((c) => {
      const idx = c.cards.findIndex((k) => k.id === id);
      if (idx >= 0) { card = c.cards[idx]; return { ...c, cards: c.cards.filter((_, i) => i !== idx) }; }
      return c;
    });
    if (!card) return;
    update(removed.map((c) => (c.id === targetCol ? { ...c, cards: [...c.cards, card!] } : c)));
    setDragId(null);
    setOverCol(null);
  };

  const moveByKey = (id: string, dir: -1 | 1) => {
    const colIdx = cols.findIndex((c) => c.cards.some((k) => k.id === id));
    const next = colIdx + dir;
    if (colIdx < 0 || next < 0 || next >= cols.length) return;
    const card = cols[colIdx].cards.find((k) => k.id === id)!;
    update(cols.map((c, i) => {
      if (i === colIdx) return { ...c, cards: c.cards.filter((k) => k.id !== id) };
      if (i === next) return { ...c, cards: [...c.cards, card] };
      return c;
    }));
  };

  return (
    <div className={cn('flex gap-3 overflow-x-auto p-2', className)} aria-label="Kanban board">
      {cols.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
          onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
          onDrop={onDropCol(col.id)}
          className={cn(
            'flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/30',
            overCol === col.id && 'ring-2 ring-ring'
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: col.accent ?? 'var(--accent, #888)' }} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            </div>
            <span className="text-xs text-muted-foreground">{col.cards.length}</span>
          </div>
          <ul className="flex flex-col gap-2 p-2">
            {col.cards.map((card) => (
              <li key={card.id}>
                <button
                  type="button"
                  draggable
                  aria-grabbed={dragId === card.id}
                  onDragStart={onDragStart(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') { e.preventDefault(); moveByKey(card.id, 1); }
                    if (e.key === 'ArrowLeft') { e.preventDefault(); moveByKey(card.id, -1); }
                  }}
                  className={cn(
                    'w-full cursor-grab rounded-md border border-border bg-background p-3 text-left text-sm shadow-sm transition-all duration-150 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing motion-reduce:transition-none',
                    dragId === card.id && 'opacity-50'
                  )}
                >
                  <div className="font-medium text-foreground">{card.title}</div>
                  {card.description && <div className="mt-1 text-xs text-muted-foreground">{card.description}</div>}
                  {card.tag && <div className="mt-2 inline-flex rounded bg-accent/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">{card.tag}</div>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

KanbanBoard.displayName = 'KanbanBoard';
