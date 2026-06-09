"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Cpu, Network, Layers } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LiquidBlobTabBarProps {
  onSelect?: (idx: number) => void;
  className?: string;
}

export const LiquidBlobTabBar: React.FC<LiquidBlobTabBarProps> = ({
  onSelect,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { icon: Sparkles, label: 'Core' },
    { icon: Cpu, label: 'Chips' },
    { icon: Network, label: 'Graph' },
    { icon: Layers, label: 'Stack' },
  ];

  return (
    <div className={cn('relative w-full max-w-[300px] bg-card border border-border rounded-xl shadow-lg p-2 select-none overflow-hidden', className)}>
      {/* SVG filter for organic liquid goo blur */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-goo-tab-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: 'url(#liquid-goo-tab-filter)' }} className="flex justify-between relative w-full">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveTab(idx);
                onSelect?.(idx);
              }}
              className="relative flex-1 py-2.5 flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="liquid-blob-tab-indicator"
                  className="absolute inset-0 bg-primary/20 border-2 border-primary/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon className={cn('w-4.5 h-4.5 transition-colors duration-300', isActive ? 'text-primary scale-110' : 'text-muted-foreground')} />
                <span className={cn('text-[9px] font-black uppercase tracking-wider transition-colors', isActive ? 'text-primary' : 'text-muted-foreground/60')}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
