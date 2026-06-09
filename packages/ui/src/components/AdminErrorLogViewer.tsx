"use client";

import React, { useState } from "react";
import { Bug, ChevronRight, AlertOctagon, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

type Level = "error" | "warn";
type LogEntry = {
  id: string;
  level: Level;
  message: string;
  service: string;
  time: string;
  count: number;
  stack: string[];
};

const LOGS: LogEntry[] = [
  {
    id: "1",
    level: "error",
    message: "TypeError: Cannot read properties of undefined (reading 'id')",
    service: "checkout-api",
    time: "12:04:51",
    count: 23,
    stack: [
      "at resolveCart (services/cart.ts:88:17)",
      "at async POST /v1/checkout (routes/checkout.ts:42:9)",
      "at async runMiddleware (lib/server.ts:210:5)",
    ],
  },
  {
    id: "2",
    level: "error",
    message: "ECONNREFUSED redis:6379",
    service: "session-store",
    time: "11:58:02",
    count: 4,
    stack: [
      "at TCPConnectWrap.afterConnect (net.js:1146:16)",
      "at RedisClient.connect (lib/redis.ts:54:11)",
    ],
  },
  {
    id: "3",
    level: "warn",
    message: "Slow query exceeded 2000ms threshold",
    service: "reporting-worker",
    time: "11:51:33",
    count: 11,
    stack: ["at QueryRunner.execute (db/runner.ts:131:7)"],
  },
];

const LEVEL_STYLES: Record<Level, { tone: string; bg: string; Icon: typeof Bug }> = {
  error: { tone: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20", Icon: AlertOctagon },
  warn: { tone: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", Icon: AlertTriangle },
};

export interface AdminErrorLogViewerProps {
  className?: string;
}

export function AdminErrorLogViewer({ className }: AdminErrorLogViewerProps) {
  const [expanded, setExpanded] = useState<string | null>("1");

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Bug className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Error log</h3>
        <span className="ml-auto text-xs text-muted-foreground">last 15 min</span>
      </div>

      <ul className="divide-y divide-border">
        {LOGS.map((log) => {
          const { tone, bg, Icon } = LEVEL_STYLES[log.level];
          const isOpen = expanded === log.id;
          return (
            <li key={log.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : log.id)}
                className="w-full flex items-start gap-2.5 px-5 py-3.5 text-left hover:bg-muted transition-colors"
              >
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", tone)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-snug break-words">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{log.service}</span>
                    <span>·</span>
                    <span className="tabular-nums">{log.time}</span>
                    <span
                      className={cn(
                        "ml-auto px-1.5 py-0.5 rounded border text-[11px] font-semibold tabular-nums",
                        bg,
                        tone,
                      )}
                    >
                      ×{log.count}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-muted-foreground mt-0.5 transition-transform shrink-0",
                    isOpen && "rotate-90",
                  )}
                />
              </button>
              {isOpen && (
                <pre className="mx-5 mb-3 px-3 py-2.5 rounded-lg bg-muted border border-border text-[11px] leading-relaxed font-mono text-muted-foreground overflow-x-auto">
                  {log.stack.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </pre>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
