"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { X, Copy, Check, Share2, Mail, Twitter, Linkedin, MessageSquare, Send } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface ShareOption {
  id: string;
  name: string;
  color: string; // e.g. '#0077b5' for linkedin
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface BottomSheetShareDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  title?: string;
  description?: string;
}

export const BottomSheetShareDialog: React.FC<BottomSheetShareDialogProps> = ({
  isOpen,
  onClose,
  shareUrl = "https://lerpaui.com/components/pricing-sheet",
  title = "Share this component",
  description = "Send this custom interactive statement layer to your team members or partners to simplify layout reviews.",
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Escape key close handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Copy to clipboard action
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const defaultShareOptions: ShareOption[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: '#0077b5',
      icon: Linkedin,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      color: '#1da1f2',
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      id: 'slack',
      name: 'Slack',
      color: '#4a154b',
      icon: MessageSquare,
      onClick: () => window.open(`https://slack.com`, '_blank') // slack API target
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: '#25d366',
      icon: Send,
      onClick: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      id: 'email',
      name: 'Email',
      color: '#ea4335',
      icon: Mail,
      onClick: () => window.location.href = `mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center select-none"
          {...props}
        >
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Share Bottom Sheet */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            drag={prefersReducedMotion ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                onClose();
              }
            }}
            className={cn(
              "relative w-full max-w-md bg-card border-t border-border/80 rounded-t-3xl shadow-2xl overflow-hidden z-20 pb-8 focus:outline-none flex flex-col",
              className
            )}
          >
            {/* Grab notched handle at the top */}
            <div className="w-full flex justify-center py-3.5 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header section */}
            <div className="px-6 pb-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-sm tracking-tight text-foreground">{title}</h3>
              </div>
              
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close share sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 py-5 space-y-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>

              {/* Grid of sharing channel buttons */}
              <div className="grid grid-cols-5 gap-4">
                {defaultShareOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        if (opt.onClick) opt.onClick();
                      }}
                      className="flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105"
                    >
                      <div 
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-sm hover:shadow transition-shadow"
                        style={{ backgroundColor: opt.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors block text-center">
                        {opt.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* URL Direct copy field action */}
              <div className="space-y-2">
                <label htmlFor="direct-share-link" className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Direct Share Link</label>
                <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-xl border border-border/60">
                  <input
                    id="direct-share-link"
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-[11px] font-semibold text-foreground/90 outline-none select-all px-2 overflow-ellipsis overflow-hidden whitespace-nowrap"
                  />
                  
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={cn(
                      "py-2 px-3.5 rounded-lg text-[10px] font-black tracking-wide text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0",
                      copied ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/95"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="px-6 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 border border-border/60 hover:bg-muted/40 text-xs font-bold rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

