"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** List items physics-attached to scroll velocity for spring-bounce reveals. */
export interface ScrollLinkedGravityListProps {
  items?: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

interface RowProps {
  index: number;
  total: number;
  velocity: ReturnType<typeof useVelocity>;
  reduced: boolean;
  children: React.ReactNode;
  itemClassName?: string;
}

const Row: React.FC<RowProps> = ({ index, total, velocity, reduced, children, itemClassName }) => {
  const direction = index % 2 === 0 ? 1 : -1;
  const offset = useTransform(velocity, [-2000, 0, 2000], [40 * direction, 0, -40 * direction]);
  const skew = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6]);
  const sx = useSpring(offset, { stiffness: 120, damping: 18, mass: 0.6 });
  const sk = useSpring(skew, { stiffness: 120, damping: 18, mass: 0.6 });

  return (
    <motion.li
      style={
        reduced
          ? undefined
          : {
              x: sx,
              skewY: sk,
              zIndex: total - index,
            }
      }
      className={cn(
        'group relative flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5 text-[var(--foreground)] shadow-sm',
        itemClassName,
      )}
    >
      <span className="text-sm font-medium tracking-wide opacity-60">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex-1 px-4 text-lg">{children}</span>
      <span
        aria-hidden
        className="h-2 w-2 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-150"
      />
    </motion.li>
  );
};

const DEFAULT_ITEMS = [
  'Spring physics on scroll velocity',
  'Items lean into momentum',
  'Bounce-back on settle',
  'Respects reduced-motion',
  'GPU-accelerated transforms',
  'Designed for marketing pages',
];

export const ScrollLinkedGravityList: React.FC<ScrollLinkedGravityListProps> = ({
  items = DEFAULT_ITEMS,
  className,
  itemClassName,
}) => {
  const ref = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  return (
    <ul ref={ref} className={cn('flex flex-col gap-4', className)}>
      {items.map((item, i) => (
        <Row
          key={i}
          index={i}
          total={items.length}
          velocity={velocity}
          reduced={reduced}
          itemClassName={itemClassName}
        >
          {item}
        </Row>
      ))}
    </ul>
  );
};
