"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SliderPanelItem {
  id: string | number;
  title: string;
  description: string;
  bgClass?: string; // Optional custom background/color class
  content?: React.ReactNode; // Optional custom HTML/JSX content inside the card
}

export interface GSAPScrollTriggerSliderPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SliderPanelItem[];
  scrollMultiplier?: number; // Adjusts how far the user has to scroll vertically to slide panels (e.g. 1 = 100vh per panel)
}

export const GSAPScrollTriggerSliderPanel: React.FC<GSAPScrollTriggerSliderPanelProps> = ({
  items,
  scrollMultiplier = 1,
  className,
  ...props
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Track vertical scroll progress of the overall container
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the horizontal sliding offset
  const panelCount = items.length;
  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(panelCount - 1) * (100 / panelCount)}%`]
  );

  // Determine dynamic height of scroll track based on item length
  const trackHeight = `${panelCount * scrollMultiplier * 100}vh`;

  // Accessibility: fallback to static vertical list if prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-col gap-8 px-6 py-12', className)} {...props}>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex min-h-[300px] flex-col justify-center rounded-3xl p-8 border border-border',
              item.bgClass || 'bg-card text-card-foreground'
            )}
          >
            <h3 className="text-3xl font-bold tracking-tight mb-4">{item.title}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
            {item.content && <div className="mt-6">{item.content}</div>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={targetRef}
      className={cn('relative w-full', className)}
      style={{ height: trackHeight }}
      {...props}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Horizontal translating panel container */}
        <motion.div
          style={{ x: xTranslate, width: `${panelCount * 100}%` }}
          className="flex h-full items-center"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'relative flex h-full w-full flex-col justify-center px-12 md:px-24 py-16 transition-colors duration-200 border-r border-border/10',
                item.bgClass || 'bg-background text-foreground'
              )}
              style={{ width: `${100 / panelCount}%` }}
            >
              {/* Background accent lines */}
              <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-5">
                <div className="border-r border-foreground" />
                <div className="border-r border-foreground" />
                <div className="border-r border-foreground" />
                <div className="border-r border-foreground" />
              </div>

              {/* Slider Card Info */}
              <div className="relative z-10 max-w-4xl">
                <span className="inline-block text-xs font-mono font-bold tracking-widest text-primary uppercase mb-4">
                  0{items.indexOf(item) + 1} / 0{panelCount}
                </span>
                
                <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  {item.title}
                </h3>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
                  {item.description}
                </p>

                {item.content && (
                  <div className="mt-8 transform-gpu transition-all duration-300 hover:scale-[1.01]">
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
