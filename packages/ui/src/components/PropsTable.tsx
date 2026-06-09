"use client";

import React from "react";
import { cn } from "../lib/cn";

type Prop = {
  name: string;
  type: string;
  required: boolean;
  default: string;
  desc: string;
};

const PROPS: Prop[] = [
  { name: "variant", type: '"solid" | "outline" | "ghost"', required: false, default: '"solid"', desc: "Visual style of the button." },
  { name: "size", type: '"sm" | "md" | "lg"', required: false, default: '"md"', desc: "Controls padding and font size." },
  { name: "disabled", type: "boolean", required: false, default: "false", desc: "Prevents interaction." },
  { name: "loading", type: "boolean", required: false, default: "false", desc: "Shows a spinner and disables clicks." },
  { name: "onClick", type: "() => void", required: true, default: "—", desc: "Handler fired on press." },
];

export interface PropsTableProps {
  className?: string;
}

export function PropsTable({ className }: PropsTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/60 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-foreground/[0.08] bg-foreground/[0.02] text-[11px] font-bold uppercase tracking-wider text-muted-foreground/55">
              <th scope="col" className="px-4 py-3">Prop</th>
              <th scope="col" className="px-4 py-3">Type</th>
              <th scope="col" className="px-4 py-3">Default</th>
              <th scope="col" className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.05]">
            {PROPS.map((p) => (
              <tr key={p.name} className="align-top transition-colors hover:bg-foreground/[0.02]">
                <td className="whitespace-nowrap px-4 py-3">
                  <code className="font-mono text-xs font-semibold text-primary">{p.name}</code>
                  {p.required && (
                    <span className="ml-1.5 rounded bg-rose-500/15 px-1 py-0.5 text-[10px] font-bold uppercase text-rose-600 dark:text-rose-300">
                      req
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-sky-600 dark:text-sky-300">{p.type}</code>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <code className="font-mono text-xs text-muted-foreground/60">{p.default}</code>
                </td>
                <td className="px-4 py-3 text-sm leading-snug text-muted-foreground/75">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
