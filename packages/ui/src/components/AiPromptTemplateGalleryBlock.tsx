"use client";

import React, { useState } from "react";
import { LayoutGrid, PenLine, Megaphone, Code2, GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";

type Template = {
  id: string;
  title: string;
  desc: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const TEMPLATES: Template[] = [
  { id: "t1", title: "Blog post outline", desc: "SEO-friendly structure from a topic", category: "Writing", icon: PenLine, tone: "bg-violet-500/15 text-violet-300" },
  { id: "t2", title: "Ad copy variations", desc: "5 hooks for a single product", category: "Marketing", icon: Megaphone, tone: "bg-rose-500/15 text-rose-300" },
  { id: "t3", title: "Code reviewer", desc: "Spot bugs & suggest fixes", category: "Engineering", icon: Code2, tone: "bg-sky-500/15 text-sky-300" },
  { id: "t4", title: "Lesson explainer", desc: "Teach a concept simply", category: "Education", icon: GraduationCap, tone: "bg-emerald-500/15 text-emerald-300" },
  { id: "t5", title: "Meeting recap", desc: "Notes into action items", category: "Business", icon: Briefcase, tone: "bg-amber-500/15 text-amber-300" },
  { id: "t6", title: "Cold email", desc: "Personalized outreach draft", category: "Marketing", icon: Megaphone, tone: "bg-rose-500/15 text-rose-300" },
];

const CATS = ["All", "Writing", "Marketing", "Engineering", "Education", "Business"];

export interface AiPromptTemplateGalleryBlockProps {
  className?: string;
}

export function AiPromptTemplateGalleryBlock({ className }: AiPromptTemplateGalleryBlockProps) {
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat);

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-4">
        <LayoutGrid className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Prompt templates</h3>
        <span className="ml-auto text-xs text-muted-foreground/45">{shown.length} templates</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition",
              cat === c ? "bg-primary text-primary-foreground" : "bg-foreground/[0.04] text-muted-foreground/60 hover:bg-foreground/[0.07]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {shown.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              className="group flex items-start gap-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3.5 text-left hover:bg-foreground/[0.05] hover:border-primary/30 transition"
            >
              <div className={cn("h-10 w-10 shrink-0 grid place-items-center rounded-lg", t.tone)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold truncate">{t.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground/60 leading-snug mt-0.5">{t.desc}</p>
                <span className="inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/45">
                  {t.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
