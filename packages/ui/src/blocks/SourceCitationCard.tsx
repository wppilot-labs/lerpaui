"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/Card';
import { Link as LinkIcon, ExternalLink, Bookmark, Check } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  /** Match strength 0..1. */
  relevanceScore?: number;
  index?: number;
}

export interface SourceCitationCardProps {
  citation: SourceCitation;
  className?: string;
  /** Disable Framer Motion entry. */
  noMotion?: boolean;
  /** Callback when the copy-link control is used. */
  onCopy?: (url: string) => void;
}

export function SourceCitationCard({
  citation,
  className,
  noMotion = false,
  onCopy,
}: SourceCitationCardProps) {
  const { title, url, snippet, relevanceScore, index = 1 } = citation;
  const { copied, copy } = useCopyToClipboard();
  const reduced = usePrefersReducedMotion();
  const useMotion = !noMotion && !reduced;

  const displayUrl = React.useMemo(() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }, [url]);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = await copy(url);
    if (ok && onCopy) onCopy(url);
  };

  return (
    <motion.div
      initial={useMotion ? { opacity: 0, y: 10 } : false}
      whileInView={useMotion ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className={cn('overflow-hidden border border-border bg-card hover:bg-muted/10 hover:border-border/80 transition-colors h-full', className)}>
        <CardContent className="p-4 flex flex-col justify-between gap-3 h-full">
          {/* Source citation header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="flex items-center justify-center h-5 w-5 rounded bg-primary/10 text-primary font-bold text-xs shrink-0"
                aria-label={`Citation ${index}`}
              >
                {index}
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">{title}</h4>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 focus-visible:outline-none focus-visible:underline"
                >
                  <LinkIcon className="h-3 w-3 shrink-0" aria-hidden />
                  <span className="truncate max-w-[180px]">{displayUrl}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" aria-hidden />
                </a>
              </div>
            </div>

            {typeof relevanceScore === 'number' && (
              <span
                className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0"
                aria-label={`Relevance ${Math.round(relevanceScore * 100)} percent`}
              >
                {Math.round(relevanceScore * 100)}% Match
              </span>
            )}
          </div>

          {/* Snippet text */}
          <blockquote className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-muted/30 p-2.5 rounded border border-border/50 select-text">
            &quot;{snippet}&quot;
          </blockquote>

          {/* Citation actions */}
          <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground border-t border-border/40 pt-2">
            <span className="font-semibold uppercase tracking-wider">Source citation</span>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
              className="flex items-center gap-1 hover:text-foreground transition-colors font-bold uppercase focus-visible:outline-none focus-visible:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" aria-hidden /> Copied Link
                </>
              ) : (
                <>
                  <Bookmark className="h-3 w-3" aria-hidden /> Copy Link
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
