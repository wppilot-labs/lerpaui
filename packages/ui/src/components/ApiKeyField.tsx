'use client';

import React from 'react';
import { Check, Clipboard, Eye, EyeOff, KeyRound } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ApiKeyFieldProps {
  value?: string;
  label?: string;
  revealable?: boolean;
  onCopy?: (value: string) => void;
  className?: string;
}

function maskSecret(value: string): string {
  if (value.length <= 8) return '•'.repeat(Math.max(8, value.length));
  const visibleStart = value.slice(0, Math.min(8, value.length - 4));
  return `${visibleStart}${'•'.repeat(Math.max(8, value.length - visibleStart.length - 4))}${value.slice(-4)}`;
}

export function ApiKeyField({
  value = 'lrp_demo_51d8f2c7a9e4',
  label = 'API key',
  revealable = true,
  onCopy,
  className,
}: ApiKeyFieldProps) {
  const inputId = React.useId();
  const statusId = React.useId();
  const [revealed, setRevealed] = React.useState(false);
  const [copyState, setCopyState] = React.useState<'idle' | 'copied' | 'error'>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setCopyState('copied');
      onCopy?.(value);
      timer.current = setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className={cn('w-full max-w-xl', className)}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex min-w-0 items-stretch rounded-xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring">
        <span className="flex items-center pl-3 text-muted-foreground">
          <KeyRound aria-hidden="true" className="h-4 w-4" />
        </span>
        <input
          id={inputId}
          value={revealed ? value : maskSecret(value)}
          readOnly
          autoComplete="off"
          spellCheck={false}
          aria-describedby={statusId}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-foreground outline-none"
        />
        {revealable ? (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? 'Hide API key' : 'Show API key'}
            aria-pressed={revealed}
            className="border-l border-border px-3 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {revealed ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        ) : null}
        <button
          type="button"
          onClick={copy}
          aria-label="Copy API key"
          className="inline-flex min-w-20 items-center justify-center gap-1.5 rounded-r-xl border-l border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {copyState === 'copied' ? (
            <Check aria-hidden="true" className="h-4 w-4 text-emerald-500" />
          ) : (
            <Clipboard aria-hidden="true" className="h-4 w-4" />
          )}
          {copyState === 'copied' ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p id={statusId} aria-live="polite" className="mt-1.5 text-xs text-muted-foreground">
        {copyState === 'error'
          ? 'Clipboard access failed. Select the key and copy it manually.'
          : 'Keep this key private and rotate it if it is exposed.'}
      </p>
    </div>
  );
}

export default ApiKeyField;
