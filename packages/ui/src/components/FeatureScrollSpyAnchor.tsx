"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";

export interface FeatureScrollSpyAnchorProps {
  className?: string;
}

interface Section {
  id: string;
  title: string;
  body: string;
}

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    body: "An opinionated platform that bundles your runtime, database, and observability into a single, coherent surface. Everything you need to ship — nothing you don't.",
  },
  {
    id: "ingest",
    title: "Ingest",
    body: "Stream from 120+ sources with built-in dedupe, schema inference, and replay. Built on a zero-copy parser that handles 1.4M events per second per node.",
  },
  {
    id: "transform",
    title: "Transform",
    body: "Write transformations in SQL or TypeScript. Each one runs in its own sandbox with deterministic replays and a complete lineage graph for debugging.",
  },
  {
    id: "query",
    title: "Query",
    body: "Sub-second analytical queries over months of data. The same engine powers your dashboards, embedded analytics, and AI retrieval pipelines.",
  },
  {
    id: "deploy",
    title: "Deploy",
    body: "One CLI, fourteen regions, every preview a real environment. CI gets git-style branches, production gets atomic rollouts with one-click rollback.",
  },
];

/** Anchor navigation sidebar that highlights the active section as the reader scrolls. */
export function FeatureScrollSpyAnchor({ className }: FeatureScrollSpyAnchorProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [active, setActive] = React.useState(SECTIONS[0].id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            How the platform fits together.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Five layers, one connection string.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <nav aria-label="Section navigation" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="space-y-1 border-l border-border/60 pl-4">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "true" : undefined}
                    className={cn(
                      "relative -ml-[17px] block border-l-2 py-1.5 pl-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                      active === s.id
                        ? "border-primary font-semibold text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {SECTIONS.map((s, i) => (
              <motion.article
                id={s.id}
                key={s.id}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  0{i + 1}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureScrollSpyAnchor;
