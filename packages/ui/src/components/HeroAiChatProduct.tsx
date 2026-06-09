"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Send, User, Bot } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroAiChatProductProps {
  className?: string;
}

type Msg = { from: "u" | "ai"; text: string };

const CHAT: Msg[] = [
  { from: "u", text: "Summarize last quarter's growth in three bullets." },
  { from: "ai", text: "Sure — here's what stood out across Q3:" },
  { from: "ai", text: "• MRR up 38% to $2.4M\n• Net retention 132% vs. 118% prior\n• 4 enterprise logos signed" },
  { from: "u", text: "Generate the board update slide." },
];

export function HeroAiChatProduct({ className }: HeroAiChatProductProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-card/20 px-6 py-16 backdrop-blur-xl sm:px-10 sm:py-20",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.78_0.18_200/0.18),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            New • AI assistant
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            A copilot that{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.88 0.16 200), oklch(0.78 0.22 180))",
              }}
            >
              knows your business
            </span>
            .
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Plug into your data warehouse, your docs, and your customer threads. Ask anything — get
            cited, traceable answers in seconds.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#try"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-cyan-950 shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 motion-reduce:hover:translate-y-0"
            >
              Try the demo
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
            <a
              href="#integrate"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            >
              See integrations
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                  <Bot className="h-4 w-4" aria-hidden />
                </span>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Atlas Assistant</div>
                  <div className="text-[10px] text-muted-foreground">connected to 4 sources</div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                ● Online
              </span>
            </div>

            <div className="space-y-3 p-4">
              {CHAT.map((m, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                  className={cn(
                    "flex items-start gap-2.5",
                    m.from === "u" && "flex-row-reverse"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
                      m.from === "u"
                        ? "bg-foreground/10 text-foreground"
                        : "bg-cyan-400/15 text-cyan-300"
                    )}
                  >
                    {m.from === "u" ? (
                      <User className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Bot className="h-3.5 w-3.5" aria-hidden />
                    )}
                  </span>
                  <div
                    className={cn(
                      "max-w-[80%] whitespace-pre-line rounded-2xl border px-3.5 py-2 text-xs leading-relaxed",
                      m.from === "u"
                        ? "border-border/40 bg-card/60 text-foreground"
                        : "border-cyan-400/20 bg-cyan-500/10 text-foreground/90"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-border/40 p-3">
              <input
                aria-label="Demo chat input"
                disabled
                placeholder="Ask anything…"
                className="flex-1 rounded-xl border border-border/40 bg-card/40 px-3 py-2 text-xs text-muted-foreground placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                aria-label="Send message"
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400 text-cyan-950"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroAiChatProduct;
