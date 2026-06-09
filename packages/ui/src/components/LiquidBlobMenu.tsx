"use client";

import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Circular menu where items emerge as gooey liquid outgrowths on toggle. */
export interface LiquidBlobMenuItem {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
}

export interface LiquidBlobMenuProps {
  items?: LiquidBlobMenuItem[];
  className?: string;
  size?: number;
  radius?: number;
  color?: string;
}

const DEFAULT_ITEMS: LiquidBlobMenuItem[] = [
  { label: '+', icon: '+' },
  { label: '@', icon: '@' },
  { label: '#', icon: '#' },
  { label: '★', icon: '★' },
  { label: '✓', icon: '✓' },
];

export const LiquidBlobMenu: React.FC<LiquidBlobMenuProps> = ({
  items = DEFAULT_ITEMS,
  className,
  size = 64,
  radius = 110,
  color = 'var(--accent)',
}) => {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const filterId = useId().replace(/:/g, '');

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: radius * 2 + size, height: radius * 2 + size }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={`gooey-${filterId}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex items-center justify-center"
        style={{
          width: radius * 2 + size,
          height: radius * 2 + size,
          filter: `url(#gooey-${filterId})`,
        }}
      >
        <AnimatePresence>
          {open &&
            items.map((it, i) => {
              const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
              const tx = Math.cos(angle) * radius;
              const ty = Math.sin(angle) * radius;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => {
                    it.onClick?.();
                    setOpen(false);
                  }}
                  initial={reduced ? { opacity: 1, x: tx, y: ty } : { x: 0, y: 0, opacity: 0.6, scale: 0.4 }}
                  animate={{ x: tx, y: ty, opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 1 } : { x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 16,
                    delay: reduced ? 0 : i * 0.04,
                  }}
                  aria-label={it.label}
                  className="absolute grid place-items-center rounded-full text-white shadow-lg"
                  style={{
                    width: size * 0.78,
                    height: size * 0.78,
                    background: color,
                  }}
                >
                  <span className="text-base font-semibold">{it.icon ?? it.label}</span>
                </motion.button>
              );
            })}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          animate={{ rotate: open && !reduced ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="relative grid place-items-center rounded-full text-white shadow-2xl"
          style={{ width: size, height: size, background: color }}
        >
          <span className="text-2xl font-light leading-none">+</span>
        </motion.button>
      </div>
    </div>
  );
};
