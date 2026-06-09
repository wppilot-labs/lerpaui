"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { ArrowUp, Sparkles, Paperclip } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PromptInputProps {
  onSubmit?: (prompt: string) => void;
  placeholders?: string[];
  maxLength?: number;
  className?: string;
}

const defaultPlaceholders = [
  'Generate an interactive pricing section in React...',
  'Build a dashboard layout with real-time Area charts...',
  'Create a high-fidelity SaaS landing hero template...',
  'Formulate accessibilities checklist for custom modals...',
];

export function PromptInput({
  onSubmit,
  placeholders = defaultPlaceholders,
  maxLength = 1000,
  className,
}: PromptInputProps) {
  const [value, setValue] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Rotate placeholders every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [placeholders]);

  // Auto-resize height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    if (onSubmit) onSubmit(value);
    setValue('');
  };

  return (
    <div className={cn('relative w-full max-w-2xl mx-auto rounded-xl border border-border bg-card shadow-lg p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all', className)}>
      <div className="flex items-start gap-3">
        <div className="mt-2 text-primary/80 shrink-0">
          <Sparkles className="h-4.5 w-4.5 animate-pulse" />
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[placeholderIdx]}
          rows={1}
          className="flex-1 w-full bg-transparent resize-none border-0 p-1 text-sm outline-none placeholder:text-muted-foreground focus:ring-0 leading-relaxed min-h-[36px] max-h-[200px]"
        />
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Attach file" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase">
            Context Ready
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn('text-[11px]', value.length > maxLength * 0.9 ? 'text-destructive font-bold' : 'text-muted-foreground/80')}>
            {value.length} / {maxLength}
          </span>
          <Button
            onClick={handleSubmit}
            size="icon"
            aria-label="Send prompt"
            className="h-8 w-8 shrink-0 rounded-lg shadow-sm"
            disabled={!value.trim()}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
