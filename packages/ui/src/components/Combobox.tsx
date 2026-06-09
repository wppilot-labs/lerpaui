"use client";

import React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Selectable options. Defaults to a small sample set so it renders with no props. */
  options?: ComboboxOption[];
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fired with the selected option value (or `''` when cleared). */
  onValueChange?: (value: string) => void;
  /** Controlled input text. Pair with `onInputChange`. */
  inputValue?: string;
  /** Initial input text for uncontrolled usage. */
  defaultInputValue?: string;
  /** Fired with the raw input text on every keystroke. */
  onInputChange?: (text: string) => void;
  /** Input placeholder. */
  placeholder?: string;
  /** Message shown when the filter matches nothing. */
  emptyMessage?: React.ReactNode;
  /** Show a clear (x) button when there is text. Defaults to true. */
  clearable?: boolean;
  disabled?: boolean;
  /** Accessible name when no visible `<label htmlFor>` is wired up. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
  name?: string;
  className?: string;
  contentClassName?: string;
  /**
   * Custom filter. Return true to keep an option for the given query. Defaults
   * to a case-insensitive substring match on the label.
   */
  filter?: (option: ComboboxOption, query: string) => boolean;
}

const DEFAULT_OPTIONS: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
];

const defaultFilter = (option: ComboboxOption, query: string): boolean =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

let comboboxIdCounter = 0;
function useStableId(provided?: string): string {
  const fallback = React.useId?.();
  const ref = React.useRef<string | undefined>(undefined);
  if (provided) return provided;
  if (fallback) return fallback;
  if (!ref.current) ref.current = `lerpa-combobox-${++comboboxIdCounter}`;
  return ref.current;
}

const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options = DEFAULT_OPTIONS,
      value,
      defaultValue,
      onValueChange,
      inputValue,
      defaultInputValue,
      onInputChange,
      placeholder = 'Search…',
      emptyMessage = 'No results found',
      clearable = true,
      disabled = false,
      filter = defaultFilter,
      id,
      name,
      className,
      contentClassName,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref
  ) => {
    const valueControlled = value !== undefined;
    const inputControlled = inputValue !== undefined;

    const labelFor = React.useCallback(
      (v: string | undefined) => options.find((o) => o.value === v)?.label ?? '',
      [options]
    );

    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
    const currentValue = valueControlled ? value : internalValue;

    const [internalInput, setInternalInput] = React.useState<string>(
      defaultInputValue ?? labelFor(defaultValue)
    );
    const currentInput = inputControlled ? (inputValue as string) : internalInput;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const baseId = useStableId(id);
    const listboxId = `${baseId}-listbox`;
    const optionId = (i: number) => `${baseId}-option-${i}`;
    const emptyId = `${baseId}-empty`;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const reduced = usePrefersReducedMotion();

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    const filtered = React.useMemo(() => {
      const q = currentInput;
      if (!q) return options;
      return options.filter((o) => filter(o, q));
    }, [options, currentInput, filter]);

    const firstEnabled = React.useCallback(
      (list: ComboboxOption[], from: number, dir: 1 | -1): number => {
        const n = list.length;
        if (n === 0) return -1;
        let i = from;
        for (let step = 0; step < n; step++) {
          if (i >= 0 && i < n && !list[i].disabled) return i;
          i += dir;
          if (i < 0) i = n - 1;
          if (i >= n) i = 0;
        }
        return -1;
      },
      []
    );

    const openMenu = React.useCallback(() => {
      if (disabled) return;
      setOpen(true);
    }, [disabled]);

    const closeMenu = React.useCallback((returnFocus: boolean) => {
      setOpen(false);
      setActiveIndex(-1);
      if (returnFocus) inputRef.current?.focus();
    }, []);

    const setInputText = React.useCallback(
      (text: string) => {
        if (!inputControlled) setInternalInput(text);
        onInputChange?.(text);
      },
      [inputControlled, onInputChange]
    );

    const commit = React.useCallback(
      (index: number) => {
        const opt = filtered[index];
        if (!opt || opt.disabled) return;
        if (!valueControlled) setInternalValue(opt.value);
        onValueChange?.(opt.value);
        setInputText(opt.label);
        closeMenu(true);
      },
      [filtered, valueControlled, onValueChange, setInputText, closeMenu]
    );

    const clear = React.useCallback(() => {
      if (!valueControlled) setInternalValue(undefined);
      onValueChange?.('');
      setInputText('');
      setActiveIndex(-1);
      inputRef.current?.focus();
      setOpen(true);
    }, [valueControlled, onValueChange, setInputText]);

    // Keep the active option in view.
    React.useEffect(() => {
      if (!open || activeIndex < 0) return;
      const el = document.getElementById(optionId(activeIndex));
      el?.scrollIntoView({ block: 'nearest' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, activeIndex]);

    // Reset / clamp the active index whenever the filtered set changes.
    React.useEffect(() => {
      if (!open) return;
      setActiveIndex((i) => {
        if (filtered.length === 0) return -1;
        if (i < 0 || i >= filtered.length) return -1;
        return filtered[i]?.disabled ? -1 : i;
      });
    }, [filtered, open]);

    // Outside click / focus closes the listbox.
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        if (rootRef.current?.contains(e.target as Node)) return;
        closeMenu(false);
      };
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [open, closeMenu]);

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            openMenu();
            setActiveIndex(firstEnabled(filtered, 0, 1));
          } else {
            setActiveIndex((i) => firstEnabled(filtered, i < 0 ? 0 : Math.min(i + 1, filtered.length - 1), 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) {
            openMenu();
            setActiveIndex(firstEnabled(filtered, filtered.length - 1, -1));
          } else {
            setActiveIndex((i) => firstEnabled(filtered, i <= 0 ? 0 : i - 1, -1));
          }
          break;
        case 'Home':
          if (open) {
            e.preventDefault();
            setActiveIndex(firstEnabled(filtered, 0, 1));
          }
          break;
        case 'End':
          if (open) {
            e.preventDefault();
            setActiveIndex(firstEnabled(filtered, filtered.length - 1, -1));
          }
          break;
        case 'Enter':
          if (open && activeIndex >= 0) {
            e.preventDefault();
            commit(activeIndex);
          }
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            closeMenu(false);
          } else if (currentInput) {
            e.preventDefault();
            clear();
          }
          break;
        case 'Tab':
          if (open) closeMenu(false);
          break;
        default:
          break;
      }
    };

    const onInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
      if (!open) setOpen(true);
    };

    const showClear = clearable && currentInput.length > 0 && !disabled;
    const showEmpty = open && filtered.length === 0;

    return (
      <div
        ref={rootRef}
        className={cn('relative inline-block w-full max-w-xs', className)}
      >
        <div className="relative">
          <input
            ref={setInputRef}
            id={baseId}
            name={name}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            value={currentInput}
            placeholder={placeholder}
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : placeholder)}
            aria-labelledby={ariaLabelledBy}
            onChange={onInputChangeEvent}
            onKeyDown={onInputKeyDown}
            onFocus={() => !disabled && setOpen(true)}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors duration-150 ease-out',
              'placeholder:text-muted-foreground hover:border-input/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              showClear ? 'pr-16' : 'pr-10'
            )}
          />
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onClick={clear}
              className="absolute right-8 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? 'Close suggestions' : 'Open suggestions'}
            aria-expanded={open}
            aria-controls={listboxId}
            disabled={disabled}
            onClick={() => {
              if (open) closeMenu(true);
              else {
                openMenu();
                inputRef.current?.focus();
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none',
                open && 'rotate-180'
              )}
            />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.14, ease: 'easeOut' }}
              className={cn(
                'absolute z-50 mt-1.5 w-full min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
                contentClassName
              )}
            >
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label={ariaLabel ?? placeholder}
                className="max-h-60 overflow-auto p-1"
              >
                {filtered.map((opt, i) => {
                  const isSelected = opt.value === currentValue;
                  const isActive = i === activeIndex;
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled on the controlling combobox <input>; pointer only here.
                    <li
                      key={`${opt.value}-${i}`}
                      id={optionId(i)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled || undefined}
                      // Use pointer-down (not click) so the input does not blur/close before selection.
                      onPointerDown={(e) => {
                        e.preventDefault();
                        commit(i);
                      }}
                      onPointerMove={() => {
                        if (!opt.disabled && activeIndex !== i) setActiveIndex(i);
                      }}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center gap-2 rounded-[5px] py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-100',
                        isActive && !opt.disabled && 'bg-accent text-accent-foreground',
                        opt.disabled && 'pointer-events-none opacity-50',
                        !isActive && !opt.disabled && 'text-foreground'
                      )}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        {isSelected && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </li>
                  );
                })}
                {showEmpty && (
                  <li
                    id={emptyId}
                    role="option"
                    aria-disabled="true"
                    aria-selected={false}
                    className="select-none px-3 py-2 text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Combobox.displayName = 'Combobox';

export { Combobox };
export default Combobox;
