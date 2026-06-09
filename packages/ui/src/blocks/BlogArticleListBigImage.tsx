"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; avatarColor: string };
  publishedAt: string;
  readingMinutes: number;
  href?: string;
  imageUrl?: string;
}

export interface BlogArticleListBigImageProps
  extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  articles?: BlogArticle[];
  className?: string;
}

const DEFAULT_ARTICLES: BlogArticle[] = [
  {
    id: "a-1",
    title: "Why we rebuilt our entire design system on Tailwind v4",
    excerpt:
      "After two years of fighting CSS-in-JS overhead, we migrated to a token-driven Tailwind v4 setup. Here is the build-time and runtime impact, with numbers.",
    category: "Engineering",
    author: { name: "Mara Choi", avatarColor: "oklch(0.7 0.18 280)" },
    publishedAt: "May 21, 2026",
    readingMinutes: 9,
    href: "#article-1",
    imageUrl:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "a-2",
    title: "Reduced-motion is a feature, not a fallback",
    excerpt:
      "How treating prefers-reduced-motion as a first-class motion language unlocked a more honest UX for every user.",
    category: "Design",
    author: { name: "Jules Aramide", avatarColor: "oklch(0.75 0.15 200)" },
    publishedAt: "May 14, 2026",
    readingMinutes: 6,
    href: "#article-2",
  },
  {
    id: "a-3",
    title: "Shipping 1235 components with one engineer",
    excerpt:
      "Tooling, registries, and pre-merge automation that let a solo maintainer ship at team-of-five velocity.",
    category: "Workflow",
    author: { name: "Sage Okonjo", avatarColor: "oklch(0.78 0.16 340)" },
    publishedAt: "May 03, 2026",
    readingMinutes: 11,
    href: "#article-3",
  },
  {
    id: "a-4",
    title: "Static export in Next 16: what changed",
    excerpt:
      "generateStaticParams, the loss of next lint, and Turbopack-export quirks we hit migrating real codebases.",
    category: "Frameworks",
    author: { name: "Iris Vela", avatarColor: "oklch(0.7 0.18 140)" },
    publishedAt: "April 28, 2026",
    readingMinutes: 7,
    href: "#article-4",
  },
];

interface AuthorChipProps {
  author: BlogArticle["author"];
  size?: "sm" | "md";
}

function AuthorChip({ author, size = "sm" }: AuthorChipProps) {
  const initials = React.useMemo(
    () =>
      author.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [author.name]
  );
  const sz = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
          sz
        )}
        style={{ background: author.avatarColor }}
      >
        {initials}
      </span>
      <span className="text-xs font-medium text-foreground">{author.name}</span>
    </span>
  );
}

export function BlogArticleListBigImage({
  eyebrow = "The ship log",
  title = "Field notes from teams building real products.",
  description = "Engineering deep-dives, design rationale, and the occasional post-mortem.",
  articles = DEFAULT_ARTICLES,
  className,
  ...rest
}: BlogArticleListBigImageProps) {
  const prefersHook = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const reduced = prefersHook || Boolean(fmReduced);
  const headingId = React.useId();
  const list = articles.length ? articles : DEFAULT_ARTICLES;
  const [feature, ...rest_articles] = list;

  return (
    <section
      {...rest}
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {eyebrow ? (
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={headingId}
              className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <a
            href="#archive"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:underline"
          >
            Browse archive
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>

        {feature ? (
          <motion.article
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg lg:grid-cols-12"
          >
            <a
              href={feature.href ?? "#"}
              className="relative block aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto"
              aria-label={feature.title}
            >
              {feature.imageUrl ? (
                <img
                  src={feature.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.7 0.18 280) 0%, oklch(0.78 0.16 200) 100%)",
                  }}
                />
              )}
              <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                {feature.category}
              </span>
            </a>
            <div className="flex flex-col justify-center gap-5 p-7 lg:col-span-5 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {feature.publishedAt}
                </span>
                <span aria-hidden>&middot;</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {feature.readingMinutes} min read
                </span>
              </div>
              <h3 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                <a
                  href={feature.href ?? "#"}
                  className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_2px] focus-visible:outline-none focus-visible:underline motion-reduce:transition-none"
                >
                  {feature.title}
                </a>
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {feature.excerpt}
              </p>
              <AuthorChip author={feature.author} size="md" />
            </div>
          </motion.article>
        ) : null}

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {rest_articles.map((article, i) => (
            <motion.li
              key={article.id}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: reduced ? 0 : i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg">
                <a
                  href={article.href ?? "#"}
                  className="relative block aspect-[16/9] overflow-hidden"
                  aria-label={article.title}
                >
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(135deg, ${article.author.avatarColor} 0%, oklch(0.75 0.15 200) 100%)`,
                      }}
                    />
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-sm">
                    {article.category}
                  </span>
                </a>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{article.publishedAt}</span>
                    <span aria-hidden>&middot;</span>
                    <span>{article.readingMinutes} min</span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-foreground">
                    <a
                      href={article.href ?? "#"}
                      className="focus-visible:outline-none focus-visible:underline"
                    >
                      {article.title}
                    </a>
                  </h3>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="pt-1">
                    <AuthorChip author={article.author} />
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BlogArticleListBigImage;
