"use client";

import React from "react";
import { Webhook, RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

type Delivery = {
  id: string;
  event: string;
  status: number;
  endpoint: string;
  attempt: number;
  time: string;
};

const DELIVERIES: Delivery[] = [
  { id: "d_91f", event: "invoice.paid", status: 200, endpoint: "/hooks/billing", attempt: 1, time: "12:41:02" },
  { id: "d_91e", event: "customer.created", status: 200, endpoint: "/hooks/crm", attempt: 1, time: "12:39:55" },
  { id: "d_91c", event: "subscription.updated", status: 500, endpoint: "/hooks/billing", attempt: 3, time: "12:38:10" },
  { id: "d_91a", event: "charge.refunded", status: 408, endpoint: "/hooks/billing", attempt: 2, time: "12:35:47" },
  { id: "d_918", event: "user.deleted", status: 200, endpoint: "/hooks/crm", attempt: 1, time: "12:31:20" },
];

function statusTone(code: number) {
  if (code >= 200 && code < 300) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
  if (code >= 400 && code < 500) return "text-amber-600 dark:text-amber-400 bg-amber-500/10";
  return "text-red-600 dark:text-red-400 bg-red-500/10";
}

export interface AdminWebhookDeliveryLogProps {
  className?: string;
}

export function AdminWebhookDeliveryLog({ className }: AdminWebhookDeliveryLogProps) {
  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card border border-border rounded-2xl shadow-sm font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Webhook className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Webhook deliveries</h3>
        <button
          type="button"
          aria-label="Refresh deliveries"
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-5 py-2.5">Event</th>
              <th className="px-3 py-2.5">Endpoint</th>
              <th className="px-3 py-2.5 text-center">Try</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-5 py-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {DELIVERIES.map((d) => (
              <tr key={d.id} className="hover:bg-muted transition-colors">
                <td className="px-5 py-3 font-mono font-semibold">{d.event}</td>
                <td className="px-3 py-3 font-mono text-muted-foreground">{d.endpoint}</td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                  {d.attempt > 1 ? <span className="text-amber-600 dark:text-amber-400">{d.attempt}</span> : d.attempt}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 rounded text-xs font-bold tabular-nums",
                      statusTone(d.status),
                    )}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                  {d.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
