"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Home, Compass, User, Bell } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BottomNavGlowUnderlineProps {
  onTabSelect?: (tabId: string) => void;
  className?: string;
}

export const BottomNavGlowUnderline: React.FC<BottomNavGlowUnderlineProps> = ({
  onTabSelect,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const prefersReducedMotion = usePrefersReducedMotion();

  const tabs = [
    { id: 'home', icon: Home, label: 'Feed' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={cn('relative flex items-center justify-between w-full max-w-[340px] px-3 py-1.5 border border-border bg-card shadow-lg rounded-2xl select-none', className)}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              onTabSelect?.(tab.id);
            }}
            className="relative flex flex-col items-center justify-center flex-1 py-1 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
          >
            <Icon
              className={cn('w-4.5 h-4.5 mb-1 transition-all duration-200', isActive ? 'text-primary scale-110' : 'text-muted-foreground')}
              style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.5))' } : undefined}
            />
            <span className={cn('text-[9px] font-bold uppercase tracking-wider', isActive ? 'text-primary font-extrabold' : 'text-muted-foreground')}>
              {tab.label}
            </span>

            {/* Glowing active underline laser */}
            {isActive && (
              <motion.div
                layoutId="activeUnderline"
                className="absolute bottom-[-6px] left-1/4 right-1/4 h-[2.5px] bg-primary rounded-full"
                style={{ boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.6)' }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
