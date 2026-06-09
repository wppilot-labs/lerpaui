"use client";

import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, animate, type MotionValue } from "framer-motion";
import { cn } from '../lib/cn';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PerspectiveRingProps {
  items: React.ReactNode[];
  className?: string;
  radius?: number; // Orbit radius in pixels
  itemWidth?: number; // Width of card
  itemHeight?: number; // Height of card
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const PerspectiveRing: React.FC<PerspectiveRingProps> = ({
  items,
  className,
  radius = 280,
  itemWidth = 200,
  itemHeight = 280,
  autoplay = false,
  autoplayInterval = 4000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rotationAngle = useMotionValue(0);

  // Smooth rotational spring
  const smoothAngle = useSpring(rotationAngle, {
    stiffness: 120,
    damping: 20,
    mass: 1.0,
  });

  const totalItems = items.length;
  const angleStep = 360 / totalItems;

  // Animate the rotation angle to target activeIndex
  useEffect(() => {
    // Calculate target angle to bring active index to the front (angle = 0)
    // To ensure it rotates in the shortest direction, we calculate target
    const targetAngle = -activeIndex * angleStep;
    
    // We animate standard motion value to target
    const controls = animate(rotationAngle, targetAngle, {
      type: 'spring',
      stiffness: 150,
      damping: 22,
      mass: 0.8,
    });
    return () => controls.stop();
  }, [activeIndex, angleStep, rotationAngle]);

  // Autoplay function
  useEffect(() => {
    if (!autoplay || totalItems <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, totalItems]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center min-h-[480px] w-full overflow-hidden select-none',
        className
      )}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Container Ring */}
      <div
        className="relative flex items-center justify-center w-full h-[360px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, idx) => {
          const baseAngle = idx * angleStep;

          return (
            <PerspectiveItem
              key={idx}
              index={idx}
              baseAngle={baseAngle}
              smoothAngle={smoothAngle}
              radius={radius}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              isActive={activeIndex === idx}
              onClick={() => setActiveIndex(idx)}
            >
              {item}
            </PerspectiveItem>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 items-center justify-center mt-6 z-30">
        <button
          type="button"
          aria-label="Previous item"
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-foreground hover:text-primary transition-all hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-mono text-muted-foreground select-none">
          {activeIndex + 1} / {totalItems}
        </span>
        <button
          type="button"
          aria-label="Next item"
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border text-foreground hover:text-primary transition-all hover:scale-105"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface PerspectiveItemProps {
  index: number;
  baseAngle: number;
  smoothAngle: MotionValue<number>;
  radius: number;
  itemWidth: number;
  itemHeight: number;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const PerspectiveItem: React.FC<PerspectiveItemProps> = ({
  baseAngle,
  smoothAngle,
  radius,
  itemWidth,
  itemHeight,
  isActive,
  onClick,
  children,
}) => {
  // We use useTransform to dynamically compute 3D position based on smooth angle
  const style3d = useTransform(smoothAngle, (angle: number) => {
    // Current absolute angle of this item in radians
    const rad = ((baseAngle + angle) * Math.PI) / 180;
    
    // Sin/Cos values for circular coordinates
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    // Compute coordinate components
    const tx = sin * radius;
    const tz = cos * radius;

    // Scale & opacity from depth
    // cos goes from -1 (back of circle) to 1 (front of circle)
    // Normalize depth range: 0 (back) to 1 (front)
    const normalizedDepth = (cos + 1) / 2;

    const scale = 0.75 + normalizedDepth * 0.35; // scales from 0.75 to 1.10
    const opacity = 0.35 + normalizedDepth * 0.65; // opacity from 0.35 to 1.0
    const rotateY = sin * -28; // Rotate slightly towards user
    const zIndex = Math.round(normalizedDepth * 100);

    return {
      x: tx,
      z: tz,
      scale,
      opacity,
      rotateY,
      zIndex,
    };
  });

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      style={{
        position: 'absolute',
        width: itemWidth,
        height: itemHeight,
        transformStyle: 'preserve-3d',
        x: useTransform(style3d, (s) => s.x),
        z: useTransform(style3d, (s) => s.z),
        scale: useTransform(style3d, (s) => s.scale),
        opacity: useTransform(style3d, (s) => s.opacity),
        rotateY: useTransform(style3d, (s) => s.rotateY),
        zIndex: useTransform(style3d, (s) => s.zIndex),
      }}
      className={cn(
        'cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300',
        isActive
          ? 'border-primary shadow-2xl shadow-primary/20 bg-background'
          : 'border-border bg-card hover:border-muted-foreground/30 shadow-md'
      )}
    >
      <div className="w-full h-full relative group">
        {children}
        {/* Subtle hover overlay for inactive items */}
        {!isActive && (
          <div className="absolute inset-0 bg-background/25 hover:bg-transparent transition-colors duration-250 z-10" />
        )}
      </div>
    </motion.div>
  );
};
