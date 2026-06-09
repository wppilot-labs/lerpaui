"use client";

import React from 'react';
import { Button } from './Button';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  secondaryActionLabel?: string;
  onSecondaryActionClick?: () => void;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      actionLabel,
      onActionClick,
      secondaryActionLabel,
      onSecondaryActionClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-card/50 max-w-lg mx-auto my-6',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 shrink-0">
            {icon}
          </div>
        )}
        {title && <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>}
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
          {description}
        </p>
        {(actionLabel || secondaryActionLabel) && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {secondaryActionLabel && onSecondaryActionClick && (
              <Button variant="outline" size="sm" onClick={onSecondaryActionClick}>
                {secondaryActionLabel}
              </Button>
            )}
            {actionLabel && onActionClick && (
              <Button size="sm" onClick={onActionClick}>
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
