"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion} from "framer-motion";
import { Bot, Copy, Check, RotateCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AIMessageBubbleResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  agentName?: string;
  avatar?: React.ReactNode;
  speed?: number; // lower = faster (approximate ms per character)
  onComplete?: () => void;
  showActions?: boolean;
  onRegenerate?: () => void;
}

export const AIMessageBubbleResponse: React.FC<AIMessageBubbleResponseProps> = ({
  message,
  agentName = "AI Assistant",
  avatar,
  speed = 10,
  onComplete,
  showActions = true,
  onRegenerate,
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Split into characters for advanced rendering
  const characters = useMemo(() => {
    return Array.from(message);
  }, [message]);

  const [visibleCount, setVisibleCount] = useState(prefersReducedMotion ? characters.length : 0);

  const onCompleteRef = React.useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(characters.length);
      onCompleteRef.current?.();
      return;
    }

    setVisibleCount(0);
    let current = 0;
    const intervalTime = Math.max(1, speed);

    const timer = setInterval(() => {
      current += 1;
      if (current >= characters.length) {
        setVisibleCount(characters.length);
        clearInterval(timer);
        onCompleteRef.current?.();
      } else {
        setVisibleCount(current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [characters, speed, prefersReducedMotion]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-border/90 shadow-sm transition-all duration-300 w-full max-w-3xl",
        className
      )}
      {...props}
    >
      {/* Bot Avatar Icon */}
      <div className="flex-shrink-0">
        {avatar ? (
          avatar
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm shadow-primary/10">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {agentName}
          </span>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
            Model Response
          </span>
        </div>

        {/* Text Container with Character Blur Effects */}
        <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans break-words">
          {prefersReducedMotion ? (
            message
          ) : (
            characters.map((char, index) => {
              const isVisible = index < visibleCount;
              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 4 }}
                  animate={isVisible ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(10px)', y: 4 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier
                  }}
                  className="inline-block"
                  style={{
                    display: char === '\n' ? 'block' : 'inline',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char}
                </motion.span>
              );
            })
          )}
        </div>

        {/* Action Toolbar */}
        {showActions && visibleCount >= characters.length && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 border-t border-border/40 pt-3 mt-1.5 text-muted-foreground"
          >
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="flex items-center gap-1 text-xs hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                title="Regenerate"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Regenerate</span>
              </button>
            )}

            <div className="ml-auto flex items-center gap-1 border-l border-border/50 pl-3">
              <button
                type="button"
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={cn(
                  "p-1 rounded hover:bg-muted hover:text-foreground transition-all",
                  feedback === 'up' && "text-primary bg-primary/10"
                )}
                title="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={cn(
                  "p-1 rounded hover:bg-muted hover:text-foreground transition-all",
                  feedback === 'down' && "text-destructive bg-destructive/10"
                )}
                title="Not helpful"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

