'use client';

import React from 'react';
import { GitCompareArrows, Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

export type ConflictResolution = 'local' | 'remote';

export interface ConflictResolutionItem {
  field: string;
  localValue: string;
  remoteValue: string;
  localLabel?: string;
  remoteLabel?: string;
}

export interface ConflictResolutionPanelProps {
  conflict?: ConflictResolutionItem;
  resolution?: ConflictResolution;
  defaultResolution?: ConflictResolution;
  onResolutionChange?: (resolution: ConflictResolution) => void;
  onApply?: (resolution: ConflictResolution) => void | Promise<void>;
  className?: string;
}

const DEFAULT_CONFLICT: ConflictResolutionItem = {
  field: 'Project description',
  localValue: 'Launch the redesigned workspace this Friday.',
  remoteValue: 'Launch the redesigned workspace after stakeholder review.',
  localLabel: 'This device',
  remoteLabel: 'Cloud version',
};

export function ConflictResolutionPanel({
  conflict = DEFAULT_CONFLICT,
  resolution,
  defaultResolution = 'local',
  onResolutionChange,
  onApply,
  className,
}: ConflictResolutionPanelProps) {
  const controlled = resolution !== undefined;
  const [internalResolution, setInternalResolution] = React.useState(defaultResolution);
  const [applying, setApplying] = React.useState(false);
  const [applyFailed, setApplyFailed] = React.useState(false);
  const current = controlled ? resolution : internalResolution;
  const groupName = React.useId();

  const choose = (next: ConflictResolution) => {
    if (!controlled) setInternalResolution(next);
    setApplyFailed(false);
    onResolutionChange?.(next);
  };

  const apply = async () => {
    if (applying) return;
    setApplying(true);
    setApplyFailed(false);
    try {
      await onApply?.(current);
    } catch {
      setApplyFailed(true);
    } finally {
      setApplying(false);
    }
  };

  return (
    <section
      className={cn(
        'w-full max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-amber-500/15 p-2 text-amber-600 dark:text-amber-400">
          <GitCompareArrows aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">Resolve editing conflict</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose which value to keep for {conflict.field.toLowerCase()}.
          </p>
        </div>
      </div>

      <fieldset className="mt-4 grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Version to keep</legend>
        {(['local', 'remote'] as const).map((option) => {
          const selected = current === option;
          const label =
            option === 'local'
              ? (conflict.localLabel ?? 'This device')
              : (conflict.remoteLabel ?? 'Cloud version');
          const value = option === 'local' ? conflict.localValue : conflict.remoteValue;
          const id = `${groupName}-${option}`;
          return (
            <label
              key={option}
              htmlFor={id}
              className={cn(
                'cursor-pointer rounded-xl border border-border bg-background p-4 transition hover:border-primary/50',
                selected && 'border-primary ring-1 ring-primary'
              )}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <input
                  id={id}
                  type="radio"
                  name={groupName}
                  value={option}
                  checked={selected}
                  onChange={() => choose(option)}
                  aria-label={label}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </span>
              <span className="mt-3 block whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {value}
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={apply}
          disabled={applying}
          aria-busy={applying}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {applying ? (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
            />
          ) : null}
          {applying ? 'Applying…' : 'Apply selected version'}
        </button>
      </div>
      {applyFailed ? (
        <p role="alert" className="mt-2 text-right text-xs text-destructive">
          The selected version could not be applied. Nothing was changed.
        </p>
      ) : null}
    </section>
  );
}

export default ConflictResolutionPanel;
