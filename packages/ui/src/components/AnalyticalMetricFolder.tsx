"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronDown, Folder, FolderOpen, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SubMetricItem {
  label: string;
  value: string | number;
  change?: number; // percentage
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

export interface AnalyticalMetricFolderProps {
  title: string;
  description?: string;
  primaryStat: string | number;
  change?: number; // e.g. +4.5 or -1.2
  subMetrics?: SubMetricItem[];
  children?: React.ReactNode; // custom charts or elements
  isInitiallyExpanded?: boolean;
  className?: string;
}

export const AnalyticalMetricFolder: React.FC<AnalyticalMetricFolderProps> = ({
  title,
  description,
  primaryStat,
  change = 0,
  subMetrics = [],
  children,
  isInitiallyExpanded = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reset/sync expansion state if prop overrides
  useEffect(() => {
    setIsExpanded(isInitiallyExpanded);
  }, [isInitiallyExpanded]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Status color mapper
  const getStatusColor = (status?: 'success' | 'warning' | 'error' | 'neutral') => {
    switch (status) {
      case 'success': return 'bg-emerald-500 text-emerald-500';
      case 'warning': return 'bg-amber-500 text-amber-500';
      case 'error': return 'bg-destructive text-destructive';
      default: return 'bg-muted-foreground/60 text-muted-foreground';
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        isExpanded && "border-primary/20 bg-card/80",
        className
      )}
      style={isExpanded ? { boxShadow: '0 4px 20px rgba(var(--primary-rgb), 0.05)' } : undefined}
    >
      {/* Clickable Header Accordion Trigger */}
      <button
        type="button"
        onClick={toggleExpand}
        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/15 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3.5">
          {/* Animated Folder Icon */}
          <div className={cn(
            "p-2.5 rounded-xl bg-muted text-muted-foreground transition-all duration-300",
            isExpanded && "bg-primary/10 text-primary scale-110"
          )}>
            {isExpanded ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              {title || 'Metric'}
              {isExpanded && (
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              )}
            </h4>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
            )}
          </div>
        </div>

        {/* Header metrics & expander controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-lg font-extrabold text-foreground tracking-tight">{primaryStat}</p>
            {change !== 0 && (
              <span className={cn(
                "inline-flex items-center gap-0.5 text-[10px] font-bold font-mono",
                change >= 0 ? "text-emerald-500" : "text-destructive"
              )}>
                {change >= 0 ? "+" : ""}{change}%
                <ArrowUpRight className={cn("h-3 w-3", change < 0 && "rotate-90")} />
              </span>
            )}
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
            className="p-1 rounded-lg bg-muted text-muted-foreground border border-border/80"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      {/* Expandable detailed content section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-border/50 bg-muted/10 space-y-5">
              {/* Internal statistics dashboard grid */}
              {subMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {subMetrics.map((sub, idx) => {
                    const statusColor = getStatusColor(sub.status);
                    return (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm flex flex-col gap-1 transition-all duration-300 hover:border-border"
                      >
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none flex items-center gap-1.5">
                          <span className={cn("h-1.5 w-1.5 rounded-full", statusColor.split(' ')[0])} />
                          {sub.label}
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-sm font-black text-foreground">{sub.value}</span>
                          {sub.change !== undefined && (
                            <span className={cn(
                              "text-[9px] font-mono font-bold",
                              sub.change >= 0 ? "text-emerald-500" : "text-destructive"
                            )}>
                              {sub.change >= 0 ? "+" : ""}{sub.change}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Accordion content custom child injection */}
              {children && (
                <div className="rounded-xl overflow-hidden mt-2">
                  {children}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

