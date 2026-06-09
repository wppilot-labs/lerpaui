"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Sortable + filterable dashboard data grid with generic row typing. */
export interface ColumnDef<T> {
  key: keyof T & string;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataGridProps<T extends Record<string, unknown>> {
  data?: T[];
  columns?: ColumnDef<T>[];
  pageSize?: number;
  className?: string;
  emptyLabel?: string;
}

type SortDir = 'asc' | 'desc' | null;

const demoColumns: ColumnDef<Record<string, unknown>>[] = [
  { key: 'name', header: 'Name', sortable: true, filterable: true },
  { key: 'role', header: 'Role', sortable: true, filterable: true },
  { key: 'status', header: 'Status', sortable: true, align: 'center' },
  { key: 'revenue', header: 'Revenue', sortable: true, align: 'right' },
];

const demoData: Record<string, unknown>[] = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active', revenue: '$12,400' },
  { name: 'Linus Torvalds', role: 'Architect', status: 'Active', revenue: '$31,200' },
  { name: 'Grace Hopper', role: 'Director', status: 'Away', revenue: '$45,000' },
  { name: 'Alan Turing', role: 'Researcher', status: 'Active', revenue: '$22,800' },
  { name: 'Margaret Hamilton', role: 'Engineer', status: 'Offline', revenue: '$18,300' },
];

export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  className,
  emptyLabel = 'No results',
}: DataGridProps<T>) {
  const cols = (columns ?? (demoColumns as unknown as ColumnDef<T>[])) as ColumnDef<T>[];
  const rows = (data ?? (demoData as unknown as T[])) as T[];
  const [sortKey, setSortKey] = React.useState<keyof T & string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [filter, setFilter] = React.useState('');
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => {
    if (!filter) return rows;
    const q = filter.toLowerCase();
    return rows.filter((r) =>
      cols.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, cols, filter]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

  const toggleSort = (key: keyof T & string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
    setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
  };

  return (
    <div className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <input
          type="search"
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(0); }}
          placeholder="Filter rows..."
          aria-label="Filter rows"
          className="h-9 w-64 max-w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="text-xs text-muted-foreground">{sorted.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="grid">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              {cols.map((c) => {
                const active = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{ width: c.width, textAlign: c.align ?? 'left' }}
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none') : 'none'}
                    className="select-none px-3 py-2 font-medium"
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 rounded text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {c.header}
                        <span aria-hidden="true" className="text-xs opacity-60">
                          {active ? (sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕') : '↕'}
                        </span>
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-3 py-8 text-center text-muted-foreground">{emptyLabel}</td></tr>
            ) : paged.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30">
                {cols.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }} className="px-3 py-2">
                    {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span>Page {page + 1} of {pageCount}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="rounded-md border border-border px-2 py-1 hover:bg-accent disabled:opacity-50">Prev</button>
          <button type="button" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}
            className="rounded-md border border-border px-2 py-1 hover:bg-accent disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}

DataGrid.displayName = 'DataGrid';
