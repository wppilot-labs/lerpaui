"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Shield, Award, FileText, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AccreditationItem {
  id: string;
  title: string;
  issuer: string;
  description: string;
  code: string; // e.g. 'SOC 2 Type II'
  status: 'active' | 'pending' | 'verified';
  glowColor?: string; // neon color, e.g. '#3b82f6'
  link?: string;
  iconName?: 'shield' | 'award' | 'document' | 'lock' | 'check';
}

export interface AccreditationTrustBadgeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: AccreditationItem[];
  title?: string;
  subtitle?: string;
}

const defaultAccreditations: AccreditationItem[] = [
  {
    id: 'soc2',
    title: 'Security & Operations Governance',
    issuer: 'AICPA Standards Office',
    code: 'SOC 2 Type II Certified',
    description: 'Undergoes rigorous annual independent audits verifying optimal infrastructure security controls, availability thresholds, and privacy firewalls.',
    status: 'verified',
    glowColor: '#6366f1', // indigo
    iconName: 'shield',
    link: 'https://aicpa.org'
  },
  {
    id: 'iso27001',
    title: 'Information Security Management',
    issuer: 'ISO/IEC Standards Board',
    code: 'ISO/IEC 27001 Certified',
    description: 'Certified security management systems guarding sensitive internal intellectual assets and cloud orchestration files from vectors.',
    status: 'verified',
    glowColor: '#3b82f6', // blue
    iconName: 'lock',
    link: 'https://iso.org'
  },
  {
    id: 'gdpr',
    title: 'Data Protection & Privacy Policy',
    issuer: 'EU GDPR Standards compliance',
    code: 'GDPR / CCPA Compliant',
    description: 'Full data portability, cookie controls, dynamic consent headers, and strict operational zero-knowledge pipelines safeguarding customer telemetry.',
    status: 'active',
    glowColor: '#10b981', // emerald
    iconName: 'document',
    link: 'https://gdpr.info'
  },
  {
    id: 'pci',
    title: 'Financial Transaction Integrity',
    issuer: 'PCI Security Standards Council',
    code: 'PCI-DSS Level 1 Secure',
    description: 'Military-grade end-to-end tokenized processing channels routing customer credit information under high security parameters.',
    status: 'verified',
    glowColor: '#ec4899', // pink
    iconName: 'award',
    link: 'https://pcisecuritystandards.org'
  }
];

const iconMap = {
  shield: Shield,
  lock: Lock,
  document: FileText,
  award: Award,
  check: CheckCircle2,
};

export const AccreditationTrustBadgeGrid: React.FC<AccreditationTrustBadgeGridProps> = ({
  items = defaultAccreditations,
  title = "Compliance, Trust & Security",
  subtitle = "Our engineering systems are continuously audited, verified, and hardened to exceed standard global information safety parameters.",
  className,
  ...props
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground py-16 px-4 md:px-8 max-w-6xl mx-auto",
        className
      )}
      {...props}
    >
      {/* Grid header details */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Accreditation Portal</span>
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight mt-3">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Grid badge layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const Icon = iconMap[item.iconName || 'shield'] || Shield;
          const isHovered = hoveredId === item.id;
          const color = item.glowColor || '#6366f1';

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "relative rounded-2xl p-6 bg-card/60 border border-border/50 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between select-none overflow-hidden group shadow-sm hover:shadow-md"
              )}
            >
              {/* Radial Neon Glow Background on Hover */}
              <div
                className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"
                style={{
                  background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), ${color} 0%, transparent 100%)`,
                }}
              />
              
              {/* Neon border highlight outline on hover */}
              {isHovered && !prefersReducedMotion && (
                <motion.div
                  layoutId="acc-glow"
                  className="absolute inset-0 rounded-2xl border-2 border-solid pointer-events-none z-10"
                  style={{
                    borderColor: color,
                    filter: `drop-shadow(0 0 4px ${color})`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative z-20">
                {/* Header details */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted"
                      style={{ color: isHovered ? color : undefined }}
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold tracking-tight text-foreground">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground/80 font-semibold">{item.issuer}</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      item.status === 'verified' && "bg-emerald-500/10 text-emerald-500",
                      item.status === 'active' && "bg-blue-500/10 text-blue-500",
                      item.status === 'pending' && "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Certification highlights code */}
                <div 
                  className="inline-block mt-4 text-[10px] font-black tracking-wide uppercase px-2 py-1 rounded bg-muted/70 text-foreground border border-border/40"
                  style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                >
                  {item.code}
                </div>

                {/* Info summary body */}
                <p className="text-xs leading-relaxed text-muted-foreground mt-4">
                  {item.description}
                </p>
              </div>

              {/* Verified certificate check badge Link */}
              {item.link && (
                <div className="relative z-20 flex items-center justify-between mt-6 pt-4 border-t border-border/20">
                  <span className="text-[10px] font-extrabold text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Compliance Verified</span>
                  </span>
                  
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    <span>Audit Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

