"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface AuthSocialLoginPanelProps {
  className?: string;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.78c.03 3.27 2.87 4.36 2.9 4.37-.02.08-.45 1.55-1.49 3.07-.9 1.32-1.83 2.63-3.3 2.66-1.44.03-1.9-.85-3.55-.85-1.64 0-2.16.83-3.52.88-1.42.05-2.5-1.43-3.4-2.74-1.85-2.68-3.26-7.57-1.36-10.87.94-1.64 2.63-2.68 4.46-2.7 1.39-.03 2.7.94 3.55.94.85 0 2.44-1.16 4.11-.99.7.03 2.67.28 3.93 2.13-.1.06-2.35 1.37-2.33 4.09M13.7 3.5C14.46 2.58 14.97 1.3 14.83 0c-1.1.05-2.43.74-3.22 1.66-.71.82-1.33 2.13-1.16 3.38 1.23.1 2.49-.62 3.25-1.54" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#F25022" d="M0 0h11.4v11.4H0z" />
      <path fill="#7FBA00" d="M12.6 0H24v11.4H12.6z" />
      <path fill="#00A4EF" d="M0 12.6h11.4V24H0z" />
      <path fill="#FFB900" d="M12.6 12.6H24V24H12.6z" />
    </svg>
  );
}

interface Provider {
  name: string;
  icon: React.ReactNode;
  className: string;
}

const PROVIDERS: Provider[] = [
  {
    name: "Google",
    icon: <GoogleIcon />,
    className:
      "border border-border bg-background text-foreground hover:bg-muted",
  },
  {
    name: "GitHub",
    icon: <GitHubIcon />,
    className: "bg-[#1f2328] text-white hover:bg-[#1f2328]/90 dark:bg-[#2d333b] dark:hover:bg-[#2d333b]/90",
  },
  {
    name: "Apple",
    icon: <AppleIcon />,
    className: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
  },
  {
    name: "Microsoft",
    icon: <MicrosoftIcon />,
    className: "border border-border bg-background text-foreground hover:bg-muted",
  },
];

export function AuthSocialLoginPanel({ className }: AuthSocialLoginPanelProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Sign in to continue</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use one of your connected accounts.</p>
      </div>

      <div className="mt-6 space-y-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            type="button"
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              provider.className,
            )}
          >
            {provider.icon}
            Continue with {provider.name}
          </button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-3" role="separator" aria-orientation="horizontal">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Continue with email
      </button>
    </div>
  );
}

export default AuthSocialLoginPanel;
