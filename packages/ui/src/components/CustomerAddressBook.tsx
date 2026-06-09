"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type Address = {
  id: string;
  label: string;
  name: string;
  lines: string[];
  isDefault?: boolean;
};

const ADDRESSES: Address[] = [
  {
    id: "home",
    label: "Home",
    name: "Jane Doe",
    lines: ["123 Market Street, Apt 4B", "San Francisco, CA 94103", "United States"],
    isDefault: true,
  },
  {
    id: "work",
    label: "Work",
    name: "Jane Doe",
    lines: ["500 Howard Street, Floor 12", "San Francisco, CA 94105", "United States"],
  },
];

export interface CustomerAddressBookProps {
  className?: string;
}

export function CustomerAddressBook({ className }: CustomerAddressBookProps) {
  const [defaultId, setDefaultId] = useState("home");

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Address book</h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-foreground/[0.03] px-2.5 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="space-y-2.5">
        {ADDRESSES.map((a) => {
          const isDefault = defaultId === a.id;
          return (
            <div key={a.id} className="rounded-xl border border-border bg-foreground/[0.02] p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-sm font-bold">{a.label}</span>
                {isDefault && (
                  <span className="rounded-full border border-primary/25 bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Default
                  </span>
                )}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${a.label} address`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${a.label} address`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold">{a.name}</p>
              {a.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-muted-foreground">
                  {line}
                </p>
              ))}
              {!isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultId(a.id)}
                  className="mt-2 text-xs font-bold text-primary hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
