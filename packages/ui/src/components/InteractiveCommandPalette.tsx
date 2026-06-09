"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Search, Command, Terminal, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  shortcut?: string[];
  icon?: React.ReactNode;
  action: () => void;
}

export interface CommandCategory {
  name: string;
  items: CommandItem[];
}

export interface InteractiveCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CommandCategory[];
  placeholder?: string;
  className?: string;
  enableGlobalTrigger?: boolean;
}

export const InteractiveCommandPalette: React.FC<InteractiveCommandPaletteProps> = ({
  isOpen,
  onClose,
  categories,
  placeholder = "Type a command or search...",
  className,
  enableGlobalTrigger = true,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Listen to Cmd/Ctrl + K to toggle open/close if enabled
  useEffect(() => {
    if (!enableGlobalTrigger) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Note: Parent controls state, but this informs developer of standard behavior.
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, enableGlobalTrigger]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Dynamic filter commands
  const filteredList = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return categories;

    return categories
      .map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.title.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term)
        ),
      }))
      .filter(category => category.items.length > 0);
  }, [categories, search]);

  // Flattened items for easy indexing and arrow key movement
  const flatItems = useMemo(() => {
    return filteredList.flatMap(category => category.items);
  }, [filteredList]);

  // Reset selection index if it exceeds list size
  useEffect(() => {
    setSelectedIndex(prev => {
      if (flatItems.length === 0) return 0;
      if (prev >= flatItems.length) return flatItems.length - 1;
      return prev;
    });
  }, [flatItems]);

  // Keyboard navigation within list
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, flatItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flatItems[selectedIndex];
        if (selected) {
          selected.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden mx-4 flex flex-col max-h-[60vh]",
              className
            )}
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 bg-muted/20">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none py-1"
              />
              <span className="text-[10px] text-muted-foreground font-semibold bg-muted border border-border/80 px-2 py-0.5 rounded flex items-center gap-0.5">
                <Command className="h-3 w-3" />
                <span>K</span>
              </span>
            </div>

            {/* List Results */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {flatItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Terminal className="h-8 w-8 mb-2 opacity-40 text-primary" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs opacity-70">Try searching for other terms or commands.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredList.map((category) => {
                    const _prevCategoriesLength = 0;
                    // Find absolute offset index inside flatItems
                    const startIdx = categories
                      .slice(0, categories.findIndex(c => c.name === category.name))
                      .flatMap(c => c.items.filter(item => {
                        const term = search.toLowerCase().trim();
                        if (!term) return true;
                        return item.title.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term);
                      })).length;

                    return (
                      <div key={category.name} className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase py-1">
                          {category.name}
                        </h3>

                        <div className="space-y-0.5">
                          {category.items.map((item, itemIdx) => {
                            const absoluteIndex = startIdx + itemIdx;
                            const isActive = absoluteIndex === selectedIndex;

                            return (
                              <button
                                key={item.id}
                                data-active={isActive}
                                onClick={() => {
                                  item.action();
                                  onClose();
                                }}
                                className={cn(
                                  "w-full text-left flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 group border border-transparent",
                                  isActive
                                    ? "bg-primary/10 border-primary/20 text-foreground"
                                    : "hover:bg-muted/40 text-foreground/80 hover:text-foreground"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "p-1.5 rounded-lg bg-muted text-muted-foreground transition-colors",
                                    isActive && "bg-primary/20 text-primary"
                                  )}>
                                    {item.icon ? item.icon : <Terminal className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    {item.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {item.shortcut && (
                                    <div className="flex gap-0.5">
                                      {item.shortcut.map((key) => (
                                        <kbd
                                          key={key}
                                          className="text-[9px] font-mono bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded border border-border/40"
                                        >
                                          {key}
                                        </kbd>
                                      ))}
                                    </div>
                                  )}
                                  <ArrowRight className={cn(
                                    "h-4.5 w-4.5 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200",
                                    isActive && "opacity-100 translate-x-0 text-primary"
                                  )} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Keyboard Help Footer */}
            <div className="border-t border-border/60 bg-muted/30 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                <span>AI Assist Enabled</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Accessibility hook inlined at the bottom
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
}
