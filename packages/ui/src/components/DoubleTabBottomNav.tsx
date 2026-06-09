"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Home, Sparkles, Compass, Shield, Bell, Lock } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DoubleTabBottomNavProps {
  onSecondaryAction?: (actionId: string) => void;
  className?: string;
}

export const DoubleTabBottomNav: React.FC<DoubleTabBottomNavProps> = ({
  onSecondaryAction,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showDrawer, setShowDrawer] = useState(false);
  const lastTapRef = React.useRef<{ [key: string]: number }>({});

  const mainTabs = [
    { id: 'home', icon: Home, label: 'Overview' },
    { id: 'ai', icon: Sparkles, label: 'Assisted' },
    { id: 'explore', icon: Compass, label: 'Explore' },
  ];

  const subItems = [
    { id: 'sec-1', label: 'Security Shield', icon: Shield },
    { id: 'sec-2', label: 'Alert Center', icon: Bell },
    { id: 'sec-3', label: 'Vault Access', icon: Lock },
  ];

  const handleTabClick = (tabId: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[tabId] || 0;
    
    setActiveTab(tabId);

    if (now - lastTap < 300) {
      // Double tap detected
      setShowDrawer(!showDrawer);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    } else {
      // Single tap
      setShowDrawer(false);
    }

    lastTapRef.current[tabId] = now;
  };

  return (
    <div className={cn('relative w-full max-w-[340px] select-none flex flex-col items-center bg-card border border-border shadow-xl rounded-2xl overflow-hidden', className)}>
      {/* Contextual elastic sub-drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full bg-secondary/10 border-b border-border/40 overflow-hidden"
          >
            <div className="p-3 grid grid-cols-3 gap-2">
              {subItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSecondaryAction?.(item.id);
                      setShowDrawer(false);
                    }}
                    className="flex flex-col items-center p-2 rounded-lg bg-card border border-border hover:border-primary/40 active:scale-95 transition-all text-muted-foreground hover:text-primary"
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-bold tracking-wider text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary tab icons */}
      <div className="w-full px-4 py-2 flex items-center justify-between">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 hover:text-foreground cursor-pointer focus:outline-none transition-colors"
            >
              <Icon className={cn('w-4.5 h-4.5 mb-0.5', isActive ? 'text-primary scale-110 animate-pulse-slow' : 'text-muted-foreground')} />
              <span className={cn('text-[9px] font-extrabold uppercase tracking-wide', isActive ? 'text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="text-[7px] text-muted-foreground/60 py-1 text-center border-t border-border/20 w-full bg-black/10">
        Double tap active icon for sub options
      </div>
    </div>
  );
};
