"use client";

import React from "react";

export interface ProfileSocial {
  id: string;
  label: string;
  href?: string;
  icon: string;
}

export interface ProfileAvatarCardProps {
  name?: string;
  role?: string;
  bio?: string;
  initials?: string;
  status?: "online" | "busy" | "away" | "offline";
  socials?: ProfileSocial[];
  accent?: string;
  onMessage?: () => void;
  onFollow?: () => void;
}

const STATUS_COLOR: Record<NonNullable<ProfileAvatarCardProps["status"]>, string> = {
  online: "var(--mint)",
  busy: "var(--pink)",
  away: "var(--amber)",
  offline: "var(--text-4)",
};

const DEFAULT_SOCIALS: ProfileSocial[] = [
  { id: "x", label: "X / Twitter", icon: "𝕏" },
  { id: "gh", label: "GitHub", icon: "GH" },
  { id: "li", label: "LinkedIn", icon: "in" },
];

export function ProfileAvatarCard({
  name = "Ada Reyes",
  role = "Staff Frontend · Lerpa UI",
  bio = "Shipping motion-rich React UI since '14. Currently obsessing over reduced-motion fallbacks and design tokens.",
  initials = "AR",
  status = "online",
  socials = DEFAULT_SOCIALS,
  accent = "var(--accent)",
  onMessage,
  onFollow,
}: ProfileAvatarCardProps) {
  const statusColor = STATUS_COLOR[status];

  return (
    <div
      role="figure"
      aria-label={`${name}, ${role}`}
      style={{
        width: "100%",
        maxWidth: 340,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 16,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -16px ${accent}`,
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: 76,
          background: `linear-gradient(135deg, ${accent}, var(--violet) 55%, var(--pink))`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
            opacity: 0.5,
          }}
        />
      </div>
      <div style={{ padding: "0 18px 18px", marginTop: -28 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div
            style={{
              position: "relative",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "var(--bg-3)",
              border: `2px solid var(--bg-2)`,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text)",
              boxShadow: `0 8px 20px -8px rgba(0,0,0,0.5)`,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {initials}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: statusColor,
                border: "2px solid var(--bg-2)",
                boxShadow: `0 0 8px ${statusColor}`,
                animation: status === "online" ? "pulse-dot 1.8s ease-in-out infinite" : undefined,
              }}
            />
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingBottom: 4 }}>
            <div style={{ fontSize: 15.5, color: "var(--text)", fontWeight: 600, lineHeight: 1.2 }}>{name}</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-3)",
                marginTop: 3,
                letterSpacing: "0.02em",
              }}
            >
              {role}
            </div>
          </div>
        </div>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 13,
            color: "var(--text-2)",
            lineHeight: 1.55,
          }}
        >
          {bio}
        </p>
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--edge)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onMessage}
            style={{
              flex: 1,
              height: 34,
              background: accent,
              color: "var(--bg)",
              border: 0,
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: `0 0 14px -4px ${accent}`,
              fontFamily: "var(--font-sans)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Message
          </button>
          <button
            type="button"
            onClick={onFollow}
            style={{
              flex: 1,
              height: 34,
              background: "transparent",
              color: "var(--text)",
              border: "1px solid var(--edge-2)",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--edge-2)";
              e.currentTarget.style.color = "var(--text)";
            }}
          >
            Follow
          </button>
          <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href ?? "#"}
                onClick={(e) => !s.href && e.preventDefault()}
                aria-label={s.label}
                style={{
                  width: 30,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--bg-3)",
                  border: "1px solid var(--edge)",
                  borderRadius: 7,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--edge)";
                  e.currentTarget.style.color = "var(--text-3)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
