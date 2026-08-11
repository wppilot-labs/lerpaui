'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FilterChipOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterChipGroupProps {
  options?: FilterChipOption[];
  value?: string[];
  defaultValue?: string[];
  multiple?: boolean;
  onValueChange?: (value: string[]) => void;
  label?: string;
  clearLabel?: string;
  className?: string;
}

const DEFAULT_OPTIONS: FilterChipOption[] = [
  { value: 'active', label: 'Active', count: 24 },
  { value: 'trial', label: 'Trial', count: 8 },
  { value: 'paused', label: 'Paused', count: 3 },
];

export function FilterChipGroup({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue = [],
  multiple = true,
  onValueChange,
  label = 'Filters',
  clearLabel = 'Clear filters',
  className,
}: FilterChipGroupProps) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = controlled ? value : internalValue;

  const update = (next: string[]) => {
    if (!controlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const toggle = (option: FilterChipOption) => {
    if (option.disabled) return;
    const active = selected.includes(option.value);
    if (multiple) {
      update(
        active ? selected.filter((item) => item !== option.value) : [...selected, option.value]
      );
    } else {
      update(active ? [] : [option.value]);
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex max-w-full flex-wrap items-center gap-2', className)}
    >
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            disabled={option.disabled}
            onClick={() => toggle(option)}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              active && 'border-primary bg-primary/10 text-primary'
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs tabular-nums">
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
      {selected.length > 0 ? (
        <button
          type="button"
          onClick={() => update([])}
          className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="h-3.5 w-3.5" />
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}

export default FilterChipGroup;
