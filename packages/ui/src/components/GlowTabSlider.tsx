"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { motion} from "framer-motion";
import { Home, Search, Plus, MessageSquare, Settings } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface GlowTabSliderProps {
  onTabChange?: (idx: number) => void;
  className?: string;
}

export const GlowTabSlider: React.FC<GlowTabSliderProps> = ({
  onTabChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const tabs = useMemo(() => [
    { icon: Home, label: 'Home' },
    { icon: Search, label: 'Search' },
    { icon: Plus, label: 'Post' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: Settings, label: 'Setup' },
  ], []);

  const handleTab = useCallback((idx: number) => {
    setActiveTab(idx);
    onTabChange?.(idx);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  }, [onTabChange]);

  return (
    <div className={cn('relative w-full max-w-[320px] bg-card border border-border rounded-2xl shadow-xl px-2 py-3 select-none', className)} role="tablist">
      <div className="flex items-center justify-between relative z-10">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = idx === activeTab;

          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => handleTab(idx)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 bg-transparent border-none outline-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              {/* Highlight background slider */}
              {isActive && (
                <motion.div
                  layoutId="glow-tab-active-indicator"
                  className="absolute inset-x-2 inset-y-[-2px] bg-primary/10 border-2 border-primary/20 rounded-xl z-[-1] flex items-center justify-center"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ willChange: prefersReducedMotion ? undefined : 'transform' }}
                >
                  <div className="w-[60%] h-[30%] bg-primary blur-md opacity-35" />
                </motion.div>
              )}

              <Icon className={cn('w-5 h-5 transition-transform duration-300', isActive ? 'scale-115 text-primary' : 'scale-100')} />
              <span className={cn('text-[9px] font-extrabold uppercase mt-1 tracking-wider', isActive ? 'text-primary' : 'text-muted-foreground/60')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
