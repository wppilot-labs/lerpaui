"use client";

import React from 'react';
import { cn } from '../lib/cn';

/** Accessible role=tree with keyboard navigation, collapse, and selection state. */
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes?: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  className?: string;
}

const demo: TreeNode[] = [
  {
    id: 'root', label: 'workspace', children: [
      {
        id: 'src', label: 'src', children: [
          { id: 'src/index.ts', label: 'index.ts' },
          {
            id: 'src/components', label: 'components', children: [
              { id: 'src/components/Button.tsx', label: 'Button.tsx' },
              { id: 'src/components/Card.tsx', label: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', label: 'package.json' },
      { id: 'README.md', label: 'README.md' },
    ],
  },
];

interface ItemProps {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  selected: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  registerRef: (id: string, el: HTMLLIElement | null) => void;
  onKey: (e: React.KeyboardEvent, node: TreeNode) => void;
}

function TreeItem({ node, depth, expanded, selected, onToggle, onSelect, registerRef, onKey }: ItemProps) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = selected === node.id;
  return (
    <li
      ref={(el) => registerRef(node.id, el)}
      role="treeitem"
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={(e) => onKey(e, node)}
      className="outline-none"
    >
      <div
        role="presentation"
        onClick={() => { onSelect(node.id); if (hasChildren) onToggle(node.id); }}
        style={{ paddingLeft: 8 + depth * 16 }}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors hover:bg-accent/40 motion-reduce:transition-none',
          isSelected && 'bg-accent text-accent-foreground'
        )}
      >
        <span aria-hidden="true" className={cn('inline-block w-3 text-xs text-muted-foreground transition-transform', isOpen && 'rotate-90', !hasChildren && 'opacity-0')}>
          ▸
        </span>
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <ul role="group" className="m-0 list-none p-0">
          {node.children!.map((c) => (
            <TreeItem key={c.id} node={c} depth={depth + 1} expanded={expanded} selected={selected} onToggle={onToggle} onSelect={onSelect} registerRef={registerRef} onKey={onKey} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({ nodes, defaultExpanded = ['root', 'src'], onSelect, className }: TreeViewProps) {
  const list = nodes ?? demo;
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(defaultExpanded));
  const [selected, setSelected] = React.useState<string | null>(null);
  const refs = React.useRef<Map<string, HTMLLIElement>>(new Map());

  const flatten = React.useCallback((items: TreeNode[]): TreeNode[] => {
    const out: TreeNode[] = [];
    const walk = (arr: TreeNode[]) => arr.forEach((n) => { out.push(n); if (n.children && expanded.has(n.id)) walk(n.children); });
    walk(items);
    return out;
  }, [expanded]);

  const onToggle = (id: string) => setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const select = (id: string) => { setSelected(id); onSelect?.(id); };

  const onKey = (e: React.KeyboardEvent, node: TreeNode) => {
    const flat = flatten(list);
    const idx = flat.findIndex((n) => n.id === node.id);
    const focusAt = (i: number) => { const n = flat[i]; if (!n) return; const el = refs.current.get(n.id); el?.focus(); setSelected(n.id); };
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusAt(idx + 1); break;
      case 'ArrowUp': e.preventDefault(); focusAt(idx - 1); break;
      case 'ArrowRight': e.preventDefault(); if (node.children?.length && !expanded.has(node.id)) onToggle(node.id); else focusAt(idx + 1); break;
      case 'ArrowLeft': e.preventDefault(); if (expanded.has(node.id)) onToggle(node.id); else focusAt(idx - 1); break;
      case 'Enter': case ' ': e.preventDefault(); select(node.id); if (node.children?.length) onToggle(node.id); break;
    }
  };

  return (
    <ul role="tree" aria-label="Tree" className={cn('m-0 list-none rounded-lg border border-border bg-card p-1 text-foreground', className)}>
      {list.map((n) => (
        <TreeItem key={n.id} node={n} depth={0} expanded={expanded} selected={selected} onToggle={onToggle} onSelect={select} onKey={onKey}
          registerRef={(id, el) => { if (el) refs.current.set(id, el); else refs.current.delete(id); }} />
      ))}
    </ul>
  );
}

TreeView.displayName = 'TreeView';
