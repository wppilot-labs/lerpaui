'use client';

import React from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DestructiveConfirmationFieldProps {
  confirmationText?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onConfirm?: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function DestructiveConfirmationField({
  confirmationText = 'DELETE',
  value,
  defaultValue = '',
  onValueChange,
  onConfirm,
  title = 'Permanently delete this resource?',
  description = 'This action cannot be undone and may remove related data.',
  confirmLabel = 'Delete permanently',
  disabled = false,
  className,
}: DestructiveConfirmationFieldProps) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const current = controlled ? value : internalValue;
  const inputId = React.useId();
  const hintId = React.useId();
  const matches = current === confirmationText;

  const update = (next: string) => {
    if (!controlled) setInternalValue(next);
    onValueChange?.(next);
    setFailed(false);
  };

  const confirm = async () => {
    if (!matches || disabled || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await onConfirm?.();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className={cn(
        'w-full max-w-xl rounded-2xl border border-destructive/35 bg-destructive/5 p-5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-destructive/10 p-2 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <label htmlFor={inputId} className="mt-4 block text-sm font-medium text-foreground">
        Type <strong className="font-mono text-destructive">{confirmationText}</strong> to confirm
      </label>
      <input
        id={inputId}
        value={current}
        onChange={(event) => update(event.target.value)}
        disabled={disabled || busy}
        aria-describedby={hintId}
        autoComplete="off"
        spellCheck={false}
        className="mt-2 min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      />
      <p id={hintId} aria-live="polite" className="mt-1.5 text-xs text-muted-foreground">
        {failed
          ? 'The action failed. Nothing was deleted; try again.'
          : 'The match is case-sensitive.'}
      </p>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={confirm}
          disabled={!matches || disabled || busy}
          aria-busy={busy}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          )}
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </section>
  );
}

export default DestructiveConfirmationField;
