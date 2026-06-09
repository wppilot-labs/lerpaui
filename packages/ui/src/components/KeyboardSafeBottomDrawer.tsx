"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';
import { X } from 'lucide-react';

export interface KeyboardSafeBottomDrawerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const KeyboardSafeBottomDrawer: React.FC<KeyboardSafeBottomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const dragControls = useDragControls();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Dynamic soft keyboard tracking using visualViewport API
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportChange = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      const offsetHeight = window.innerHeight - vv.height;
      // Filter out small offsets (like browser scrollbar or UI shifts)
      if (offsetHeight > 60) {
        setKeyboardHeight(offsetHeight);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  // Lock scroll on body when open
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

  const handleDragEnd = (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    // If dragged down past a threshold, close the drawer
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 240,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            dragControls={dragControls}
            dragListener={false} // Use header drag handle instead
            onDragEnd={handleDragEnd}
            style={{
              paddingBottom: `calc(1.5rem + ${keyboardHeight}px)`,
            }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 flex max-h-[92vh] flex-col rounded-t-[2.5rem] border-t border-border bg-background shadow-2xl transition-all duration-200 select-none touch-none',
              className
            )}
            {...props}
          >
            {/* Elegant drag handle and header */}
            <div
              className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing pointer-events-auto"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
              
              <div className="flex w-full items-center justify-between px-6 pt-3">
                {title ? (
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={onClose}
                  className="rounded-full bg-muted/60 p-1.5 text-muted-foreground hover:text-foreground active:scale-95 transition-all select-none cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Container (removes touch/drag conflict) */}
            <div className="overflow-y-auto px-6 py-2 touch-pan-y pointer-events-auto flex-1 select-text">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
