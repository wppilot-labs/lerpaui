"use client";

import React, { useState } from 'react';
import { Reorder, AnimatePresence} from "framer-motion";
import { GripVertical, Plus, Trash2, CheckCircle2, Circle, ListOrdered } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ReorderItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ReorderableListContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialItems?: ReorderItem[];
  title?: string;
  subtitle?: string;
}

const defaultItems: ReorderItem[] = [
  { id: 'item1', text: 'Hardcode responsive layout grids for multi-viewport tests', completed: true, priority: 'high' },
  { id: 'item2', text: 'Verify Next.js SSR boundaries and dynamic canvas mounts', completed: false, priority: 'high' },
  { id: 'item3', text: 'Optimize vector path tracers to utilize hardware acceleration', completed: false, priority: 'medium' },
  { id: 'item4', text: 'Audit accessibility parameters and add voice region announcers', completed: false, priority: 'low' },
  { id: 'item5', text: 'Draft comprehensive component developer guides for client teams', completed: false, priority: 'medium' }
];

export const ReorderableListContainer: React.FC<ReorderableListContainerProps> = ({
  initialItems = defaultItems,
  title = "Interactive Asset Checklist",
  subtitle = "Drag the handles to prioritize items, check off completed benchmarks, or append new milestones to this live backlog board.",
  className,
  ...props
}) => {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reorder callback
  const handleReorder = (newOrder: ReorderItem[]) => {
    setItems(newOrder);
  };

  // Toggle completion state
  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Delete item from list
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Add new item to list
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem: ReorderItem = {
      id: `custom-${Date.now()}`,
      text: newText.trim(),
      completed: false,
      priority: newPriority
    };

    setItems(prev => [newItem, ...prev]);
    setNewText("");
  };

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div
      className={cn(
        "w-full bg-background text-foreground py-16 px-4 md:px-8 max-w-xl mx-auto flex flex-col",
        className
      )}
      {...props}
    >
      {/* Header section */}
      <div className="mb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Milestone Manager</span>
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{subtitle}</p>
      </div>

      {/* Add New Item form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Append a milestone task..."
          className="flex-1 bg-muted/60 border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-muted-foreground/80"
        />
        
        <select
          value={newPriority}
          aria-label="Task priority"
          onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="bg-muted/60 border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-3 py-2 text-xs font-bold outline-none text-foreground/80 cursor-pointer"
        >
          <option value="high">High</option>
          <option value="medium">Med</option>
          <option value="low">Low</option>
        </select>

        <button
          type="submit"
          aria-label="Add milestone"
          className="p-3 bg-primary hover:bg-primary/95 rounded-xl text-primary-foreground transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Tasks List */}
      {prefersReducedMotion ? (
        // Standard list without drag/reorder animations when reduced motion is preferred
        <div className="space-y-2 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border bg-card/60 backdrop-blur-sm border-border/50",
                item.completed && "opacity-60 bg-muted/20"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  aria-label="Toggle completion"
                  onClick={() => toggleComplete(item.id)}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>

                <span className={cn(
                  "text-xs font-semibold text-foreground truncate flex-1 leading-snug",
                  item.completed && "line-through text-muted-foreground"
                )}>
                  {item.text}
                </span>

                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                  item.priority === 'high' && "bg-red-500/10 text-red-500",
                  item.priority === 'medium' && "bg-blue-500/10 text-blue-500",
                  item.priority === 'low' && "bg-zinc-500/10 text-zinc-500"
                )}>
                  {item.priority}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                aria-label="Delete list item"
                className="p-1 text-muted-foreground hover:text-red-500 transition-colors ml-3 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // High-Fidelity Drag Reorderable List
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2 mb-6"
        >
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-xl border bg-card/70 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all select-none shadow-sm cursor-grab active:cursor-grabbing",
                  item.completed && "opacity-60 bg-muted/20"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Grip handler */}
                  <div className="text-muted-foreground/60 shrink-0 p-0.5">
                    <GripVertical className="w-4 h-4 cursor-grab" />
                  </div>

                  {/* Completion toggle */}
                  <button
                    type="button"
                    aria-label="Toggle completion"
                    onClick={() => toggleComplete(item.id)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>

                  {/* Text value */}
                  <span className={cn(
                    "text-xs font-semibold text-foreground truncate flex-1 leading-snug",
                    item.completed && "line-through text-muted-foreground"
                  )}>
                    {item.text}
                  </span>

                  {/* Priority indicator */}
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                    item.priority === 'high' && "bg-red-500/10 text-red-500",
                    item.priority === 'medium' && "bg-blue-500/10 text-blue-500",
                    item.priority === 'low' && "bg-zinc-500/10 text-zinc-500"
                  )}>
                    {item.priority}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors ml-3 cursor-pointer shrink-0"
                  aria-label="Delete list item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {items.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-muted/10 mb-6">
          <p className="text-xs font-bold text-muted-foreground">Your checklist is empty!</p>
          <button
            type="button"
            onClick={() => setItems(defaultItems)}
            className="text-xs font-black text-primary mt-2 hover:underline cursor-pointer"
          >
            Reset Default List
          </button>
        </div>
      )}

      {/* Summary Footer bar */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 font-black border-t border-border/40 pt-4">
        <span>TOTAL: {items.length} MILESTONES</span>
        <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">
          {completedCount} OF {items.length} COMPLETE ({items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0}%)
        </span>
      </div>
    </div>
  );
};

// Accessible prefers motion
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
