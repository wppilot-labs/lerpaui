"use client";

import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DatepickerProps {
  /** Controlled selected date. Pair with `onChange`. */
  value?: Date | null;
  /** Initial selected date for uncontrolled usage. */
  defaultValue?: Date | null;
  /** Fired with the newly-selected Date. */
  onChange?: (date: Date) => void;
  /** Inclusive lower bound; earlier days are disabled. */
  minDate?: Date;
  /** Inclusive upper bound; later days are disabled. */
  maxDate?: Date;
  /** Predicate to disable arbitrary days. */
  isDateDisabled?: (date: Date) => boolean;
  /** Text shown on the trigger when nothing is selected. */
  placeholder?: string;
  /** First day of week: 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  /** Locale used for label formatting. Defaults to the runtime locale. */
  locale?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
  name?: string;
  className?: string;
  contentClassName?: string;
}

const MS_DAY = 86_400_000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function addDays(d: Date, n: number): Date {
  return startOfDay(new Date(d.getTime() + n * MS_DAY));
}
function addMonths(d: Date, n: number): Date {
  const day = d.getDate();
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return startOfDay(target);
}
function clampToBounds(d: Date, min?: Date, max?: Date): Date {
  if (min && d.getTime() < startOfDay(min).getTime()) return startOfDay(min);
  if (max && d.getTime() > startOfDay(max).getTime()) return startOfDay(max);
  return d;
}

let datepickerIdCounter = 0;
function useStableId(provided?: string): string {
  const fallback = React.useId?.();
  const ref = React.useRef<string | undefined>(undefined);
  if (provided) return provided;
  if (fallback) return fallback;
  if (!ref.current) ref.current = `lerpa-datepicker-${++datepickerIdCounter}`;
  return ref.current;
}

const Datepicker = React.forwardRef<HTMLButtonElement, DatepickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      isDateDisabled,
      placeholder = 'Pick a date',
      weekStartsOn = 0,
      locale,
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
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
    const selected = isControlled ? value ?? null : internal;

    const today = React.useMemo(() => startOfDay(new Date()), []);
    const baseId = useStableId(id);
    const gridLabelId = `${baseId}-grid-label`;

    const [open, setOpen] = React.useState(false);
    // The month currently displayed (always normalized to the 1st).
    const [viewMonth, setViewMonth] = React.useState<Date>(() =>
      startOfDay(new Date((selected ?? today).getFullYear(), (selected ?? today).getMonth(), 1))
    );
    // The day that owns roving tabindex / DOM focus inside the grid.
    const [focusDate, setFocusDate] = React.useState<Date>(() => selected ?? today);

    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const gridRef = React.useRef<HTMLTableElement | null>(null);
    const reduced = usePrefersReducedMotion();
    const shouldFocusGrid = React.useRef(false);

    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref]
    );

    const dayLabelFmt = React.useMemo(
      () =>
        new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      [locale]
    );
    const triggerFmt = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
      [locale]
    );
    const monthTitleFmt = React.useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      [locale]
    );

    // Weekday headers (short + full) derived from a known week.
    const weekdays = React.useMemo(() => {
      const shortFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
      const longFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' });
      // 2023-01-01 is a Sunday — a stable anchor independent of the host TZ.
      const sunday = new Date(2023, 0, 1);
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday.getTime() + ((i + weekStartsOn) % 7) * MS_DAY);
        return { short: shortFmt.format(d), long: longFmt.format(d) };
      });
    }, [locale, weekStartsOn]);

    const isDisabledDay = React.useCallback(
      (d: Date): boolean => {
        if (minDate && d.getTime() < startOfDay(minDate).getTime()) return true;
        if (maxDate && d.getTime() > startOfDay(maxDate).getTime()) return true;
        if (isDateDisabled?.(d)) return true;
        return false;
      },
      [minDate, maxDate, isDateDisabled]
    );

    // Build a 6-row x 7-col grid of dates for the current view month.
    const weeks = React.useMemo(() => {
      const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
      const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
      const gridStart = addDays(firstOfMonth, -offset);
      const rows: Date[][] = [];
      for (let w = 0; w < 6; w++) {
        const row: Date[] = [];
        for (let d = 0; d < 7; d++) {
          row.push(addDays(gridStart, w * 7 + d));
        }
        rows.push(row);
      }
      return rows;
    }, [viewMonth, weekStartsOn]);

    // Keep the displayed month in sync with the focused day.
    React.useEffect(() => {
      if (!isSameMonth(focusDate, viewMonth)) {
        setViewMonth(startOfDay(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1)));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusDate]);

    // After open / focus move, push DOM focus onto the active day cell.
    React.useEffect(() => {
      if (!open || !shouldFocusGrid.current) return;
      const el = gridRef.current?.querySelector<HTMLButtonElement>('[data-focus="true"]');
      el?.focus();
      shouldFocusGrid.current = false;
    });

    // Outside click closes.
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (triggerRef.current?.contains(t) || gridRef.current?.closest('[data-datepicker-popover]')?.contains(t)) {
          return;
        }
        setOpen(false);
      };
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [open]);

    const openCalendar = React.useCallback(() => {
      if (disabled) return;
      const initial = selected ?? today;
      setFocusDate(initial);
      setViewMonth(startOfDay(new Date(initial.getFullYear(), initial.getMonth(), 1)));
      shouldFocusGrid.current = true;
      setOpen(true);
    }, [disabled, selected, today]);

    const closeCalendar = React.useCallback((returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    }, []);

    const moveFocus = React.useCallback(
      (next: Date) => {
        const clamped = clampToBounds(next, minDate, maxDate);
        shouldFocusGrid.current = true;
        setFocusDate(clamped);
      },
      [minDate, maxDate]
    );

    const selectDate = React.useCallback(
      (d: Date) => {
        if (isDisabledDay(d)) return;
        const picked = startOfDay(d);
        if (!isControlled) setInternal(picked);
        onChange?.(picked);
        closeCalendar(true);
      },
      [isDisabledDay, isControlled, onChange, closeCalendar]
    );

    const onGridKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveFocus(addDays(focusDate, -1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFocus(addDays(focusDate, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveFocus(addDays(focusDate, -7));
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(addDays(focusDate, 7));
          break;
        case 'Home':
          e.preventDefault();
          moveFocus(addDays(focusDate, -(((focusDate.getDay() - weekStartsOn) % 7) + 7) % 7));
          break;
        case 'End': {
          e.preventDefault();
          const fromStart = (((focusDate.getDay() - weekStartsOn) % 7) + 7) % 7;
          moveFocus(addDays(focusDate, 6 - fromStart));
          break;
        }
        case 'PageUp':
          e.preventDefault();
          moveFocus(addMonths(focusDate, e.shiftKey ? -12 : -1));
          break;
        case 'PageDown':
          e.preventDefault();
          moveFocus(addMonths(focusDate, e.shiftKey ? 12 : 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectDate(focusDate);
          break;
        case 'Escape':
          e.preventDefault();
          closeCalendar(true);
          break;
        default:
          break;
      }
    };

    const goToMonth = (delta: number) => {
      const next = addMonths(viewMonth, delta);
      setViewMonth(next);
      // Keep focus target inside the new month for a sensible roving anchor.
      const candidate = new Date(next.getFullYear(), next.getMonth(), Math.min(focusDate.getDate(), 28));
      setFocusDate(startOfDay(candidate));
    };

    const triggerLabel = selected ? triggerFmt.format(selected) : placeholder;
    const prevDisabled = (() => {
      if (!minDate) return false;
      const lastPrev = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0);
      return startOfDay(lastPrev).getTime() < startOfDay(minDate).getTime();
    })();
    const nextDisabled = (() => {
      if (!maxDate) return false;
      const firstNext = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
      return startOfDay(firstNext).getTime() > startOfDay(maxDate).getTime();
    })();

    return (
      <div className={cn('relative inline-block', className)}>
        <button
          ref={setTriggerRef}
          type="button"
          id={baseId}
          name={name}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={
            ariaLabel ??
            (ariaLabelledBy
              ? undefined
              : selected
                ? `Change date, selected ${triggerFmt.format(selected)}`
                : placeholder)
          }
          aria-labelledby={ariaLabelledBy}
          onClick={() => (open ? closeCalendar(true) : openCalendar())}
          className={cn(
            'inline-flex h-10 min-w-[12rem] items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors duration-150 ease-out',
            'hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selected && 'text-muted-foreground'
          )}
          data-state={open ? 'open' : 'closed'}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{triggerLabel}</span>
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              data-datepicker-popover=""
              role="dialog"
              aria-modal="false"
              aria-label={ariaLabel ?? 'Choose date'}
              initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.14, ease: 'easeOut' }}
              className={cn(
                'absolute z-50 mt-1.5 w-[18rem] rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md',
                contentClassName
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  disabled={prevDisabled}
                  aria-label="Previous month"
                  onClick={() => goToMonth(-1)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                </button>
                <div
                  id={gridLabelId}
                  aria-live="polite"
                  className="text-sm font-medium text-foreground"
                >
                  {monthTitleFmt.format(viewMonth)}
                </div>
                <button
                  type="button"
                  disabled={nextDisabled}
                  aria-label="Next month"
                  onClick={() => goToMonth(1)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <table
                ref={gridRef}
                role="grid"
                aria-labelledby={gridLabelId}
                onKeyDown={onGridKeyDown}
                className="w-full border-collapse select-none"
              >
                <thead>
                  <tr role="row">
                    {weekdays.map((wd) => (
                      <th
                        key={wd.long}
                        scope="col"
                        abbr={wd.long}
                        className="pb-1 text-center text-xs font-normal text-muted-foreground"
                      >
                        <span aria-hidden="true">{wd.short}</span>
                        <span className="sr-only">{wd.long}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((row, wi) => (
                    <tr role="row" key={`w-${wi}`}>
                      {row.map((day) => {
                        const inMonth = isSameMonth(day, viewMonth);
                        const isSelected = isSameDay(day, selected);
                        const isToday = isSameDay(day, today);
                        const isFocusTarget = isSameDay(day, focusDate);
                        const dayDisabled = isDisabledDay(day);
                        return (
                          <td
                            key={day.toISOString()}
                            role="gridcell"
                            aria-selected={isSelected}
                            className="p-0 text-center"
                          >
                            <button
                              type="button"
                              tabIndex={isFocusTarget ? 0 : -1}
                              data-focus={isFocusTarget ? 'true' : undefined}
                              data-today={isToday ? 'true' : undefined}
                              disabled={dayDisabled}
                              aria-label={dayLabelFmt.format(day)}
                              aria-current={isToday ? 'date' : undefined}
                              onClick={() => selectDate(day)}
                              className={cn(
                                'mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors duration-100',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-popover',
                                'disabled:pointer-events-none disabled:opacity-30',
                                !inMonth && 'text-muted-foreground/50',
                                inMonth && !isSelected && 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                isToday && !isSelected && 'font-semibold text-primary',
                                isSelected &&
                                  'bg-primary font-semibold text-primary-foreground hover:bg-primary/90'
                              )}
                            >
                              {day.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Datepicker.displayName = 'Datepicker';

export { Datepicker };
export default Datepicker;
