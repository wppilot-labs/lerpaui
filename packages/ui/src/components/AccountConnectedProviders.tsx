"use client";

import React, { useState } from "react";
import { Github, Mail, Chrome, Check } from "lucide-react";
import { cn } from "../lib/cn";

type Provider = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  account?: string;
  connected: boolean;
};

const INITIAL: Provider[] = [
  { id: "google", name: "Google", icon: Chrome, account: "jane@gmail.com", connected: true },
  { id: "github", name: "GitHub", icon: Github, account: "@janedev", connected: true },
  { id: "email", name: "Email & Password", icon: Mail, account: "jane@work.com", connected: true },
];

export interface AccountConnectedProvidersProps {
  className?: string;
}

export function AccountConnectedProviders({ className }: AccountConnectedProvidersProps) {
  const [providers, setProviders] = useState(INITIAL);

  const toggle = (id: string) =>
    setProviders((p) => p.map((x) => (x.id === id ? { ...x, connected: !x.connected } : x)));

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="mb-4">
        <h3 className="text-base font-bold">Connected accounts</h3>
        <p className="text-xs text-muted-foreground/70">Sign in faster with a linked identity provider</p>
      </div>

      <ul className="space-y-2.5">
        {providers.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
              <div className="h-9 w-9 rounded-xl bg-secondary/40 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground/90" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground/60 truncate">
                  {p.connected ? p.account : "Not connected"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                aria-pressed={p.connected}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors shrink-0 inline-flex items-center gap-1",
                  p.connected
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 group"
                    : "bg-primary text-primary-foreground border-transparent hover:brightness-110",
                )}
              >
                {p.connected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
