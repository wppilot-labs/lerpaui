"use client";

import React, { useState } from "react";
import { Mail, X, Plus, ChevronDown, UserPlus } from "lucide-react";
import { cn } from "../lib/cn";

type Role = "Admin" | "Editor" | "Viewer";
const ROLES: Role[] = ["Admin", "Editor", "Viewer"];

export interface TeamInviteFormSectionProps {
  className?: string;
}

export function TeamInviteFormSection({
  className,
}: TeamInviteFormSectionProps) {
  const [pending, setPending] = useState<string[]>([
    "design@acme.io",
    "sam@acme.io",
  ]);
  const [value, setValue] = useState("");
  const [role, setRole] = useState<Role>("Editor");

  const add = () => {
    const email = value.trim();
    if (!email || pending.includes(email)) return;
    setPending((p) => [...p, email]);
    setValue("");
  };

  const remove = (email: string) =>
    setPending((p) => p.filter((e) => e !== email));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserPlus className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-base font-bold">Invite teammates</h3>
          <p className="text-xs text-muted-foreground/55">
            They&apos;ll get an email to join your workspace
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <label
          htmlFor="invite-email"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground/60"
        >
          Email address
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <input
              id="invite-email"
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border border-border/60 bg-secondary/30 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="relative">
            <label htmlFor="invite-role" className="sr-only">
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="h-full cursor-pointer appearance-none rounded-lg border border-border/60 bg-secondary/30 py-2 pl-3 pr-8 text-sm font-medium text-foreground focus:border-primary/40 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          </div>

          <button
            type="submit"
            aria-label="Add email to invite list"
            className="flex w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </form>

      {pending.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {pending.map((email) => (
            <li
              key={email}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 py-1 pl-3 pr-1.5 text-xs"
            >
              <span className="text-foreground/90">{email}</span>
              <button
                type="button"
                onClick={() => remove(email)}
                aria-label={`Remove ${email}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-rose-500/15 hover:text-rose-400"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Send {pending.length} invite{pending.length === 1 ? "" : "s"}
      </button>
    </div>
  );
}
