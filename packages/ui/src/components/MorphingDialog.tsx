"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';

interface MorphingDialogProps {
  className?: string;
  layoutId: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  containerClassName?: string;
}

export const MorphingDialog: React.FC<MorphingDialogProps> = ({
  className,
  layoutId,
  trigger,
  content,
  containerClassName = 'max-w-lg',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Card */}
      <motion.div
        layoutId={`morph-dialog-card-${layoutId}`}
        role="button"
        tabIndex={0}
        aria-label="Open details"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(true); } }}
        className={cn('cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl', className)}
      >
        {trigger}
      </motion.div>

      {/* Expanded Modal Content */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              layoutId={`morph-dialog-card-${layoutId}`}
              className={cn(
                'relative z-10 w-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl',
                containerClassName
              )}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close details dialog"
              >
                ✕
              </button>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                {content}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
