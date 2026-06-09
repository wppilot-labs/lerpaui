"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';

export interface MagneticAnchorDotPointerProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  pointerColor?: string;
  glowColor?: string;
  detectionRadius?: number;
  hideDefaultCursor?: boolean;
}

export const MagneticAnchorDotPointer: React.FC<MagneticAnchorDotPointerProps> = ({
  pointerColor = 'rgb(var(--primary))',
  glowColor = 'rgba(var(--primary), 0.25)',
  detectionRadius = 75,
  hideDefaultCursor = true,
  className,
  ...props
}) => {
  const [_activeAnchor, setActiveAnchor] = useState<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor glide latency
  const springConfig = { damping: 25, stiffness: 280, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Track height and width for expanding outline
  const cursorWidth = useSpring(12, springConfig);
  const cursorHeight = useSpring(12, springConfig);
  const cursorRadius = useSpring(999, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply global CSS to hide user cursor if requested
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      interactiveElements.forEach((el) => {
        (el as HTMLElement).style.cursor = 'none';
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const mx = e.clientX;
      const my = e.clientY;

      // Scan for nearest magnetic elements on the page
      const anchors = document.querySelectorAll('[data-magnetic-anchor="true"]');
      let nearestAnchor: HTMLElement | null = null;
      let minDistance = Infinity;

      anchors.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(mx - centerX, my - centerY);
        if (distance < minDistance) {
          minDistance = distance;
          nearestAnchor = node as HTMLElement;
        }
      });

      if (nearestAnchor && minDistance < detectionRadius) {
        const rect = (nearestAnchor as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Snap to center with a small magnetic drag pull offset
        const pullFactor = 0.45;
        const targetX = centerX + (mx - centerX) * pullFactor;
        const targetY = centerY + (my - centerY) * pullFactor;

        mouseX.set(targetX);
        mouseY.set(targetY);

        setActiveAnchor(rect);
        setIsHovered(true);

        // Stretch the custom cursor to fit the element border
        cursorWidth.set(rect.width + 12);
        cursorHeight.set(rect.height + 12);
        cursorRadius.set(12);
      } else {
        mouseX.set(mx);
        mouseY.set(my);
        setActiveAnchor(null);
        setIsHovered(false);

        // Snap back to regular small cursor circle
        cursorWidth.set(12);
        cursorHeight.set(12);
        cursorRadius.set(999);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (hideDefaultCursor) {
        document.body.style.cursor = '';
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
        interactiveElements.forEach((el) => {
          (el as HTMLElement).style.cursor = '';
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: motion values & cursor dims are stable, only re-bind on radius/cursor config change
  }, [detectionRadius, hideDefaultCursor]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        width: cursorWidth,
        height: cursorHeight,
        borderRadius: cursorRadius,
        borderColor: pointerColor,
        boxShadow: isHovered ? `0 0 20px ${glowColor}` : 'none',
      }}
      className={cn(
        'pointer-events-none fixed left-0 top-0 z-[9999] border-2 bg-transparent transition-colors duration-150',
        isHovered
          ? 'bg-primary/5 border-primary shadow-lg'
          : 'bg-primary border-primary/95',
        className
      )}
      {...props}
    >
      {/* Tiny central core dot */}
      {!isHovered && (
        <span
          style={{ backgroundColor: pointerColor }}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      )}
    </motion.div>
  );
};
