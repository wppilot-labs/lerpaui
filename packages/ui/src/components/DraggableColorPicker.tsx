"use client";

import React, { useRef, useState } from 'react';

import { Palette, Copy, Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DraggableColorPickerProps {
  onColorChange?: (color: string) => void;
  className?: string;
}

export const DraggableColorPicker: React.FC<DraggableColorPickerProps> = ({
  onColorChange,
  className,
}) => {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateColor = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Map position to simple hue value
    const angleRad = Math.atan2(y - rect.height / 2, x - rect.width / 2);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    const rgbColor = `hsl(${Math.round(angleDeg)}, 70%, 55%)`;
    setColor(rgbColor);
    onColorChange?.(rgbColor);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    calculateColor(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      calculateColor(e.clientX, e.clientY);
    }
  };

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-5 bg-card border border-border rounded-2xl shadow-lg select-none w-full max-w-[280px]', className)}>
      <div className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 text-xs font-bold mb-3 animate-pulse">
        <Palette className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Palette Wheel</span>
      </div>

      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-40 h-40 rounded-full border border-border shadow-inner relative flex items-center justify-center cursor-crosshair overflow-hidden touch-none select-none"
        style={{
          background: 'conic-gradient(from 0deg, hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%), hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))',
        }}
      >
        {/* Core color mask circle center */}
        <div className="w-[100px] h-[100px] bg-card rounded-full shadow border border-border/40 pointer-events-none flex flex-col items-center justify-center z-10">
          <div className="w-6 h-6 rounded-full border shadow-sm mb-1" style={{ backgroundColor: color }} />
          <span className="text-[9px] font-black uppercase text-muted-foreground/75 tracking-wider">Tap/Drag</span>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-4 bg-secondary/25 border border-border/40 rounded-xl p-2 pl-3">
        <span className="text-xs font-black uppercase text-foreground tracking-wider font-mono truncate">{color}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy color value"
          className="p-1.5 rounded bg-card border border-border text-foreground hover:bg-secondary/40 active:scale-95 transition-all flex items-center justify-center"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
