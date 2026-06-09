"use client";

import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

type CaseStudy = {
  id: string;
  company: string;
  industry: string;
  metric: string;
  metricLabel: string;
  summary: string;
  initials: string;
};

const STUDIES: CaseStudy[] = [
  {
    id: "1",
    company: "Northwind Co.",
    industry: "E-commerce",
    metric: "+187%",
    metricLabel: "revenue growth",
    summary: "Unified their storefront and analytics to triple conversion in two quarters.",
    initials: "NC",
  },
  {
    id: "2",
    company: "Lumen Health",
    industry: "Healthcare",
    metric: "−42%",
    metricLabel: "support tickets",
    summary: "Automated patient onboarding and cut response times in half.",
    initials: "LH",
  },
  {
    id: "3",
    company: "Vertex Labs",
    industry: "SaaS",
    metric: "3.4x",
    metricLabel: "faster releases",
    summary: "Streamlined their pipeline and shipped features weekly instead of monthly.",
    initials: "VL",
  },
  {
    id: "4",
    company: "Harbor Freight",
    industry: "Logistics",
    metric: "$1.2M",
    metricLabel: "annual savings",
    summary: "Optimized routing across 40 warehouses with a single dashboard.",
    initials: "HF",
  },
];

export interface CaseStudyCardGridProps {
  className?: string;
}

export function CaseStudyCardGrid({ className }: CaseStudyCardGridProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-foreground",
        className,
      )}
    >
      {STUDIES.map((study) => (
        <article
          key={study.id}
          className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/45 p-5 shadow-xl backdrop-blur-xl transition-colors hover:border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                {study.initials}
              </span>
              <div>
                <h3 className="text-base font-bold leading-tight">{study.company}</h3>
                <p className="text-[11px] text-muted-foreground/55">{study.industry}</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
          </div>

          <div className="mt-4 flex items-baseline gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-2xl font-black text-foreground">{study.metric}</span>
            <span className="text-xs text-muted-foreground/60">{study.metricLabel}</span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground/75">{study.summary}</p>
        </article>
      ))}
    </div>
  );
}
