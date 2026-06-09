"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Twitter, Mail, MessageCircle, Check, Share2 } from "lucide-react";
import { cn } from "../lib/cn";

interface WishItem {
  id: string;
  name: string;
  price: number;
  hue: string;
}

const ITEMS: WishItem[] = [
  { id: "w-1", name: "Atlas Wool Coat", price: 480, hue: "from-violet-500/40" },
  { id: "w-2", name: "Cove Lounge Chair", price: 1240, hue: "from-emerald-500/40" },
  { id: "w-3", name: "Drift Ceramic Vase", price: 88, hue: "from-amber-500/40" },
];

type Channel = "link" | "twitter" | "email" | "sms";

const CHANNELS: { id: Channel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "link", label: "Copy link", icon: Link2 },
  { id: "twitter", label: "Tweet", icon: Twitter },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageCircle },
];

export interface WishlistShareableListPanelProps {
  className?: string;
  shareUrl?: string;
}

export function WishlistShareableListPanel({
  className,
  shareUrl = "lerpa.shop/wish/aurora-spring",
}: WishlistShareableListPanelProps) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState<Channel | null>(null);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (reset.current) clearTimeout(reset.current);
  }, []);

  const handle = async (ch: Channel) => {
    setActive(ch);
    if (ch === "link") {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(`https://${shareUrl}`);
        }
        setCopied(true);
        if (reset.current) clearTimeout(reset.current);
        reset.current = setTimeout(() => setCopied(false), 1800);
      } catch {
        // graceful no-op when clipboard unavailable
      }
    } else {
      if (reset.current) clearTimeout(reset.current);
      reset.current = setTimeout(() => setActive(null), 1200);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 border border-white/5 bg-zinc-950/40 rounded-2xl shadow-2xl w-full max-w-sm text-foreground select-none",
        className
      )}
      role="region"
      aria-label="Shareable wishlist panel"
    >
      <div className="flex flex-col gap-1 font-mono select-none">
        <span className="text-[9px] uppercase tracking-widest font-bold text-primary">SHARE_WISHLIST</span>
        <span className="text-[8px] text-white/40 uppercase font-semibold">3 items · public link</span>
      </div>

      <div className="flex -space-x-2" aria-hidden="true">
        {ITEMS.map((it, i) => (
          <div
            key={it.id}
            className={cn("w-10 h-10 rounded-full border-2 border-bg-2 bg-gradient-to-br to-bg-4", it.hue)}
            style={{ zIndex: ITEMS.length - i }}
          />
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-bg-2 bg-bg-3 grid place-items-center text-[10px] font-mono text-text-3" style={{ zIndex: 0 }}>
          +5
        </div>
      </div>

      <ul className="rounded-xl border border-edge divide-y divide-edge bg-bg-3 overflow-hidden">
        {ITEMS.map((it) => (
          <li key={it.id} className="flex items-center justify-between px-3 py-2 text-xs">
            <span className="font-semibold text-text truncate">{it.name}</span>
            <span className="text-text-3 font-mono tabular-nums">${it.price}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 rounded-xl border border-edge bg-bg-3 px-3 py-2">
        <Share2 className="w-3.5 h-3.5 text-text-3 shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-mono text-text-2 truncate flex-1" title={shareUrl}>
          {shareUrl}
        </span>
        <button
          type="button"
          onClick={() => handle("link")}
          aria-label="Copy wishlist link"
          className={cn(
            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
            copied ? "bg-accent text-bg" : "bg-bg-4 text-text-2 hover:text-text"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3 h-3" aria-hidden="true" />
                Copied
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}>
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div
        className="grid grid-cols-4 gap-2"
        role="group"
        aria-label="Share via channel"
      >
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const on = active === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handle(ch.id)}
              aria-label={ch.label}
              aria-pressed={on}
              className={cn(
                "flex flex-col items-center gap-1 py-2 rounded-xl border transition-colors",
                on ? "border-accent bg-accent-soft text-accent" : "border-edge bg-bg-3 text-text-2 hover:text-text hover:border-edge-2"
              )}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="text-[9px] font-mono uppercase tracking-widest">{ch.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[9px] text-text-4 font-mono" aria-live="polite">
        {copied ? "Link copied to your clipboard" : "Anyone with the link can view"}
      </p>
    </div>
  );
}
