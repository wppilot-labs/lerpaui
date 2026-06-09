import React from 'react';
import { cn } from '../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy, id, ...props }, ref) => {
    const hasError = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';
    const errorId = typeof error === 'string' && id ? `${id}-error` : undefined;
    return (
      <>
        <textarea
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={cn(ariaDescribedBy, errorId) || undefined}
          data-state={hasError ? 'error' : undefined}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors duration-150 ease-out placeholder:text-muted-foreground hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
            hasError &&
              'border-destructive text-destructive placeholder:text-destructive/60 focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {typeof error === 'string' && error.length > 0 && (
          <p id={errorId} className="mt-1 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
