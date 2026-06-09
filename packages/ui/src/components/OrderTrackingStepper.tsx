"use client";

import React from "react";

export interface OrderTrackingStep {
  id: string;
  label: string;
  detail?: string;
  timestamp?: string;
}

export interface OrderTrackingStepperProps {
  steps: OrderTrackingStep[];
  currentStepIndex: number;
  orderId?: string;
}

const DEFAULT_STEPS: OrderTrackingStep[] = [
  { id: "placed", label: "Placed", detail: "Order confirmed", timestamp: "Mon · 10:14" },
  { id: "packed", label: "Packed", detail: "Picker assigned", timestamp: "Mon · 11:32" },
  { id: "shipped", label: "Shipped", detail: "DHL · 2-day", timestamp: "Mon · 17:08" },
  { id: "transit", label: "In transit", detail: "Sorting facility · NYC", timestamp: "Tue · 04:21" },
  { id: "delivered", label: "Delivered", detail: "Front door · signed", timestamp: "Wed · 14:55" },
];

export function OrderTrackingStepper({
  steps = DEFAULT_STEPS,
  currentStepIndex = 3,
  orderId = "ORD-4213-LMN",
}: Partial<OrderTrackingStepperProps>) {
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 24,
        fontFamily: "var(--font-sans)",
        maxWidth: 720,
      }}
      role="region"
      aria-label="Order tracking"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 24,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>● tracking · {orderId}</span>
        <span style={{ color: "var(--accent)" }}>{steps[currentStepIndex]?.label ?? "Pending"}</span>
      </div>

      <ol
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: 0,
          listStyle: "none",
          padding: 0,
          margin: 0,
          position: "relative",
        }}
      >
        {/* connector line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 16,
            left: `calc(${100 / steps.length / 2}%)`,
            right: `calc(${100 / steps.length / 2}%)`,
            height: 2,
            background: "var(--bg-4)",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 16,
            left: `calc(${100 / steps.length / 2}%)`,
            width: `calc((100% - ${100 / steps.length}%) * ${currentStepIndex / Math.max(steps.length - 1, 1)})`,
            height: 2,
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent-glow)",
            zIndex: 1,
            transition: "width 0.4s ease",
          }}
        />

        {steps.map((step, idx) => {
          const done = idx <= currentStepIndex;
          const active = idx === currentStepIndex;
          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: done ? "var(--accent)" : "var(--bg-4)",
                  border: `2px solid ${done ? "var(--accent)" : "var(--edge-2)"}`,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: done ? "var(--bg)" : "var(--text-3)",
                  boxShadow: active ? "0 0 18px -2px var(--accent-glow)" : "none",
                  transition: "all 0.3s",
                }}
              >
                {done ? "✓" : idx + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: done ? "var(--text)" : "var(--text-3)",
                  textAlign: "center",
                }}
              >
                {step.label}
              </span>
              {step.detail ? (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-4)",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {step.detail}
                </span>
              ) : null}
              {step.timestamp ? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-4)" }}>
                  {step.timestamp}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
