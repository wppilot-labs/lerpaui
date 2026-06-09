"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Home, Sparkles, Settings, User } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BottomNavigationPillSlideProps {
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const BottomNavigationPillSlide: React.FC<BottomNavigationPillSlideProps> = ({
  onTabChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const prefersReducedMotion = usePrefersReducedMotion();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'user', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn('relative flex items-center justify-between w-full max-w-[340px] px-3 py-2 border border-border bg-card shadow-lg rounded-2xl select-none', className)}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              onTabChange?.(tab.id);
            }}
            className="relative flex flex-col items-center justify-center flex-1 py-1 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none transition-colors"
          >
            {/* Sliding Active Pill */}
            {isActive && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <Icon className={cn('w-4.5 h-4.5 mb-0.5 transition-transform duration-250', isActive ? 'text-primary scale-110 animate-pulse-slow' : 'text-muted-foreground')} />
            <span className={cn('text-[9px] font-extrabold tracking-wide uppercase', isActive ? 'text-primary' : 'text-muted-foreground')}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
