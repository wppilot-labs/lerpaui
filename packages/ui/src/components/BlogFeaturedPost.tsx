"use client";

import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface BlogFeaturedPostProps {
  className?: string;
}

export function BlogFeaturedPost({ className }: BlogFeaturedPostProps) {
  return (
    <article
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/45 shadow-xl backdrop-blur-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="relative h-44 bg-gradient-to-br from-violet-500/40 via-primary/30 to-sky-500/30 sm:h-52">
        <span className="absolute left-4 top-4 rounded-full bg-muted px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-foreground backdrop-blur-sm">
          Featured
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-semibold text-violet-400">
            Engineering
          </span>
          <span className="text-muted-foreground/45">·</span>
          <span className="text-muted-foreground/55">Jun 1, 2026</span>
        </div>

        <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight">
          <a href="/" className="transition-colors hover:text-primary">
            How we cut our cold-start latency by 80% with edge caching
          </a>
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          A deep dive into the architecture changes, the dead ends we hit, and
          the surprisingly simple fix that finally moved the needle on our p99.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
              ML
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Marcus Lee</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground/55">
                <Clock className="h-3.5 w-3.5" /> 11 min read
              </p>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            Read article <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
