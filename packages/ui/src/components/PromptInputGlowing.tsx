"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion} from "framer-motion";
import { Send, Sparkles, CornerDownLeft } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PromptInputGlowingProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onSend?: (value: string) => void;
  glowColorFrom?: string;
  glowColorTo?: string;
  containerClassName?: string;
  showIcon?: boolean;
}

export const PromptInputGlowing: React.FC<PromptInputGlowingProps> = ({
  onSend,
  glowColorFrom = 'var(--primary, #3b82f6)',
  glowColorTo = 'var(--accent, #a855f7)',
  containerClassName,
  className,
  placeholder = "Ask anything...",
  showIcon = true,
  ...props
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend?.(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Border path coordinates
  const borderWidth = 2;
  const path = `M ${borderWidth / 2} ${borderWidth / 2} 
                L ${dimensions.width - borderWidth / 2} ${borderWidth / 2} 
                L ${dimensions.width - borderWidth / 2} ${dimensions.height - borderWidth / 2} 
                L ${borderWidth / 2} ${dimensions.height - borderWidth / 2} 
                Z`;

  const perimeter = (dimensions.width + dimensions.height) * 2;
  const animationDuration = prefersReducedMotion ? 0 : isFocused ? 2.5 : 5;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-xl border border-border bg-card/60 backdrop-blur-xl transition-all duration-300",
        !isFocused && "shadow-sm",
        containerClassName
      )}
      style={isFocused ? { boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.2)' } : undefined}
    >
      {/* Dynamic Glow SVG Neon Path */}
      {dimensions.width > 0 && dimensions.height > 0 && !prefersReducedMotion && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full rounded-xl overflow-hidden"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main neon trail */}
          <motion.path
            d={path}
            stroke="url(#prompt-glow-grad)"
            strokeWidth={borderWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: [-perimeter, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: animationDuration,
              ease: "linear",
            }}
            style={{
              strokeDasharray: `${perimeter * 0.2} ${perimeter * 0.8}`,
            }}
          />

          {/* Underlay glow path on focus */}
          {isFocused && (
            <motion.path
              d={path}
              stroke={glowColorFrom}
              strokeWidth={borderWidth + 2}
              strokeLinecap="round"
              className="opacity-40 blur-[3px]"
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset: [-perimeter, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: animationDuration,
                ease: "linear",
              }}
              style={{
                strokeDasharray: `${perimeter * 0.3} ${perimeter * 0.7}`,
              }}
            />
          )}

          <defs>
            <linearGradient id="prompt-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={glowColorFrom} />
              <stop offset="50%" stopColor={glowColorTo} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Input container */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start gap-2.5">
          {showIcon && (
            <div className={cn(
              "mt-2 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-300",
              isFocused && "bg-primary/10 text-primary scale-110"
            )}>
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "flex-1 resize-none bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground min-h-[40px] max-h-[200px] leading-relaxed",
              className
            )}
            {...props}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border/40 pt-2.5 mt-1">
          <div className="flex gap-2">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <CornerDownLeft className="h-3 w-3" /> Press Enter to send
            </span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white transition-all duration-200",
              value.trim()
                ? "bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <span>Send</span>
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Accessibility hook inlined at the bottom
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
