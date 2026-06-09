"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsApiReferenceSectionProps {
  className?: string;
}

type Param = { name: string; type: string; required: boolean; desc: string };

type Endpoint = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  summary: string;
  params: Param[];
};

const METHOD_STYLES: Record<Endpoint["method"], string> = {
  GET: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  POST: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  DELETE: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/v1/projects/{id}",
    summary: "Retrieve a single project by its unique identifier.",
    params: [
      { name: "id", type: "string", required: true, desc: "The project identifier." },
      { name: "expand", type: "string[]", required: false, desc: "Related fields to inline." },
    ],
  },
  {
    method: "POST",
    path: "/v1/projects",
    summary: "Create a new project in the current workspace.",
    params: [
      { name: "name", type: "string", required: true, desc: "Human-readable project name." },
      { name: "region", type: "enum", required: false, desc: "Deployment region. Defaults to us-east." },
    ],
  },
];

export function DocsApiReferenceSection({ className }: DocsApiReferenceSectionProps) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">API Reference</p>
        <h3 className="text-base font-bold mt-0.5">Projects</h3>
      </header>

      <div className="space-y-2">
        {ENDPOINTS.map((ep, i) => {
          const isOpen = open === i;
          return (
            <div key={ep.path} className="rounded-xl border border-foreground/[0.06] overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-foreground/[0.02] transition-colors"
              >
                <span
                  className={cn(
                    "shrink-0 text-[11px] font-bold font-mono px-2 py-0.5 rounded border",
                    METHOD_STYLES[ep.method],
                  )}
                >
                  {ep.method}
                </span>
                <code className="flex-1 text-sm font-mono text-foreground/90 truncate">{ep.path}</code>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground/40 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-foreground/[0.04]">
                  <p className="text-sm text-muted-foreground/70 mb-3">{ep.summary}</p>
                  <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/40 mb-1.5">
                    Parameters
                  </p>
                  <ul className="space-y-2">
                    {ep.params.map((p) => (
                      <li key={p.name} className="flex items-baseline gap-2 text-sm">
                        <code className="font-mono font-semibold text-sky-300/90">{p.name}</code>
                        <span className="text-xs font-mono text-muted-foreground/50">{p.type}</span>
                        {p.required && (
                          <span className="text-xs font-medium text-amber-400/90">required</span>
                        )}
                        <span className="text-xs text-muted-foreground/55 ml-auto text-right">{p.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
