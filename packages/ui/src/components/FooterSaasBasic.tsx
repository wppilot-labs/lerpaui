"use client";

import React from "react";
import { Hexagon, Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { cn } from "../lib/cn";

export interface FooterSaasBasicProps {
  className?: string;
}

interface Column {
  title: string;
  links: string[];
}

const COLUMNS: Column[] = [
  { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Documentation", "Help center", "Community", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

const SOCIALS = [
  { label: "Twitter", icon: Twitter },
  { label: "GitHub", icon: Github },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
];

export function FooterSaasBasic({ className }: FooterSaasBasicProps) {
  return (
    <footer
      aria-label="Site footer"
      className={cn("w-full border-t border-border bg-background text-foreground", className)}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Hexagon className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold text-foreground">Lumen</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The all-in-one platform that helps modern teams ship faster and scale with confidence.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Lumen Technologies, Inc.</p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSaasBasic;
