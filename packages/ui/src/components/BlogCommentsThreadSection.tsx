"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Heart, CornerDownRight, Send } from "lucide-react";
import { cn } from "../lib/cn";

export interface BlogCommentsThreadSectionProps {
  className?: string;
}

type Comment = {
  id: string;
  author: string;
  initials: string;
  tone: string;
  time: string;
  body: string;
  likes: number;
  replies?: Comment[];
};

const COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Priya Patel",
    initials: "PP",
    tone: "bg-primary/80",
    time: "2h ago",
    body: "This is the clearest take on stateful streaming I've read all year. The example with Suspense boundaries finally clicked.",
    likes: 24,
    replies: [
      {
        id: "c1r1",
        author: "Maya O.",
        initials: "MO",
        tone: "bg-violet-500/80",
        time: "1h ago",
        body: "Same — the Suspense-around-data pattern is wild once it clicks. Are you using it in production yet?",
        likes: 6,
      },
    ],
  },
  {
    id: "c2",
    author: "Daniel Cho",
    initials: "DC",
    tone: "bg-emerald-500/80",
    time: "3h ago",
    body: "Curious how you'd handle the loading skeleton problem when nesting boundaries 3+ deep. Have you tried a route-level fallback?",
    likes: 12,
  },
  {
    id: "c3",
    author: "Lena Rivers",
    initials: "LR",
    tone: "bg-amber-500/80",
    time: "5h ago",
    body: "Bookmarking this one. The diagrams are 🔥.",
    likes: 8,
  },
];

function CommentNode({ c, depth = 0 }: { c: Comment; depth?: number }) {
  return (
    <article className={cn("flex gap-3", depth > 0 && "ml-8 mt-3 sm:ml-12")}>
      <span className={cn("grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-xs font-semibold text-white", c.tone)}>
        {c.initials}
      </span>
      <div className="flex-1">
        <div className="rounded-xl border bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{c.author}</span>
            <span className="text-[11px] text-muted-foreground">· {c.time}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{c.body}</p>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
            <Heart className="h-3 w-3" aria-hidden /> {c.likes}
          </button>
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
            <CornerDownRight className="h-3 w-3" aria-hidden /> Reply
          </button>
        </div>
        {c.replies?.map((r) => <CommentNode key={r.id} c={r} depth={depth + 1} />)}
      </div>
    </article>
  );
}

export function BlogCommentsThreadSection({ className }: BlogCommentsThreadSectionProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Comments"
      className={cn(
        "w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8",
        className
      )}
    >
      <header className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
          <h3 className="text-base font-semibold tracking-tight text-foreground">Comments <span className="text-muted-foreground">· 4</span></h3>
        </div>
        <select className="rounded-md border bg-muted/30 px-2 py-1 text-xs text-muted-foreground focus:outline-none">
          <option>Most helpful</option>
          <option>Newest</option>
          <option>Oldest</option>
        </select>
      </header>

      <form className="mb-6 flex items-start gap-3">
        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          You
        </span>
        <div className="flex-1 rounded-xl border bg-muted/10 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            placeholder="Add to the conversation…"
            rows={2}
            className="block w-full resize-none rounded-xl bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex items-center justify-between border-t px-3 py-2">
            <p className="text-[10px] text-muted-foreground">Markdown supported</p>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:brightness-110">
              <Send className="h-3 w-3" aria-hidden /> Post
            </button>
          </div>
        </div>
      </form>

      <motion.ol
        initial={reduced ? false : "hidden"}
        animate="show"
        variants={reduced ? undefined : { show: { transition: { staggerChildren: 0.06 } } }}
        className="space-y-5"
      >
        {COMMENTS.map((c) => (
          <motion.li
            key={c.id}
            variants={reduced ? undefined : { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
          >
            <CommentNode c={c} />
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

export default BlogCommentsThreadSection;
