"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

interface TextPressureProps {
  text: string;
  className?: string;
  minWeight?: number;
  maxWeight?: number;
  minWidth?: number;
  maxWidth?: number;
  radius?: number;
  fontFamily?: string;
}

export const TextPressure: React.FC<TextPressureProps> = ({
  text,
  className,
  minWeight = 100,
  maxWeight = 900,
  minWidth = 50,
  maxWidth = 200,
  radius = 250,
  fontFamily = 'sans-serif',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Initialize char refs array
  const chars = text.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // If mouse pos is null, reset all chars to min values
    if (!mousePos) {
      charRefs.current.forEach((charSpan) => {
        if (!charSpan) return;
        charSpan.style.setProperty('font-variation-settings', `'wght' ${minWeight}, 'wdth' ${minWidth}`);
        charSpan.style.fontWeight = `${minWeight}`;
        charSpan.style.transform = 'scale(1)';
      });
      return;
    }

    charRefs.current.forEach((charSpan) => {
      if (!charSpan) return;

      // Get span bounding rect relative to the parent container
      const containerRect = containerRef.current?.getBoundingClientRect();
      const spanRect = charSpan.getBoundingClientRect();
      if (!containerRect) return;

      const spanX = spanRect.left - containerRect.left + spanRect.width / 2;
      const spanY = spanRect.top - containerRect.top + spanRect.height / 2;

      // Calculate distance
      const dx = mousePos.x - spanX;
      const dy = mousePos.y - spanY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate weight and width based on distance
      const factor = Math.max(0, 1 - distance / radius); // 1 at mouse, 0 at boundary
      const currentWeight = Math.round(minWeight + (maxWeight - minWeight) * factor);
      const currentWidth = Math.round(minWidth + (maxWidth - minWidth) * factor);
      const currentScale = 1 + factor * 0.1; // minor scale boost

      // Apply styles
      charSpan.style.setProperty('font-variation-settings', `'wght' ${currentWeight}, 'wdth' ${currentWidth}`);
      charSpan.style.fontWeight = `${currentWeight}`;
      charSpan.style.transform = `scale(${currentScale})`;
    });
  }, [mousePos, minWeight, maxWeight, minWidth, maxWidth, radius]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex flex-wrap select-none cursor-default py-4',
        className
      )}
      style={{ fontFamily }}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            charRefs.current[index] = el;
          }}
          className="inline-block transition-all duration-150 ease-out origin-center whitespace-pre"
          style={{
            fontVariationSettings: `'wght' ${minWeight}, 'wdth' ${minWidth}`,
            fontWeight: minWeight,
          } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
