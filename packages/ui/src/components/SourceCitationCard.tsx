"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { ExternalLink, Check, Copy, Globe, FileText, Database, BookOpen } from 'lucide-react';

export type CitationSourceType = 'web' | 'document' | 'database' | 'book';

export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevanceScore?: number; // e.g. 0.95 for 95%
  sourceType?: CitationSourceType;
  index?: number;
}

interface SourceCitationCardProps {
  citation: SourceCitation;
  className?: string;
  glow?: boolean;
}

export const SourceCitationCard: React.FC<SourceCitationCardProps> = ({
  citation,
  className,
  glow = true,
}) => {
  const { id: _id, title, url, snippet, relevanceScore = 0.9, sourceType = 'web', index = 1 } = citation;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const getSourceIcon = (type: CitationSourceType) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'book':
        return <BookOpen className="w-4 h-4" />;
      case 'web':
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-background/50 backdrop-blur-xl p-5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/40',
        glow && 'hover:shadow-primary/5',
        className
      )}
    >
      {/* Background glass shine layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none opacity-40 z-0" />

      {/* Top Meta Details */}
      <div className="relative z-10 flex items-start justify-between gap-4 select-none mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
            {index}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/60 border border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {getSourceIcon(sourceType)}
            <span>{sourceType}</span>
          </div>
        </div>

        {relevanceScore && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              {Math.round(relevanceScore * 100)}% Relevance
            </span>
          </div>
        )}
      </div>

      {/* Citation Title */}
      <div className="relative z-10 mb-2">
        <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary">
          {title}
        </h4>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline hover:text-accent font-semibold transition-colors mt-0.5"
        >
          <span className="truncate max-w-[200px]">{url}</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Snippet snippet quotation box */}
      <div className="relative z-10 flex-grow bg-muted/40 border border-border/40 hover:border-border/80 rounded-xl p-3 text-xs text-muted-foreground leading-relaxed italic select-text select-all my-2">
        &quot;{snippet}&quot;
      </div>

      {/* Bottom Actions Row */}
      <div className="relative z-10 flex items-center justify-between border-t border-border/40 pt-3 mt-2 text-[10px] text-muted-foreground select-none">
        <span className="font-mono tracking-widest uppercase font-semibold text-[9px] opacity-75">
          AI VERIFIED SOURCE
        </span>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-foreground font-semibold uppercase tracking-wider transition-colors active:scale-95 px-2 py-1 rounded bg-muted/50 border border-border/50"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-emerald-500"
              >
                <Check className="w-3 h-3" /> COPIED
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> COPY LINK
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};
export default SourceCitationCard;
