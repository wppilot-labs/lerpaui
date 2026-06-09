"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface HapticSwipeListRowProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeDelete?: () => void;
  deleteThreshold?: number; // Swipe distance to trigger full delete collapse (e.g. 180)
  hapticDuration?: number; // ms to vibrate (default 15)
  className?: string;
  rowClassName?: string;
  actionWidth?: number; // Width of each action button in pixels (default 75)
}

export const HapticSwipeListRow: React.FC<HapticSwipeListRowProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeDelete,
  deleteThreshold = 180,
  hapticDuration = 15,
  className,
  rowClassName,
  actionWidth = 75,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isOpenState, setIsOpenState] = useState<'left' | 'right' | 'closed'>('closed');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTriggeredVibration = useRef(false);
  
  const leftWidth = leftActions.length * actionWidth;
  const rightWidth = rightActions.length * actionWidth;
  
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.8 });

  // Watch x values to trigger haptic feedback at threshold
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      // Swipe left past delete threshold (for right side delete)
      const isPastLeftThreshold = latest < -deleteThreshold;
      const isPastRightThreshold = latest > deleteThreshold;
      
      const shouldVibrate = (isPastLeftThreshold && onSwipeDelete) || (isPastRightThreshold && onSwipeDelete);
      
      if (shouldVibrate && !dragTriggeredVibration.current) {
        if (typeof window !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(hapticDuration);
          } catch (e) {
            // Ignore security or permission errors
          }
        }
        dragTriggeredVibration.current = true;
      } else if (!isPastLeftThreshold && !isPastRightThreshold) {
        dragTriggeredVibration.current = false;
      }
    });
    
    return () => unsubscribe();
  }, [x, deleteThreshold, hapticDuration, onSwipeDelete]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {
    const currentX = x.get();
    
    // Check for swipe-to-delete threshold first
    if (onSwipeDelete && currentX < -deleteThreshold) {
      triggerDelete();
      return;
    }
    if (onSwipeDelete && currentX > deleteThreshold) {
      triggerDelete();
      return;
    }

    // Snapping logic based on drag direction & offsets
    if (currentX < -30) {
      // Dragged left (reveals right actions)
      if (rightWidth > 0 && Math.abs(currentX) > rightWidth / 2) {
        x.set(-rightWidth);
        setIsOpenState('right');
      } else {
        x.set(0);
        setIsOpenState('closed');
      }
    } else if (currentX > 30) {
      // Dragged right (reveals left actions)
      if (leftWidth > 0 && currentX > leftWidth / 2) {
        x.set(leftWidth);
        setIsOpenState('left');
      } else {
        x.set(0);
        setIsOpenState('closed');
      }
    } else {
      // Snap closed
      x.set(0);
      setIsOpenState('closed');
    }
  };

  const triggerDelete = () => {
    setIsDeleted(true);
    // Animate item sliding completely away
    const slideDirection = x.get() < 0 ? -1000 : 1000;
    x.set(slideDirection);
    
    // Trigger callback after height collapse animation completes
    setTimeout(() => {
      if (onSwipeDelete) {
        onSwipeDelete();
      }
    }, 350);
  };

  const closeRow = () => {
    x.set(0);
    setIsOpenState('closed');
  };

  // Underlay transforms for dynamic visual styling during swipe
  const rightOpacity = useTransform(x, [-rightWidth, 0], [1, 0.4]);
  const leftOpacity = useTransform(x, [0, leftWidth], [0.4, 1]);
  const rightScale = useTransform(x, [-rightWidth - 20, 0], [1.05, 0.9]);
  const leftScale = useTransform(x, [0, leftWidth + 20], [0.9, 1.05]);

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          ref={containerRef}
          className={cn('relative overflow-hidden w-full select-none touch-pan-y', className)}
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ 
            height: 0, 
            opacity: 0,
            transition: { 
              height: { duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.25 }
            }
          }}
        >
          {/* Underlay Trays */}
          <div className="absolute inset-0 w-full h-full flex justify-between select-none pointer-events-auto">
            {/* Left Action Tray (Revealed by swiping right) */}
            <motion.div
              style={{ 
                opacity: leftOpacity, 
                scale: leftScale,
                width: leftWidth 
              }}
              className="flex h-full items-stretch justify-start bg-secondary/10"
            >
              {leftActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id || index}
                    onClick={(e) => {
                      action.onClick(e);
                      closeRow();
                    }}
                    style={{ 
                      width: actionWidth,
                      backgroundColor: action.backgroundColor || 'oklch(var(--s))' 
                    }}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 h-full border-r border-border/20 transition-colors duration-200 active:brightness-95',
                      action.textColor || 'text-foreground',
                      action.className
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5 animate-pulse-slow" />}
                    <span className="text-[10px] font-semibold tracking-wider uppercase">{action.label}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Right Action Tray (Revealed by swiping left) */}
            <motion.div
              style={{ 
                opacity: rightOpacity, 
                scale: rightScale,
                width: rightWidth 
              }}
              className="flex h-full items-stretch justify-end ml-auto bg-secondary/10"
            >
              {rightActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id || index}
                    onClick={(e) => {
                      action.onClick(e);
                      closeRow();
                    }}
                    style={{ 
                      width: actionWidth,
                      backgroundColor: action.backgroundColor || 'oklch(var(--er))' 
                    }}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 h-full border-l border-border/20 transition-colors duration-200 active:brightness-95',
                      action.textColor || 'text-white',
                      action.className
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="text-[10px] font-semibold tracking-wider uppercase">{action.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Foreground Draggable Row Content */}
          <motion.div
            drag="x"
            dragDirectionLock
            dragConstraints={{
              left: -rightWidth - (onSwipeDelete ? 80 : 20),
              right: leftWidth + (onSwipeDelete ? 80 : 20),
            }}
            dragElastic={0.15}
            style={{ x: springX }}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative z-10 w-full bg-card border border-border/60 shadow-sm active:shadow-md cursor-grab active:cursor-grabbing transition-shadow duration-200 py-4 px-5 rounded-xl',
              isOpenState !== 'closed' && 'shadow-inner border-primary/20',
              rowClassName
            )}
          >
            {/* Grab handle indicator for touch screens */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 justify-center items-center opacity-30 group-active:opacity-60 md:hidden pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-foreground" />
              <span className="w-1 h-1 rounded-full bg-foreground" />
              <span className="w-1 h-1 rounded-full bg-foreground" />
            </div>
            
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
