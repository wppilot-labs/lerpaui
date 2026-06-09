"use client";

import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** Options to render. Provide this or `children` of `<SelectItem>`. */
  options?: SelectOption[];
  /** `<SelectItem>` children (alternative to `options`). */
  children?: React.ReactNode;
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Fired with the newly-selected value. */
  onValueChange?: (value: string) => void;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Accessible name for the trigger when no visible `<label htmlFor>` exists. */
  'aria-label'?: string;
  /** id of an external label/description element. */
  'aria-labelledby'?: string;
  id?: string;
  name?: string;
  className?: string;
  contentClassName?: string;
}

interface NormalizedOption {
  value: string;
  label: React.ReactNode;
  disabled: boolean;
  /** Lowercased plain-text label used for typeahead matching. */
  text: string;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

/** Marker component so consumers can declare options as JSX. */
export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}
function SelectItem(_props: SelectItemProps): null {
  return null;
}
SelectItem.displayName = 'SelectItem';

function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (React.isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function normalize(options: SelectOption[] | undefined, children: React.ReactNode): NormalizedOption[] {
  if (options && options.length > 0) {
    return options.map((o) => ({
      value: o.value,
      label: o.label,
      disabled: Boolean(o.disabled),
      text: nodeToText(o.label).toLowerCase(),
    }));
  }
  const collected: NormalizedOption[] = [];
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<SelectItemProps>(child) &&
      (child.type as { displayName?: string }).displayName === 'SelectItem'
    ) {
      const { value, children: label, disabled } = child.props;
      collected.push({
        value,
        label,
        disabled: Boolean(disabled),
        text: nodeToText(label).toLowerCase(),
      });
    }
  });
  if (collected.length > 0) return collected;
  return DEFAULT_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
    disabled: false,
    text: nodeToText(o.label).toLowerCase(),
  }));
}

let selectIdCounter = 0;
function useStableId(provided?: string): string {
  const fallback = React.useId?.();
  const ref = React.useRef<string | undefined>(undefined);
  if (provided) return provided;
  if (fallback) return fallback;
  if (!ref.current) ref.current = `lerpa-select-${++selectIdCounter}`;
  return ref.current;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      children,
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Select an option',
      disabled = false,
      id,
      name,
      className,
      contentClassName,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref
  ) => {
    const items = React.useMemo(() => normalize(options, children), [options, children]);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const baseId = useStableId(id);
    const listboxId = `${baseId}-listbox`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const typeahead = React.useRef<{ query: string; timer: ReturnType<typeof setTimeout> | null }>({
      query: '',
      timer: null,
    });
    const reduced = usePrefersReducedMotion();

    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref]
    );

    const selectedIndex = items.findIndex((o) => o.value === currentValue);
    const selectedOption = selectedIndex >= 0 ? items[selectedIndex] : undefined;

    const firstEnabled = React.useCallback(
      (from: number, dir: 1 | -1): number => {
        const n = items.length;
        if (n === 0) return -1;
        let i = from;
        for (let step = 0; step < n; step++) {
          if (i >= 0 && i < n && !items[i].disabled) return i;
          i += dir;
          if (i < 0) i = n - 1;
          if (i >= n) i = 0;
        }
        return -1;
      },
      [items]
    );

    const openMenu = React.useCallback(
      (focus: 'selected' | 'first' | 'last') => {
        if (disabled) return;
        let target: number;
        if (focus === 'selected' && selectedIndex >= 0 && !items[selectedIndex]?.disabled) {
          target = selectedIndex;
        } else if (focus === 'last') {
          target = firstEnabled(items.length - 1, -1);
        } else {
          target = firstEnabled(0, 1);
        }
        setActiveIndex(target);
        setOpen(true);
      },
      [disabled, selectedIndex, items, firstEnabled]
    );

    const closeMenu = React.useCallback((returnFocus: boolean) => {
      setOpen(false);
      setActiveIndex(-1);
      if (returnFocus) triggerRef.current?.focus();
    }, []);

    const commit = React.useCallback(
      (index: number) => {
        const opt = items[index];
        if (!opt || opt.disabled) return;
        if (!isControlled) setInternalValue(opt.value);
        onValueChange?.(opt.value);
        closeMenu(true);
      },
      [items, isControlled, onValueChange, closeMenu]
    );

    // Move DOM focus to the listbox once it mounts so arrow keys land there.
    React.useEffect(() => {
      if (open) listRef.current?.focus();
    }, [open]);

    // Keep the active option scrolled into view.
    React.useEffect(() => {
      if (!open || activeIndex < 0) return;
      const el = document.getElementById(optionId(activeIndex));
      el?.scrollIntoView({ block: 'nearest' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, activeIndex]);

    // Click / focus outside closes the menu.
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (triggerRef.current?.contains(t) || listRef.current?.contains(t)) return;
        closeMenu(false);
      };
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [open, closeMenu]);

    const runTypeahead = React.useCallback(
      (char: string) => {
        const state = typeahead.current;
        state.query += char.toLowerCase();
        if (state.timer) clearTimeout(state.timer);
        state.timer = setTimeout(() => {
          state.query = '';
        }, 600);
        const q = state.query;
        const start = activeIndex >= 0 ? activeIndex : 0;
        const n = items.length;
        // Search forward from current, wrapping, for first label starting with q.
        for (let k = 1; k <= n; k++) {
          const i = (start + k) % n;
          if (!items[i].disabled && items[i].text.startsWith(q)) {
            if (open) setActiveIndex(i);
            else {
              if (!isControlled) setInternalValue(items[i].value);
              onValueChange?.(items[i].value);
            }
            return;
          }
        }
        // Allow re-matching the current item when the same key is pressed repeatedly.
        if (q.length === 1 && !items[start]?.disabled && items[start]?.text.startsWith(q) && open) {
          setActiveIndex(start);
        }
      },
      [activeIndex, items, open, isControlled, onValueChange]
    );

    const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          openMenu('selected');
          break;
        case 'ArrowUp':
          e.preventDefault();
          openMenu('last');
          break;
        case 'Home':
          e.preventDefault();
          openMenu('first');
          break;
        case 'End':
          e.preventDefault();
          openMenu('last');
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            runTypeahead(e.key);
          }
      }
    };

    const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => firstEnabled(i < 0 ? 0 : Math.min(i + 1, items.length - 1), 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => firstEnabled(i <= 0 ? 0 : i - 1, -1));
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(firstEnabled(0, 1));
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(firstEnabled(items.length - 1, -1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0) commit(activeIndex);
          break;
        case 'Escape':
          e.preventDefault();
          closeMenu(true);
          break;
        case 'Tab':
          // Tab moves focus away — close without trapping, return focus first so
          // the natural tab order continues from the trigger.
          closeMenu(true);
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            runTypeahead(e.key);
          }
      }
    };

    return (
      <div className={cn('relative inline-block w-full max-w-xs', className)}>
        <button
          ref={setTriggerRef}
          type="button"
          id={baseId}
          name={name}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : placeholder)}
          aria-labelledby={ariaLabelledBy}
          onClick={() => (open ? closeMenu(true) : openMenu('selected'))}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors duration-150 ease-out',
            'hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[placeholder=true]:text-muted-foreground'
          )}
          data-placeholder={selectedOption ? undefined : true}
          data-state={open ? 'open' : 'closed'}
        >
          <span className="truncate text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 ease-out motion-reduce:transition-none',
              open && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-label={ariaLabel ?? placeholder}
              aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
              onKeyDown={onListKeyDown}
              initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.14, ease: 'easeOut' }}
              className={cn(
                'absolute z-50 mt-1.5 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none',
                contentClassName
              )}
            >
              {items.map((opt, i) => {
                const isSelected = opt.value === currentValue;
                const isActive = i === activeIndex;
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- listbox-level keyboard handling lives on the parent <ul>; mouse only here.
                  <li
                    key={`${opt.value}-${i}`}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onClick={() => commit(i)}
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
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select, SelectItem };
export default Select;
