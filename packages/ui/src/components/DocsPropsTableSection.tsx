"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface DocsPropsTableSectionProps {
  className?: string;
}

type Prop = { name: string; type: string; def: string; desc: string; required?: boolean };

const PROPS: Prop[] = [
  { name: "variant", type: '"solid" | "outline"', def: '"solid"', desc: "Visual style of the button." },
  { name: "size", type: '"sm" | "md" | "lg"', def: '"md"', desc: "Controls padding and font size." },
  { name: "disabled", type: "boolean", def: "false", desc: "Prevents interaction when true." },
  { name: "onClick", type: "() => void", def: "—", desc: "Click handler.", required: true },
];

export function DocsPropsTableSection({ className }: DocsPropsTableSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <header className="mb-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/45">Reference</p>
        <h3 className="text-base font-bold mt-0.5">
          <code className="font-mono">Button</code> props
        </h3>
      </header>

      <div className="overflow-x-auto rounded-xl border border-foreground/[0.05]">
        <table className="w-full text-left min-w-[34rem]">
          <thead>
            <tr className="bg-foreground/[0.02] text-[11px] uppercase font-bold text-muted-foreground/50 tracking-wider">
              <th scope="col" className="px-3 py-2">Prop</th>
              <th scope="col" className="px-3 py-2">Type</th>
              <th scope="col" className="px-3 py-2">Default</th>
              <th scope="col" className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.04] text-sm align-top">
            {PROPS.map((p) => (
              <tr key={p.name} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-3 py-3 whitespace-nowrap">
                  <code className="font-mono font-semibold text-sky-300/90">{p.name}</code>
                  {p.required && <span className="ml-1 text-[11px] font-medium text-amber-400/90">*</span>}
                </td>
                <td className="px-3 py-3">
                  <code className="font-mono text-xs text-fuchsia-300/80">{p.type}</code>
                </td>
                <td className="px-3 py-3">
                  <code className="font-mono text-xs text-muted-foreground/55">{p.def}</code>
                </td>
                <td className="px-3 py-3 text-muted-foreground/70">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground/40">
        <span className="text-amber-400/90">*</span> Required prop.
      </p>
    </div>
  );
}
