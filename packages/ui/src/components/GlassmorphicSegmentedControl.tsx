"use client";

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface GlassmorphicSegmentedControlProps {
  className?: string;
  /** Tab labels rendered left-to-right. */
  tabs?: string[];
  /** Initial active tab index. */
  defaultIndex?: number;
  /** Called whenever the active tab changes. */
  onChange?: (index: number, label: string) => void;
}

const DEFAULT_TABS = ["Monthly", "Quarterly", "Yearly"];

export const GlassmorphicSegmentedControl: React.FC<GlassmorphicSegmentedControlProps> = ({
  className,
  tabs: tabsProp,
  defaultIndex = 0,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const tabs = useMemo(() => tabsProp ?? DEFAULT_TABS, [tabsProp]);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.children[activeTab] as HTMLElement;
    if (activeEl) {
      setIndicatorWidth(activeEl.offsetWidth);
      setIndicatorLeft(activeEl.offsetLeft);
    }
  }, [activeTab]);

  const handleTab = useCallback((idx: number) => {
    setActiveTab(idx);
    onChange?.(idx, tabs[idx]);
  }, [onChange, tabs]);

  return (
    <div className={cn('p-1.5 border border-border bg-card/75 backdrop-blur-md shadow-md rounded-2xl flex items-center relative overflow-hidden select-none', className)} role="tablist">
      {/* Sliding Glass Background indicator panel */}
      <motion.div
        animate={{ width: indicatorWidth, left: indicatorLeft }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
        className="absolute inset-y-1 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl pointer-events-none"
        style={{ willChange: prefersReducedMotion ? undefined : 'width, left' }}
      />

      <div ref={containerRef} className="flex w-full relative z-10">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTab(idx)}
              className={cn(
                'flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};
