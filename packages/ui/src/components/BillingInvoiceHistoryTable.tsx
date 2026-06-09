"use client";

import { Download, FileText } from "lucide-react";
import { cn } from "../lib/cn";

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "due" | "refunded";
};

const INVOICES: Invoice[] = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$29.00", status: "paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$29.00", status: "paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$29.00", status: "refunded" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$29.00", status: "paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "$19.00", status: "due" },
];

const STATUS_STYLE: Record<Invoice["status"], string> = {
  paid: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  due: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  refunded: "text-muted-foreground bg-foreground/[0.05]",
};

export interface BillingInvoiceHistoryTableProps {
  className?: string;
}

export function BillingInvoiceHistoryTable({ className }: BillingInvoiceHistoryTableProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Invoice history</h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.04] text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-3 py-2.5">Invoice</th>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5">Amount</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-foreground/[0.04] transition-colors">
                <td className="px-3 py-3 font-mono text-xs font-semibold">{inv.id}</td>
                <td className="px-3 py-3 text-muted-foreground">{inv.date}</td>
                <td className="px-3 py-3 font-semibold">{inv.amount}</td>
                <td className="px-3 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold capitalize", STATUS_STYLE[inv.status])}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    aria-label={`Download invoice ${inv.id}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
