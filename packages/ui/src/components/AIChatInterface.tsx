"use client";

import React, { useEffect, useRef, useState } from "react";

export type AIChatRole = "user" | "assistant" | "system";

export interface AIChatMessage {
  id: string;
  role: AIChatRole;
  content: string;
  timestamp?: string;
  streaming?: boolean;
  toolCall?: { tool: string; status: "running" | "done"; detail?: string };
}

export interface AIChatInterfaceProps {
  messages?: AIChatMessage[];
  model?: string;
  agentName?: string;
  status?: "idle" | "thinking" | "streaming";
  accent?: string;
  height?: number | string;
  placeholder?: string;
  onSend?: (text: string) => void;
}

const DEFAULT_MESSAGES: AIChatMessage[] = [
  { id: "m1", role: "user", content: "Build me a settings page with billing tabs and team management.", timestamp: "12:14 PM" },
  {
    id: "m2",
    role: "assistant",
    content: "On it — using `SidebarLayoutBasic` plus `BillingPlanLimitAlert` for the top strip. Wiring two tabs.",
    timestamp: "12:14 PM",
    toolCall: { tool: "lerpa add", status: "done", detail: "3 files · 9.6 kB" },
  },
  { id: "m3", role: "user", content: "Make it themed lime.", timestamp: "12:15 PM" },
  {
    id: "m4",
    role: "assistant",
    content: "Theme applied. 1235 components re-tokened in 4 ms.",
    timestamp: "12:15 PM",
    streaming: true,
  },
];

export function AIChatInterface({
  messages = DEFAULT_MESSAGES,
  model = "claude-opus-4-7",
  agentName = "claude · with lerpa",
  status = "streaming",
  accent = "var(--accent)",
  height = 480,
  placeholder = "Ship a pricing page with monthly toggle…",
  onSend,
}: AIChatInterfaceProps) {
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  return (
    <div
      role="region"
      aria-label="AI chat conversation"
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 30px 60px -20px rgba(0,0,0,0.5), 0 0 60px -16px ${accent}`,
        width: "100%",
        maxWidth: 560,
        display: "flex",
        flexDirection: "column",
        height,
      }}
    >
      {/* head */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          borderBottom: "1px solid var(--edge)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--text-3)",
          flexShrink: 0,
        }}
      >
        <span style={{ display: "flex", gap: 4 }} aria-hidden="true">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mint)" }} />
        </span>
        <span style={{ color: "var(--text)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{agentName}</span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 3,
            background: "var(--bg-3)",
            color: "var(--text-3)",
            fontSize: 10,
            letterSpacing: "0.05em",
          }}
        >
          {model}
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: accent, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, animation: "pulse-dot 1.4s ease-in-out infinite" }} />
          {status}
        </span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flex: 1, minHeight: 0 }}
      >
        {messages.map((m) => (
          <MessageRow key={m.id} m={m} accent={accent} />
        ))}
      </div>

      {/* foot */}
      <form
        onSubmit={submit}
        style={{
          borderTop: "1px solid var(--edge)",
          padding: 12,
          display: "flex",
          gap: 10,
          background: "var(--bg)",
          flexShrink: 0,
        }}
      >
        <label htmlFor="ai-chat-inp" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          Chat input
        </label>
        <input
          id="ai-chat-inp"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            height: 44,
            padding: "0 12px",
            background: "var(--bg-2)",
            border: "1px solid var(--edge-2)",
            borderRadius: 8,
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!input.trim()}
          style={{
            height: 44,
            width: 44,
            display: "grid",
            placeItems: "center",
            background: accent,
            color: "var(--bg)",
            border: 0,
            borderRadius: 8,
            cursor: input.trim() ? "pointer" : "not-allowed",
            opacity: input.trim() ? 1 : 0.5,
            boxShadow: input.trim() ? `0 0 14px -4px ${accent}` : "none",
            transition: "all 0.15s",
          }}
        >
          →
        </button>
      </form>
    </div>
  );
}

const MessageRow = React.memo(function MessageRow({ m, accent }: { m: AIChatMessage; accent: string }) {
  const isUser = m.role === "user";
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "92%", alignSelf: isUser ? "flex-end" : "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          background: isUser ? "var(--bg-4)" : accent,
          color: isUser ? "var(--text-2)" : "var(--bg)",
          border: isUser ? "1px solid var(--edge-2)" : "none",
          boxShadow: isUser ? "none" : `0 0 14px -4px ${accent}`,
        }}
        aria-hidden="true"
      >
        {isUser ? "U" : "∗"}
      </div>
      <div
        style={{
          padding: "10px 14px",
          background: isUser ? "var(--bg-4)" : "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 12,
          color: "var(--text)",
          fontSize: 13.5,
          lineHeight: 1.5,
          minWidth: 0,
        }}
      >
        <div style={{ wordBreak: "break-word" }}>
          {m.content}
          {m.streaming ? <span style={{ display: "inline-block", width: 6, height: 14, marginLeft: 4, background: accent, verticalAlign: -2, animation: "cursor-blink 1.05s steps(2) infinite" }} aria-hidden="true" /> : null}
        </div>
        {m.toolCall ? (
          <div
            style={{
              marginTop: 8,
              padding: "8px 10px",
              borderLeft: `2px solid ${accent}`,
              background: "var(--bg-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              color: "var(--text-2)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div style={{ color: accent, fontWeight: 500 }}>
              ▶ {m.toolCall.tool}{" "}
              <span style={{ color: m.toolCall.status === "done" ? accent : "var(--amber)" }}>
                {m.toolCall.status === "done" ? "✓" : "…"}
              </span>
            </div>
            {m.toolCall.detail ? <div style={{ color: "var(--text-3)" }}>{m.toolCall.detail}</div> : null}
          </div>
        ) : null}
        {m.timestamp ? (
          <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>{m.timestamp}</div>
        ) : null}
      </div>
    </div>
  );
});
