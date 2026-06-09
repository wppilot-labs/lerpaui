"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

export interface FocusScopeTarget {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TrueFocusScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  targets: FocusScopeTarget[];
  activeTargetId: string | null;
  onTargetChange: (id: string | null) => void;
  showOverlay?: boolean;
  children: React.ReactNode;
}

export const TrueFocusScope: React.FC<TrueFocusScopeProps> = ({
  targets,
  activeTargetId,
  onTargetChange,
  showOverlay = true,
  children,
  className,
  ...props
}) => {
  const [box, setBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = targets.findIndex((t) => t.id === activeTargetId);
  const activeTarget = activeIndex !== -1 ? targets[activeIndex] : null;

  // Measure active element bounding client rect relative to scope container
  useEffect(() => {
    if (!activeTargetId || !containerRef.current) {
      setBox(null);
      return;
    }

    const updateMeasurements = () => {
      const container = containerRef.current;
      if (!container) return;

      // Find the element with matching data-focus-id
      const targetElement = container.querySelector(`[data-focus-id="${activeTargetId}"]`);
      if (!targetElement) {
        setBox(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      setBox({
        x: targetRect.left - containerRect.left,
        y: targetRect.top - containerRect.top,
        width: targetRect.width,
        height: targetRect.height,
      });
    };

    updateMeasurements();

    // Listen to resize, scroll, and content changes
    window.addEventListener('resize', updateMeasurements);
    window.addEventListener('scroll', updateMeasurements, true);

    const observer = new MutationObserver(updateMeasurements);
    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateMeasurements);
      window.removeEventListener('scroll', updateMeasurements, true);
      observer.disconnect();
    };
  }, [activeTargetId, children]);

  const handleNext = () => {
    if (activeIndex < targets.length - 1) {
      onTargetChange(targets[activeIndex + 1].id);
    } else {
      onTargetChange(null); // Finish
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      onTargetChange(targets[activeIndex - 1].id);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)} {...props}>
      {/* Target child content render */}
      {children}

      <AnimatePresence>
        {activeTarget && box && showOverlay && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            {/* SVG Mask Spotlight Backdrop (blocks interactions outside target) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
              <defs>
                <mask id="spotlight-mask">
                  {/* Fill whole area with white (opaque) */}
                  <rect width="100%" height="100%" fill="white" />
                  {/* Punch out focused rect with black (transparent) */}
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    rx="8"
                    ry="8"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.65)"
                mask="url(#spotlight-mask)"
                onClick={() => onTargetChange(null)}
              />
            </svg>

            {/* Glowing morphing bracket border flying around active target */}
            <motion.div
              initial={{
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
                opacity: 0,
              }}
              animate={{
                x: box.x - 4,
                y: box.y - 4,
                width: box.width + 8,
                height: box.height + 8,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
              className="absolute pointer-events-none rounded-xl border border-primary/95"
              style={{ boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.25)' }}
            >
              {/* Sleek Corner Brackets */}
              <span className="absolute -top-1 -left-1 h-3.5 w-3.5 border-t-2 border-l-2 border-primary rounded-tl" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 border-t-2 border-r-2 border-primary rounded-tr" />
              <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 border-b-2 border-l-2 border-primary rounded-bl" />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 border-b-2 border-r-2 border-primary rounded-br" />
            </motion.div>

            {/* Guided Dialog Panel (flies below or above targeted scope box) */}
            <motion.div
              initial={{
                opacity: 0,
                y: box.y + box.height + 25,
                x: box.x + box.width / 2 - 160,
              }}
              animate={{
                opacity: 1,
                y:
                  activeTarget.position === 'top'
                    ? box.y - 180
                    : box.y + box.height + 16,
                x: Math.max(
                  16,
                  Math.min(
                    (containerRef.current?.getBoundingClientRect().width || 600) - 336,
                    box.x + box.width / 2 - 160
                  )
                ),
              }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
              }}
              className="absolute z-50 pointer-events-auto flex w-80 flex-col rounded-2xl border border-border bg-popover p-4.5 shadow-2xl text-popover-foreground"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Step {activeIndex + 1} of {targets.length}
                </span>
                <button
                  onClick={() => onTargetChange(null)}
                  className="rounded-full hover:bg-muted p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="py-2.5">
                <h4 className="text-sm font-bold tracking-tight text-foreground">
                  {activeTarget.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {activeTarget.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <button
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase text-muted-foreground disabled:opacity-30 disabled:pointer-events-none hover:text-foreground transition-colors cursor-pointer select-none"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer select-none"
                >
                  <span>{activeIndex === targets.length - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
