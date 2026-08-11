'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, MailOpen, Mail } from 'lucide-react';
import { cn } from '../lib/cn';

interface EmailItem {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  read: boolean;
}

export function ElasticSwipeListArchive({ className }: { className?: string }) {
  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: '1',
      sender: 'Vercel Team',
      subject: 'Deployment Successful',
      snippet: 'Your project lerpa-next is now live.',
      read: false,
    },
    {
      id: '2',
      sender: 'Motion updates',
      subject: 'Animation release notes',
      snippet: 'Check out the new layout animations and keyframes.',
      read: true,
    },
    {
      id: '3',
      sender: 'Tailwind Labs',
      subject: 'Tailwind CSS v4.0',
      snippet: 'A multi-layered design token engine built for high speed.',
      read: true,
    },
  ]);

  const archiveEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-xl shadow-2xl space-y-4',
        className
      )}
    >
      <div>
        <h3 className="text-sm font-bold text-foreground">Elastic Swipe List</h3>
        <p className="text-[10px] text-muted-foreground">
          Swipe item left to reveal action shortcuts
        </p>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {emails.map((email) => (
            <div
              key={email.id}
              className="relative rounded-xl overflow-hidden bg-zinc-950/60 border border-border/40"
            >
              {/* Back actions revealed on swipe */}
              <div className="absolute inset-0 flex items-center justify-end px-4 bg-rose-500/20 pointer-events-none">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[9px] uppercase tracking-wider">
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </div>
              </div>

              {/* Sliding List Row */}
              <motion.div
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                dragElastic={{ left: 0.1, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) {
                    archiveEmail(email.id);
                  }
                }}
                className="relative bg-zinc-900/60 border-l-2 border-l-primary p-3 flex gap-3 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="shrink-0 pt-0.5">
                  {email.read ? (
                    <MailOpen className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Mail className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-foreground truncate">
                      {email.sender}
                    </span>
                    <span className="text-[8px] font-mono text-muted-foreground shrink-0">
                      12m ago
                    </span>
                  </div>
                  <h4 className="text-[10px] font-bold text-foreground truncate">
                    {email.subject}
                  </h4>
                  <p className="text-[9px] text-muted-foreground truncate">{email.snippet}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        {emails.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">Inbox is empty</div>
        )}
      </div>
    </div>
  );
}
