"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';

interface ElasticSwiperProps {
  items: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  elasticity?: number; // 0 to 1, default 0.1
}

export const ElasticSwiper: React.FC<ElasticSwiperProps> = ({
  items,
  className,
  slideClassName,
  autoplay = false,
  autoplayInterval = 5000,
  elasticity = 0.15,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // ResizeObserver to safely get container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Motion values
  const x = useMotionValue(0);
  const springX = useSpring(x, {
    stiffness: 280,
    damping: 30,
    mass: 0.8,
  });

  // Keep motion value in sync when changing activeIndex
  useEffect(() => {
    if (width > 0) {
      x.set(-activeIndex * width);
    }
  }, [activeIndex, width, x]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, items.length]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (prefersReducedMotion) return;
    const swipeThreshold = 50;
    const swipeVelocityThreshold = 300;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -swipeThreshold || velocity < -swipeVelocityThreshold) {
      // Swipe Left -> Next
      if (activeIndex < items.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else {
        // Elastic rebound
        x.set(-activeIndex * width);
      }
    } else if (offset > swipeThreshold || velocity > swipeVelocityThreshold) {
      // Swipe Right -> Prev
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else {
        // Elastic rebound
        x.set(0);
      }
    } else {
      // Cancelled swipe, snap back to active
      x.set(-activeIndex * width);
    }
  };

  const goToSlide = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden w-full rounded-2xl bg-muted/10 border border-border p-4 select-none',
        className
      )}
    >
      {/* Swiper Track */}
      <motion.div
        drag={prefersReducedMotion ? false : "x"}
        dragConstraints={prefersReducedMotion ? undefined : {
          left: -((items.length - 1) * width),
          right: 0,
        }}
        dragElastic={prefersReducedMotion ? undefined : elasticity}
        style={{ x: prefersReducedMotion ? undefined : springX }}
        onDragEnd={handleDragEnd}
        className={cn(
          'flex w-full',
          !prefersReducedMotion && 'cursor-grab active:cursor-grabbing'
        )}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: width || '100%',
              flexShrink: 0,
              transform: prefersReducedMotion && idx !== activeIndex ? 'translateX(-100%)' : undefined,
              display: prefersReducedMotion && idx !== activeIndex ? 'none' : undefined,
            }}
            className={cn('px-2 py-4 h-full', slideClassName)}
          >
            {item}
          </div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border text-foreground hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none hover:scale-105 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1))}
            disabled={activeIndex === items.length - 1}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border text-foreground hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none hover:scale-105 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination indicators */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-2 z-20 relative">
          {items.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => goToSlide(idx)}
              className="p-1 focus:outline-none"
            >
              <motion.div
                className={cn(
                  'h-2.5 rounded-full bg-muted-foreground/35 transition-colors duration-250',
                  activeIndex === idx && 'bg-primary'
                )}
                animate={prefersReducedMotion ? undefined : {
                  width: activeIndex === idx ? 24 : 10,
                }}
                transition={prefersReducedMotion ? undefined : { type: 'spring', stiffness: 300, damping: 20 }}
                style={prefersReducedMotion ? { width: activeIndex === idx ? 24 : 10 } : undefined}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
