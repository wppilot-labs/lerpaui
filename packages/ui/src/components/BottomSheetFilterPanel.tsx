"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface FilterPanelState {
  categories: string[];
  priceRange: number;
  inStockOnly: boolean;
  sortBy: string;
}

export interface BottomSheetFilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterPanelState) => void;
  categoriesList?: string[];
  initialFilters?: FilterPanelState;
}

const defaultCategories = ["Components", "Hooks", "Templates", "Visuals", "Canvas Tools"];

const defaultState: FilterPanelState = {
  categories: ["Components"],
  priceRange: 150,
  inStockOnly: false,
  sortBy: "popular"
};

export const BottomSheetFilterPanel: React.FC<BottomSheetFilterPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  categoriesList = defaultCategories,
  initialFilters = defaultState,
  className,
  ...props
}) => {
  const [filters, setFilters] = useState<FilterPanelState>(initialFilters);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Escape key handler to close sheet
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Categories select/deselect logic
  const toggleCategory = (cat: string) => {
    setFilters((prev) => {
      const active = prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: active };
    });
  };

  const handleApply = () => {
    if (onApply) onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      priceRange: 50,
      inStockOnly: false,
      sortBy: "popular"
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center select-none"
          {...props}
        >
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Bottom Sheet */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            drag={prefersReducedMotion ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                onClose();
              }
            }}
            className={cn(
              "relative w-full max-w-md bg-card border-t border-border/80 rounded-t-3xl shadow-2xl overflow-hidden z-20 pb-8 focus:outline-none flex flex-col max-h-[90vh]",
              className
            )}
          >
            {/* Grab notched bar at the top */}
            <div className="w-full flex justify-center py-3.5 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header section */}
            <div className="px-6 pb-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-sm tracking-tight text-foreground">Filter Catalog</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[10px] font-black text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close filters sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="px-6 py-5 overflow-y-auto space-y-6 flex-grow">
              {/* Category selector */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Asset Categories</span>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((cat) => {
                    const isSelected = filters.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          "px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5",
                          isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary stroke-[3]" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="max-license-budget" className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Max License Budget</label>
                  <span className="text-xs font-mono font-bold text-primary">${filters.priceRange}</span>
                </div>
                <input
                  id="max-license-budget"
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-semibold">
                  <span>$20</span>
                  <span>$500+</span>
                </div>
              </div>

              {/* Sort By Toggle */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Sort Criteria</span>
                <div className="grid grid-cols-3 gap-2 bg-muted/40 p-1 rounded-xl">
                  {["popular", "newest", "price"].map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setFilters({ ...filters, sortBy: option })}
                      className={cn(
                        "py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer",
                        filters.sortBy === option
                          ? "bg-card text-foreground shadow-sm font-bold border border-border/20"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border/40 rounded-xl">
                <div>
                  <h4 className="text-xs font-extrabold text-foreground">Verified Assets Only</h4>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">Only display items checked by audit officers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })}
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative cursor-pointer",
                    filters.inStockOnly ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow"
                    animate={{ x: filters.inStockOnly ? 16 : 0 }}
                  />
                </button>
              </div>
            </div>

            {/* Sticky Actions bar */}
            <div className="px-6 pt-4 border-t border-border/40 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-border/60 text-xs font-bold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all cursor-pointer text-center"
              >
                Close Drawer
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3 bg-primary hover:bg-primary/95 text-xs font-black rounded-xl text-primary-foreground transition-all cursor-pointer text-center shadow-md active:scale-[0.98]"
              >
                Apply Criteria
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

