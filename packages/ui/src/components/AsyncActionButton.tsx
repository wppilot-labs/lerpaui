'use client';

import React from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

export type AsyncActionState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncActionButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  label?: React.ReactNode;
  loadingLabel?: React.ReactNode;
  successLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
  onAction?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
  resetAfterMs?: number;
}

export function AsyncActionButton({
  label = 'Save changes',
  loadingLabel = 'Saving…',
  successLabel = 'Saved',
  errorLabel = 'Try again',
  onAction,
  onError,
  resetAfterMs = 1800,
  className,
  disabled,
  type = 'button',
  ...props
}: AsyncActionButtonProps) {
  const [state, setState] = React.useState<AsyncActionState>('idle');
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const scheduleReset = () => {
    if (resetAfterMs <= 0) return;
    resetTimer.current = setTimeout(() => setState('idle'), resetAfterMs);
  };

  const handleClick = async () => {
    if (state === 'loading') return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setState('loading');
    try {
      await onAction?.();
      setState('success');
      scheduleReset();
    } catch (error) {
      setState('error');
      onError?.(error);
      scheduleReset();
    }
  };

  const content = {
    idle: { icon: null, label },
    loading: {
      icon: (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />
      ),
      label: loadingLabel,
    },
    success: { icon: <Check aria-hidden="true" className="h-4 w-4" />, label: successLabel },
    error: { icon: <AlertCircle aria-hidden="true" className="h-4 w-4" />, label: errorLabel },
  }[state];

  return (
    <button
      type={type}
      disabled={disabled || state === 'loading'}
      aria-busy={state === 'loading'}
      data-state={state}
      onClick={handleClick}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        state === 'success' && 'bg-emerald-600 text-white',
        state === 'error' && 'bg-destructive text-destructive-foreground',
        className
      )}
      {...props}
    >
      {content.icon}
      <span aria-live="polite">{content.label}</span>
    </button>
  );
}

export default AsyncActionButton;
