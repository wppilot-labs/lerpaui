"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { Container } from '../components/Container';
import { usePrefersReducedMotion } from '../animation/hooks';
import { Palette, Code2, Globe, Cpu, ArrowUpRight, Megaphone, Settings } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

export interface ServicesGridProps {
  tag?: string;
  title?: string;
  description?: string;
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    id: '1',
    title: 'Brand Strategy & UI Design',
    description: 'Flawless visual architectures, custom branding kits, and user research designed to position your product as the absolute market leader.',
    icon: <Palette className="h-6 w-6 text-primary" />,
  },
  {
    id: '2',
    title: 'Full-Stack Software Engineering',
    description: 'High-performance React/Next.js architectures, edge telemetry hubs, and secure DB endpoints constructed using strict clean coding conventions.',
    icon: <Code2 className="h-6 w-6 text-indigo-500" />,
  },
  {
    id: '3',
    title: 'Global Performance Tuning',
    description: 'Detailed audit profiles checking bundle compilation sizes, edge routing paths, and database queries to target sub-100ms load responses.',
    icon: <Globe className="h-6 w-6 text-emerald-500" />,
  },
  {
    id: '4',
    title: 'Automated AI Core Pipelines',
    description: 'Custom implementation connecting neural model inferences straight into your database records for predictive workflow automation.',
    icon: <Cpu className="h-6 w-6 text-violet-500" />,
  },
  {
    id: '5',
    title: 'Growth Marketing & Copywriting',
    description: 'Data-driven search optimization, landing page experiments, and persuasive messaging designed to convert cold visitors into core customers.',
    icon: <Megaphone className="h-6 w-6 text-amber-500" />,
  },
  {
    id: '6',
    title: 'Active Retainers & SLA Operations',
    description: 'Round-the-clock monitoring and preventative security patches ensuring 99.9% uptime compliance with corporate SLA guidelines.',
    icon: <Settings className="h-6 w-6 text-sky-500" />,
  },
];

export function ServicesGrid({
  tag = 'Premium Design Services',
  title = 'Our Creative Expertise',
  description = 'We combine strategic branding, deep full-stack engineering, and performance optimizations to deliver digital growth.',
  services = defaultServices,
}: ServicesGridProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <section className="py-20 bg-background/50 border-t border-border">
      <Container>
        <SectionHeader tag={tag} title={title} description={description} align="center" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: reduced ? 0 : index * 0.08 }}
              className="flex"
            >
              <Card className="group relative overflow-hidden w-full border border-border bg-card hover:bg-muted/10 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <CardContent className="p-8 flex flex-col justify-between h-full gap-6">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-muted rounded-xl border border-border/80 text-foreground group-hover:scale-105 transition-transform">
                      {service.icon}
                    </div>
                    <button
                      type="button"
                      aria-label={`Learn more about ${service.title}`}
                      className="p-1.5 rounded-full bg-muted border border-border/80 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all text-muted-foreground hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
