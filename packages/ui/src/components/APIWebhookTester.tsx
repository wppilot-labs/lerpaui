"use client";

import React, { useState } from "react";
import { Webhook, Send, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

const EVENTS = [
  "customer.created",
  "payment.succeeded",
  "payment.failed",
  "subscription.updated",
];

const PAYLOAD = `{
  "event": "payment.succeeded",
  "data": { "amount": 4900, "currency": "usd" }
}`;

export interface APIWebhookTesterProps {
  className?: string;
}

export function APIWebhookTester({ className }: APIWebhookTesterProps) {
  const reduced = usePrefersReducedMotion();
  const [event, setEvent] = useState(EVENTS[1]);
  const [endpoint, setEndpoint] = useState("https://acme.co/api/hooks");
  const [status, setStatus] = useState<"idle" | "sending" | "ok">("idle");

  const send = () => {
    setStatus("sending");
    window.setTimeout(() => setStatus("ok"), reduced ? 0 : 800);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Webhook className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Test webhook</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="wh-endpoint" className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
            Endpoint URL
          </label>
          <input
            id="wh-endpoint"
            value={endpoint}
            onChange={(e) => {
              setEndpoint(e.target.value);
              setStatus("idle");
            }}
            className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-xs font-mono focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="wh-event" className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
            Event type
          </label>
          <select
            id="wh-event"
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
              setStatus("idle");
            }}
            className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-primary/50 focus:outline-none appearance-none"
          >
            {EVENTS.map((e) => (
              <option key={e} value={e} className="bg-card text-foreground">
                {e}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
            Sample payload
          </span>
          <pre className="bg-muted border border-border rounded-xl px-3 py-2.5 text-xs leading-relaxed font-mono text-muted-foreground overflow-x-auto">
            {PAYLOAD}
          </pre>
        </div>
      </div>

      <button
        type="button"
        onClick={send}
        disabled={status === "sending"}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "sending" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Send test event
      </button>

      {status === "ok" && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Delivered · 200 OK · 142 ms</span>
        </div>
      )}
    </div>
  );
}
