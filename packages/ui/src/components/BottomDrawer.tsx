"use client";

import React, { useEffect } from 'react';
import {motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cn } from '../lib/cn';
import { X } from 'lucide-react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    // If swiped down past threshold, trigger onClose
    if (info.offset.y > 140 || info.velocity.y > 600) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
          {/* Blur/translucent backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Draggable bottom sheet drawer card panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 28,
              mass: 0.9,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative w-full max-w-lg bg-background rounded-t-[30px] border-t border-border shadow-2xl z-10 flex flex-col overflow-hidden max-h-[92vh]',
              className
            )}
          >
            {/* Gesture pull handle bar indicator */}
            <div className="flex justify-center py-3.5 cursor-grab active:cursor-grabbing border-b border-border/10 select-none">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/35 group-hover:bg-muted-foreground/60 transition-colors" />
            </div>

            {/* Optional Header */}
            {(title || typeof onClose === 'function') && (
              <div className="px-6 pt-2 pb-4 flex items-center justify-between border-b border-border/30">
                {title ? (
                  <h3 className="text-lg font-bold text-foreground tracking-tight select-none">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable Main Content */}
            <div className="p-6 overflow-y-auto select-text">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default BottomDrawer;
