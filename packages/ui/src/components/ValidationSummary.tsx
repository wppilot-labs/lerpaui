'use client';

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ValidationSummaryError {
  id: string;
  message: string;
  fieldId?: string;
}

export interface ValidationSummaryProps {
  errors?: ValidationSummaryError[];
  title?: string;
  onNavigate?: (error: ValidationSummaryError) => void;
  className?: string;
}

const DEFAULT_ERRORS: ValidationSummaryError[] = [
  { id: 'email', fieldId: 'email', message: 'Enter a valid email address.' },
  { id: 'team-name', fieldId: 'team-name', message: 'Team name is required.' },
];

export function ValidationSummary({
  errors = DEFAULT_ERRORS,
  title,
  onNavigate,
  className,
}: ValidationSummaryProps) {
  const titleId = React.useId();
  if (errors.length === 0) return null;

  const resolvedTitle =
    title ?? `Fix ${errors.length} ${errors.length === 1 ? 'error' : 'errors'} before continuing`;

  const navigate = (error: ValidationSummaryError) => {
    if (error.fieldId && typeof document !== 'undefined') {
      const field = document.getElementById(error.fieldId);
      field?.focus();
      field?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    onNavigate?.(error);
  };

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      className={cn(
        'w-full max-w-xl rounded-xl border border-destructive/35 bg-destructive/10 p-4 text-foreground',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm font-semibold">
            {resolvedTitle}
          </h2>
          <ul className="mt-2 space-y-1">
            {errors.map((error) => (
              <li key={error.id}>
                <button
                  type="button"
                  onClick={() => navigate(error)}
                  className="group inline-flex min-h-8 items-center gap-1.5 rounded text-left text-sm text-destructive underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {error.message}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ValidationSummary;
