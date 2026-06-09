"use client";

import React from 'react';
import { cn } from '../lib/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  tag?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, tag, title, description, align = 'left', actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12',
          align === 'center' && 'text-center md:flex-col md:items-center',
          align === 'right' && 'text-right md:flex-row-reverse',
          className
        )}
        {...props}
      >
        <div className={cn('flex-1 max-w-3xl', align === 'center' && 'mx-auto')}>
          {tag && (
            <span className="inline-block text-sm font-semibold tracking-wider uppercase text-primary mb-2">
              {tag}
            </span>
          )}
          {title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div
            className={cn(
              'flex flex-wrap gap-3 shrink-0',
              align === 'center' && 'justify-center'
            )}
          >
            {actions}
          </div>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
