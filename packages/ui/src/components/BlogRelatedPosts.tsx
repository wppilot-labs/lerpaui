"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

type Related = {
  id: string;
  title: string;
  category: string;
  catCls: string;
  date: string;
  read: string;
  cover: string;
};

const RELATED: Related[] = [
  {
    id: "1",
    title: "A field guide to writing good error messages",
    category: "Design",
    catCls: "text-violet-400",
    date: "May 28",
    read: "5 min",
    cover: "from-violet-500/40 to-fuchsia-500/30",
  },
  {
    id: "2",
    title: "Our migration from REST to typed RPC",
    category: "Engineering",
    catCls: "text-sky-400",
    date: "May 22",
    read: "8 min",
    cover: "from-sky-500/40 to-cyan-500/30",
  },
  {
    id: "3",
    title: "What we learned running a public roadmap",
    category: "Product",
    catCls: "text-emerald-400",
    date: "May 14",
    read: "6 min",
    cover: "from-emerald-500/40 to-teal-500/30",
  },
];

export interface BlogRelatedPostsProps {
  className?: string;
}

export function BlogRelatedPosts({ className }: BlogRelatedPostsProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h3 className="mb-3 text-base font-bold">Related reading</h3>

      <ul className="divide-y divide-border/40">
        {RELATED.map((p) => (
          <li key={p.id}>
            <a
              href="/"
              className="group flex items-center gap-3 py-3 transition-colors"
            >
              <div
                className={cn(
                  "h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br",
                  p.cover,
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={cn("font-bold", p.catCls)}>{p.category}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-muted-foreground/55">{p.date}</span>
                </div>
                <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                  {p.title}
                </h4>
                <span className="mt-0.5 block text-xs text-muted-foreground/45">
                  {p.read} read
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
