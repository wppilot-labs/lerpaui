"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Menu, X, Home, Settings, User, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MobileSidebarDrawerNavigationProps {
  onNavSelect?: (id: string) => void;
  className?: string;
}

export const MobileSidebarDrawerNavigation: React.FC<MobileSidebarDrawerNavigationProps> = ({
  onNavSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { id: 'home', label: 'Main Feed', icon: Home },
    { id: 'assistant', label: 'AI Prompt', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={cn('relative select-none', className)}>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setIsOpen(true)}
        className="p-3 border border-border bg-card shadow-sm rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
      >
        <Menu className="w-4.5 h-4.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark glass backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding navigation drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">Lerpa UI SideNav</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg border border-border/40 hover:border-primary/25 cursor-pointer text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {links.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.button
                        key={link.id}
                        type="button"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          onNavSelect?.(link.id);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent hover:border-border/40 hover:bg-secondary/40 text-xs font-semibold text-muted-foreground hover:text-foreground text-left cursor-pointer transition-all w-full"
                      >
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span>{link.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[8px] text-muted-foreground/60 text-center uppercase font-black tracking-widest mt-auto border-t border-border/40 pt-4">
                Version 1.16.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
