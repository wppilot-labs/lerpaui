"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { Plus } from 'lucide-react';

export interface DialItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (id: string) => void;
  colorClass?: string;
}

export interface MobileNavCircleDialProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DialItem[];
  radius?: number;
  arcAngle?: number; // Spread range in degrees (e.g. 90, 180, 270, 360)
  startAngle?: number; // Starting offset angle in degrees (e.g. 0 is pointing right, 180 is pointing left)
  triggerIcon?: React.ComponentType<{ className?: string }>;
  triggerColorClass?: string;
}

export const MobileNavCircleDial: React.FC<MobileNavCircleDialProps> = ({
  items,
  radius = 90,
  arcAngle = 180,
  startAngle = 180,
  triggerIcon: TriggerIcon = Plus,
  triggerColorClass = 'bg-primary text-primary-foreground',
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Close when tapping outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
      {...props}
    >
      {/* Backdrop overlay for focus immersion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Circle Items */}
      <div className="absolute z-50 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {isOpen &&
            items.map((item, idx) => {
              // Calculate angles for spreading
              const totalItems = items.length;
              // Divide spacing based on count
              const angleStep = totalItems > 1 ? arcAngle / (totalItems - 1) : 0;
              const angleDeg = startAngle + idx * angleStep;
              const angleRad = (angleDeg * Math.PI) / 180;

              // Compute X and Y offsets
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x,
                    y,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 18,
                      delay: idx * 0.05,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.15,
                      delay: (totalItems - 1 - idx) * 0.03,
                    },
                  }}
                  aria-label={item.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'absolute pointer-events-auto flex flex-col items-center justify-center h-12 w-12 rounded-full border border-border bg-background shadow-lg hover:scale-110 active:scale-95 transition-transform select-none cursor-pointer group',
                    item.colorClass || 'text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                  
                  {/* Item Label (Tooltip-style, fading in on hover) */}
                  <span className="absolute -bottom-7 scale-0 group-hover:scale-100 bg-foreground text-background text-[10px] font-medium px-2 py-0.5 rounded shadow transition-all duration-200 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Primary Trigger Button */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        animate={{ rotate: isOpen ? 135 : 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'relative z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border shadow-xl select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          triggerColorClass
        )}
      >
        <TriggerIcon className="h-7 w-7" />
      </motion.button>
    </div>
  );
};
