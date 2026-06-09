"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Globe, Linkedin, MapPin, Twitter, UserCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

interface BlogAuthorBioProps {
  className?: string;
}

const POSTS = [
  { title: "Designing for scale: 10 to 10,000 components", date: "May 14" },
  { title: "How we shaved 60% off our LCP", date: "May 09" },
  { title: "Animation without seasickness", date: "May 02" },
];

const LINKS = [
  { Icon: Twitter, label: "Twitter", href: "#" },
  { Icon: Github, label: "GitHub", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Globe, label: "Website", href: "#" },
];

export function BlogAuthorBio({ className }: BlogAuthorBioProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-3xl border border-border/50 bg-card/30 px-6 py-8 backdrop-blur-xl",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="blog-author-bio-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 right-0 h-40 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative space-y-5"
      >
        <div className="flex items-start gap-4">
          <div
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-white/10"
            aria-hidden="true"
          >
            <div className="flex h-full w-full items-center justify-center text-base font-black text-white">
              AT
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
              <UserCircle2 className="h-3 w-3" aria-hidden="true" />
              About the author
            </div>
            <h2 id="blog-author-bio-heading" className="text-base font-black tracking-tight">
              Ada Tang
            </h2>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground/65">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Staff Engineer at Lerpa UI · Berlin
            </p>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/85">
          Ada has spent a decade shipping design systems at scale — most recently leading the platform team at Northwind. She writes about performance, accessibility, and the boring bits that make products feel premium.
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {LINKS.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-muted-foreground/80 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ))}
          <a
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/20"
          >
            Follow
          </a>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3">
          <div className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
            Recent posts
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {POSTS.map((p) => (
              <li key={p.title}>
                <a
                  href="/"
                  className="flex items-center justify-between gap-2 py-1.5 text-[10px] text-muted-foreground/80 transition-colors hover:text-foreground"
                >
                  <span className="line-clamp-1">{p.title}</span>
                  <span className="shrink-0 text-[9px] uppercase tracking-wider text-muted-foreground/50">
                    {p.date}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
