"use client";

import React, { useState } from "react";
import { CornerDownRight, Heart, Send } from "lucide-react";
import { cn } from "../lib/cn";

type Reply = {
  id: string;
  author: string;
  initials: string;
  tint: string;
  time: string;
  body: string;
  likes: number;
};

type Comment = Reply & { replies: Reply[] };

const THREAD: Comment[] = [
  {
    id: "c1",
    author: "Marcus Lee",
    initials: "ML",
    tint: "bg-sky-500/15 text-sky-300",
    time: "2h ago",
    body: "Should we gate the new export flow behind a feature flag for the beta cohort first?",
    likes: 4,
    replies: [
      {
        id: "r1",
        author: "Priya Patel",
        initials: "PP",
        tint: "bg-violet-500/15 text-violet-300",
        time: "1h ago",
        body: "Agreed — let's flag it. I'll wire it to the LaunchDarkly key today.",
        likes: 2,
      },
      {
        id: "r2",
        author: "Jane Doe",
        initials: "JD",
        tint: "bg-emerald-500/15 text-emerald-300",
        time: "44m ago",
        body: "Works for me. Make sure the empty state copy ships with it.",
        likes: 1,
      },
    ],
  },
];

function Bubble({ c, reply }: { c: Reply; reply?: boolean }) {
  return (
    <div className="flex gap-2.5">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          reply ? "h-8 w-8" : "h-9 w-9",
          c.tint,
        )}
      >
        {c.initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{c.author}</span>
          <span className="text-xs text-muted-foreground/45">{c.time}</span>
        </div>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {c.body}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 transition-colors hover:text-rose-400"
          >
            <Heart className="h-3.5 w-3.5" /> {c.likes}
          </button>
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export interface TeamCommentThreadProps {
  className?: string;
}

export function TeamCommentThread({ className }: TeamCommentThreadProps) {
  const [draft, setDraft] = useState("");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">Discussion</h3>
        <span className="text-xs text-muted-foreground/50">3 comments</span>
      </div>

      <div className="space-y-4">
        {THREAD.map((c) => (
          <div key={c.id}>
            <Bubble c={c} />
            <div className="mt-3 space-y-3 border-l border-border/50 pl-4">
              {c.replies.map((r) => (
                <div key={r.id} className="flex gap-1.5">
                  <CornerDownRight className="mt-1.5 h-3 w-3 shrink-0 text-muted-foreground/30" />
                  <Bubble c={r} reply />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDraft("");
        }}
        className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4"
      >
        <label htmlFor="thread-reply" className="sr-only">
          Write a reply
        </label>
        <input
          id="thread-reply"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a reply…"
          className="flex-1 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          type="submit"
          aria-label="Send reply"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:brightness-110"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
