"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** File/folder tree with extension icons, sizes, and keyboard-driven navigation. */
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
  children?: FileNode[];
}

export interface FileTreeBrowserProps {
  nodes?: FileNode[];
  defaultExpanded?: string[];
  onOpen?: (node: FileNode) => void;
  className?: string;
}

const demo: FileNode[] = [
  {
    id: 'root', name: 'project', type: 'folder', children: [
      {
        id: 'src', name: 'src', type: 'folder', children: [
          { id: 'app.tsx', name: 'app.tsx', type: 'file', size: '4.2 KB', modified: '2 min ago' },
          { id: 'main.ts', name: 'main.ts', type: 'file', size: '1.8 KB', modified: '1 hr ago' },
          {
            id: 'styles', name: 'styles', type: 'folder', children: [
              { id: 'globals.css', name: 'globals.css', type: 'file', size: '2.1 KB' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json', type: 'file', size: '1.4 KB' },
      { id: 'tsconfig.json', name: 'tsconfig.json', type: 'file', size: '512 B' },
      { id: 'README.md', name: 'README.md', type: 'file', size: '6.7 KB', modified: 'yesterday' },
    ],
  },
];

function extOf(name: string) { const i = name.lastIndexOf('.'); return i >= 0 ? name.slice(i + 1).toLowerCase() : ''; }

function FileIcon({ name }: { name: string }) {
  const ext = extOf(name);
  const map: Record<string, string> = { ts: '#3178c6', tsx: '#3178c6', js: '#f7df1e', jsx: '#f7df1e', json: '#a5b4fc', css: '#06b6d4', md: '#9ca3af', html: '#ef4444', svg: '#22c55e', png: '#a78bfa' };
  const fill = map[ext] ?? 'var(--muted-foreground, #71717a)';
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" className="shrink-0">
      <path d="M3 1.5h6L13 5v9a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 14V2a.5.5 0 0 1 .5-.5z" fill={fill} opacity="0.9" />
      <path d="M9 1.5V5h4" fill="none" stroke="currentColor" strokeOpacity="0.3" />
    </svg>
  );
}

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" className="shrink-0">
      <path d="M1.5 3.5A.5.5 0 0 1 2 3h4l1.5 1.5H14a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V3.5z" fill={open ? 'var(--accent, #60a5fa)' : '#94a3b8'} opacity="0.85" />
    </svg>
  );
}

interface RowProps { node: FileNode; depth: number; open: Set<string>; selected: string | null; toggle: (id: string) => void; select: (n: FileNode) => void; }

function Row({ node, depth, open, selected, toggle, select }: RowProps) {
  const isFolder = node.type === 'folder';
  const isOpen = open.has(node.id);
  const isSel = selected === node.id;
  return (
    <>
      <li
        role="treeitem"
        aria-expanded={isFolder ? isOpen : undefined}
        aria-selected={isSel}
        tabIndex={isSel ? 0 : -1}
        onClick={() => { select(node); if (isFolder) toggle(node.id); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(node); if (isFolder) toggle(node.id); }
          if (e.key === 'ArrowRight' && isFolder && !isOpen) { e.preventDefault(); toggle(node.id); }
          if (e.key === 'ArrowLeft' && isFolder && isOpen) { e.preventDefault(); toggle(node.id); }
        }}
        style={{ paddingLeft: 8 + depth * 14 }}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm outline-none transition-colors hover:bg-accent/40 motion-reduce:transition-none',
          isSel && 'bg-accent text-accent-foreground'
        )}
      >
        <span aria-hidden="true" className={cn('inline-block w-2 text-xs text-muted-foreground transition-transform', isOpen && 'rotate-90', !isFolder && 'opacity-0')}>▸</span>
        {isFolder ? <FolderIcon open={isOpen} /> : <FileIcon name={node.name} />}
        <span className="flex-1 truncate">{node.name}</span>
        {node.size && <span className="font-mono text-[10px] text-muted-foreground">{node.size}</span>}
        {node.modified && <span className="hidden text-[10px] text-muted-foreground sm:inline">{node.modified}</span>}
      </li>
      {isFolder && isOpen && node.children?.map((c) => (
        <Row key={c.id} node={c} depth={depth + 1} open={open} selected={selected} toggle={toggle} select={select} />
      ))}
    </>
  );
}

export function FileTreeBrowser({ nodes, defaultExpanded = ['root', 'src'], onOpen, className }: FileTreeBrowserProps) {
  const list = nodes ?? demo;
  const [open, setOpen] = React.useState<Set<string>>(new Set(defaultExpanded));
  const [selected, setSelected] = React.useState<string | null>(null);
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const select = (n: FileNode) => { setSelected(n.id); if (n.type === 'file') onOpen?.(n); };

  return (
    <ul role="tree" aria-label="File browser" className={cn('m-0 list-none rounded-lg border border-border bg-card p-1 text-foreground', className)}>
      {list.map((n) => (
        <Row key={n.id} node={n} depth={0} open={open} selected={selected} toggle={toggle} select={select} />
      ))}
    </ul>
  );
}

FileTreeBrowser.displayName = 'FileTreeBrowser';
