"use client";

import React, { useRef, useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';

export interface ProximityCharacterHighlightProps {
  text: string;
  className?: string;
}

export const ProximityCharacterHighlight: React.FC<ProximityCharacterHighlightProps> = ({
  text = "Lerpa UI streamlines responsive interface creation with premium coordination components.",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const words = text.split(' ');

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative w-full max-w-[340px] p-5 border border-border bg-card/65 backdrop-blur-md rounded-2xl select-none leading-relaxed text-sm text-muted-foreground cursor-default overflow-hidden', className)}
    >
      <div className="flex flex-wrap gap-x-1.5 gap-y-1">
        {words.map((word, wordIdx) => {
          return (
            <span key={wordIdx} className="inline-block relative">
              {word.split('').map((char, charIdx) => {
                return (
                  <CharSpan
                    key={charIdx}
                    char={char}
                    mousePos={mousePos}
                    containerRef={containerRef}
                  />
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const CharSpan: React.FC<{
  char: string;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({ char, mousePos, containerRef }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(999);

  React.useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();
    
    const charX = rect.left - parentRect.left + rect.width / 2;
    const charY = rect.top - parentRect.top + rect.height / 2;

    const dx = mousePos.x - charX;
    const dy = mousePos.y - charY;
    setDistance(Math.sqrt(dx * dx + dy * dy));
  }, [mousePos, containerRef]);

  // Highlight if proximity metrics under 60px
  const highlight = distance < 65;
  const scale = highlight ? Math.max(1, 1.25 - distance / 260) : 1;

  return (
    <motion.span
      ref={ref}
      style={{
        display: 'inline-block',
        color: highlight ? 'oklch(var(--p))' : 'rgba(255,255,255,0.4)',
        fontWeight: highlight ? 900 : 500,
        scale: scale,
        textShadow: highlight ? '0 0 8px rgba(120,119,198,0.4)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      {char}
    </motion.span>
  );
};
