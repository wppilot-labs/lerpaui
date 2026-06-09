"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Delete, Space } from 'lucide-react';
import { cn } from '../lib/cn';

export interface GlassmorphicVirtualKeyboardProps {
  onType?: (txt: string) => void;
  className?: string;
}

export const GlassmorphicVirtualKeyboard: React.FC<GlassmorphicVirtualKeyboardProps> = ({
  onType,
  className,
}) => {
  const [text, setText] = useState('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPC', 'DEL'],
  ];

  const handleKeyPress = (key: string) => {
    setPressedKey(key);
    let newText = text;
    if (key === 'DEL') {
      newText = text.slice(0, -1);
    } else if (key === 'SPC') {
      newText = text + ' ';
    } else {
      newText = text + key;
    }
    setText(newText);
    onType?.(newText);

    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => setPressedKey(null), 120);
  };

  return (
    <div className={cn('relative w-full max-w-[340px] h-[240px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-between p-3 select-none overflow-hidden', className)}>
      <div className="w-full flex flex-col gap-1">
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center">Interactive Keyboard</span>
        <div className="w-full h-9 bg-card border border-border rounded-xl px-3 flex items-center justify-between overflow-x-auto">
          <span className="text-xs font-semibold text-foreground whitespace-nowrap">{text || 'Type something...'}</span>
          <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((key) => {
              const isDel = key === 'DEL';
              const isSpc = key === 'SPC';
              const isPressed = pressedKey === key;

              return (
                <div key={key} className="relative">
                  {/* Glassmorphic Character Pop Balloon */}
                  <AnimatePresence>
                    {isPressed && !isDel && !isSpc && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -44, scale: 1.2 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="absolute left-1/2 translate-x-[-50%] w-9 h-9 rounded-xl border border-primary/20 bg-card/85 backdrop-blur-md shadow-lg flex items-center justify-center text-xs font-black text-primary z-50 pointer-events-none"
                      >
                        {key}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    aria-label={isDel ? 'Delete' : isSpc ? 'Space' : key}
                    onClick={() => handleKeyPress(key)}
                    className={cn('h-8 flex items-center justify-center rounded-lg border border-border/80 text-[10px] font-black uppercase tracking-wider transition-all',
                      isDel || isSpc ? 'bg-secondary/40 text-muted-foreground px-3' : 'w-7.5 bg-card text-foreground',
                      isPressed ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary/30'
                    )}
                  >
                    {isDel ? <Delete className="w-3.5 h-3.5" /> : isSpc ? <Space className="w-3.5 h-3.5" /> : key}
                  </motion.button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
