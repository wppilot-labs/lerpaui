"use client";

import React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Controlled checked state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Fired with the next boolean checked state on toggle. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Visually + programmatically mark a third "mixed" state. Reflected as
   * `aria-checked="mixed"` and the native `indeterminate` DOM property.
   */
  indeterminate?: boolean;
  /** Optional visible label rendered next to the box and wired up via `htmlFor`. */
  label?: React.ReactNode;
  /** Class applied to the visual box (not the wrapper). */
  className?: string;
  /** Class applied to the outer wrapper when a `label` is present. */
  wrapperClassName?: string;
}

let checkboxIdCounter = 0;
function useCheckboxId(provided?: string): string {
  const fallback = React.useId?.();
  const ref = React.useRef<string | undefined>(undefined);
  if (provided) return provided;
  if (fallback) return fallback;
  if (!ref.current) ref.current = `lerpa-checkbox-${++checkboxIdCounter}`;
  return ref.current;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      wrapperClassName,
      checked,
      defaultChecked,
      onCheckedChange,
      indeterminate = false,
      disabled,
      label,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false);
    const isChecked = isControlled ? checked : internal;
    const resolvedId = useCheckboxId(id);

    // A bare checkbox (no visible `label`, no aria override) still needs an
    // accessible name; fall back to a generic one so it is never unlabeled.
    const hasVisibleLabel = label !== undefined && label !== null;
    const resolvedAriaLabel =
      ariaLabel ?? (hasVisibleLabel || ariaLabelledBy ? undefined : 'Checkbox');

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    // `indeterminate` is a DOM-only property; it has no HTML attribute, so it
    // must be set imperatively whenever it (or the checked value) changes.
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate, isChecked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const next = event.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    const ariaChecked: React.AriaAttributes['aria-checked'] = indeterminate
      ? 'mixed'
      : isChecked;

    const control = (
      <span className="relative inline-flex shrink-0">
        <input
          ref={setRefs}
          id={resolvedId}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-checked={ariaChecked}
          aria-label={resolvedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          data-state={indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
          // Native input drives focus, hit-testing, and form participation; the
          // styled box below is purely presentational (aria-hidden).
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          data-state={indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
          className={cn(
            'pointer-events-none flex h-5 w-5 items-center justify-center rounded-[5px] border border-input bg-background text-current shadow-sm transition-colors duration-150 ease-out',
            'peer-hover:border-primary/60',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            (isChecked || indeterminate) &&
              'border-primary bg-primary text-primary-foreground peer-hover:border-primary',
            'peer-disabled:opacity-50 peer-disabled:peer-hover:border-input',
            className
          )}
        >
          {indeterminate ? (
            <Minus className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <Check
              className={cn(
                'h-3.5 w-3.5 transition-opacity duration-150 ease-out motion-reduce:transition-none',
                isChecked ? 'opacity-100' : 'opacity-0'
              )}
              strokeWidth={3}
            />
          )}
        </span>
      </span>
    );

    if (label === undefined || label === null) {
      return control;
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 text-sm',
          disabled && 'opacity-60',
          wrapperClassName
        )}
      >
        {control}
        <label
          htmlFor={resolvedId}
          className={cn(
            'select-none leading-none text-foreground',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {label}
        </label>
      </span>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
