"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Server, Cpu, HardDrive, Wifi, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

export interface DashboardServerHealthMonitorProps {
  className?: string;
}

const SERVERS = [
  { name: "api-prod-01", region: "us-east", status: "ok", cpu: 42, mem: 68, latency: 18, uptime: "142d" },
  { name: "api-prod-02", region: "us-west", status: "ok", cpu: 38, mem: 62, latency: 22, uptime: "142d" },
  { name: "db-primary", region: "eu-west", status: "warn", cpu: 78, mem: 84, latency: 31, uptime: "98d" },
  { name: "worker-01", region: "ap-south", status: "ok", cpu: 28, mem: 41, latency: 14, uptime: "12d" },
  { name: "cdn-edge", region: "global", status: "ok", cpu: 18, mem: 33, latency: 8, uptime: "212d" },
];

function statusColor(s: string) {
  if (s === "ok") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (s === "warn") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
}

function barColor(v: number) {
  if (v >= 80) return "bg-rose-500";
  if (v >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

export function DashboardServerHealthMonitor({ className }: DashboardServerHealthMonitorProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Server health"
      className={cn(
        "w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <header className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Server health</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">5 nodes · 99.98% uptime · last 30 days</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500">
          <CheckCircle2 className="h-3 w-3" /> Operational
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {SERVERS.map((s, i) => (
          <motion.article
            key={s.name}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="rounded-xl border bg-muted/20 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.region} · uptime {s.uptime}</p>
              </div>
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", statusColor(s.status))}>
                {s.status === "ok" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {s.status === "ok" ? "Healthy" : "Warning"}
              </span>
            </div>

            <div className="space-y-2">
              <Bar label="CPU" icon={Cpu} value={s.cpu} barClass={barColor(s.cpu)} />
              <Bar label="Mem" icon={HardDrive} value={s.mem} barClass={barColor(s.mem)} />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Wifi className="h-3 w-3" /> Latency</span>
                <span className="tabular-nums text-foreground">{s.latency}ms</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Bar({ label, icon: Icon, value, barClass }: { label: string; icon: React.ElementType; value: number; barClass: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-14 items-center gap-1 text-[11px] text-muted-foreground"><Icon className="h-3 w-3" /> {label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-muted/40 overflow-hidden">
        <div className={cn("h-full rounded-full", barClass)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-right text-[11px] tabular-nums text-foreground">{value}%</span>
    </div>
  );
}

export default DashboardServerHealthMonitor;
