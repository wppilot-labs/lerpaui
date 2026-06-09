"use client";

import React from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface NavigationPillItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'accent' | 'destructive';
}

export interface BottomNavigationPillProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: NavigationPillItem[];
  activeId: string;
  onChange: (id: string) => void;
  floating?: boolean;
}

export const BottomNavigationPill: React.FC<BottomNavigationPillProps> = ({
  items,
  activeId,
  onChange,
  floating = true,
  className,
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div
      className={cn(
        'z-50 flex items-center justify-center p-2 transition-all duration-300',
        floating
          ? 'fixed bottom-6 left-1/2 -translate-x-1/2 w-auto max-w-[95vw] rounded-full border border-border bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/10'
          : 'w-full rounded-2xl border border-border bg-background/50 backdrop-blur-md',
        className
      )}
      {...props}
    >
      <nav className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring select-none cursor-pointer',
                isActive
                  ? 'text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              {/* Highlight sliding background block */}
              {isActive && (
                <motion.span
                  layoutId="activePillBackground"
                  className="absolute inset-0 z-0 rounded-full bg-primary"
                  transition={prefersReducedMotion ? { duration: 0 } : {
                    type: 'spring',
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon & Label Container */}
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={prefersReducedMotion ? undefined : (isActive ? { scale: [1, 1.2, 1] } : { scale: 1 })}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <span className="hidden md:inline-block">{item.label}</span>
              </span>

              {/* Notification Badges */}
              <AnimatePresence>
                {item.badge !== undefined && item.badge !== null && (
                  <motion.span
                    initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className={cn(
                      'absolute -top-1.5 -right-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white border-2 border-background shadow-sm',
                      item.badgeVariant === 'destructive'
                        ? 'bg-destructive'
                        : item.badgeVariant === 'accent'
                        ? 'bg-accent'
                        : 'bg-primary'
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
