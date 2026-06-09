"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Linkedin, Twitter, Youtube, Mail } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardContentCalendarProps {
  className?: string;
}

type Channel = "linkedin" | "twitter" | "youtube" | "email";

const CHANNEL_META: Record<Channel, { icon: React.ElementType; class: string }> = {
  linkedin: { icon: Linkedin, class: "bg-sky-500/10 text-sky-500" },
  twitter: { icon: Twitter, class: "bg-cyan-500/10 text-cyan-500" },
  youtube: { icon: Youtube, class: "bg-rose-500/10 text-rose-500" },
  email: { icon: Mail, class: "bg-violet-500/10 text-violet-500" },
};

type Post = { title: string; channel: Channel; status: "draft" | "scheduled" | "published" };
type Day = { date: number; current: boolean; today?: boolean; posts: Post[] };

const DAYS: Day[] = Array.from({ length: 35 }, (_, i) => {
  const date = i - 4 + 1; // start offset
  const current = date >= 1 && date <= 31;
  return { date: current ? date : (i < 4 ? 27 + i : date - 31), current, posts: [] };
});

const POST_MAP: Record<number, Post[]> = {
  3: [{ title: "Launch teaser", channel: "twitter", status: "published" }],
  7: [
    { title: "Customer story", channel: "linkedin", status: "scheduled" },
    { title: "Walk-through video", channel: "youtube", status: "draft" },
  ],
  12: [{ title: "Weekly digest", channel: "email", status: "scheduled" }],
  15: [{ title: "Product update", channel: "linkedin", status: "published" }],
  18: [{ title: "Behind-the-scenes", channel: "twitter", status: "scheduled" }],
  22: [{ title: "Q3 retrospective", channel: "linkedin", status: "draft" }],
  25: [
    { title: "Tutorial drop", channel: "youtube", status: "scheduled" },
    { title: "Release notes", channel: "email", status: "draft" },
  ],
};

DAYS.forEach((d) => { if (d.current && POST_MAP[d.date]) d.posts = POST_MAP[d.date]; });
const TODAY = 12;
DAYS.find((d) => d.current && d.date === TODAY)!.today = true;

const STATUS_DOT: Record<Post["status"], string> = {
  draft: "bg-muted-foreground",
  scheduled: "bg-amber-500",
  published: "bg-emerald-500",
};

export function DashboardContentCalendar({ className }: DashboardContentCalendarProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Content calendar"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Content calendar</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">May 2026 · 8 posts scheduled</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          {(["draft", "scheduled", "published"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} /> {s}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border text-[10px]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="bg-muted/30 px-2 py-1.5 font-medium uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
        {DAYS.map((day, i) => (
          <motion.div
            key={i}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.01 }}
            className={cn(
              "min-h-[72px] bg-card p-1.5",
              !day.current && "opacity-40",
              day.today && "bg-primary/5 ring-1 ring-inset ring-primary/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn("text-[10px] tabular-nums", day.today ? "font-bold text-primary" : "text-muted-foreground")}>
                {day.date}
              </span>
            </div>
            <div className="mt-1 space-y-1">
              {day.posts.map((p, j) => {
                const meta = CHANNEL_META[p.channel];
                const Icon = meta.icon;
                return (
                  <div key={j} className={cn("flex items-center gap-1 truncate rounded px-1 py-0.5 text-[9px]", meta.class)}>
                    <Icon className="h-2.5 w-2.5 flex-shrink-0" aria-hidden />
                    <span className="truncate">{p.title}</span>
                    <span className={cn("ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full", STATUS_DOT[p.status])} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default DashboardContentCalendar;
