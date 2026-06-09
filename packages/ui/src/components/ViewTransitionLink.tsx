"use client";

import React, { forwardRef, useCallback } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Anchor wrapper that uses View Transitions API with fade fallback. */
export interface ViewTransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'ref'> {
  href: string;
  transitionName?: string;
  /** Optional router push override (e.g. Next.js useRouter). */
  onNavigate?: (href: string) => void;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
};

export const ViewTransitionLink = forwardRef<HTMLAnchorElement, ViewTransitionLinkProps>(
  ({ href, children, className, transitionName = 'page', onNavigate, onClick, ...rest }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        const doc = document as ViewTransitionDocument;
        const navigate = () => {
          if (onNavigate) onNavigate(href);
          else window.location.assign(href);
        };

        if (prefersReducedMotion || !doc.startViewTransition) {
          // fade fallback
          if (!prefersReducedMotion) {
            document.documentElement.animate(
              [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }],
              { duration: 240, easing: 'ease-out' },
            );
          }
          e.preventDefault();
          navigate();
          return;
        }

        e.preventDefault();
        doc.startViewTransition(() => {
          navigate();
        });
      },
      [href, onClick, onNavigate, prefersReducedMotion],
    );

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        style={{ viewTransitionName: transitionName } as React.CSSProperties}
        className={cn(
          'relative inline-flex items-center gap-1 text-[var(--foreground)] underline-offset-4 transition-opacity hover:underline',
          className,
        )}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

ViewTransitionLink.displayName = 'ViewTransitionLink';
