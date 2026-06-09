"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { MousePointerClick, Copy, Share2, Trash2, Heart } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LongPressMenuProps {
  onSelect?: (action: string) => void;
  className?: string;
}

export const LongPressMenu: React.FC<LongPressMenuProps> = ({
  onSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = [
    { icon: Copy, action: 'copy', label: 'Copy' },
    { icon: Share2, action: 'share', label: 'Share' },
    { icon: Heart, action: 'like', label: 'Like' },
    { icon: Trash2, action: 'delete', label: 'Delete' },
  ];

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    }, 600);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleAction = (action: string) => {
    onSelect?.(action);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[220px] bg-secondary/5 border border-border rounded-2xl flex flex-col items-center justify-center select-none overflow-hidden p-6', className)}>
      <div 
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="px-6 py-3 bg-card border border-border shadow rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer touch-none active:scale-95 transition-all select-none hover:bg-secondary/20"
      >
        <MousePointerClick className="w-5 h-5 text-primary animate-pulse" />
        <span className="text-xs font-extrabold text-foreground">Hold down 1s here</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 z-30 pointer-events-auto cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute z-40 bg-card border border-border rounded-2xl p-3 shadow-2xl flex gap-3 pointer-events-auto"
            >
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.action}
                    type="button"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleAction(item.action)}
                    className="flex flex-col items-center gap-1 bg-transparent border-none outline-none cursor-pointer text-muted-foreground hover:text-primary transition-colors py-1 px-2 hover:bg-secondary/40 rounded-xl"
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
