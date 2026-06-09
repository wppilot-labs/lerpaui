import React from 'react';
import { motion} from "framer-motion";
import { Card, CardContent } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { Container } from '../components/Container';
import { Terminal, Shield, Zap, Globe, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  badge?: string;
}

export interface FeatureBentoGridProps {
  tag?: string;
  title?: string;
  description?: string;
  items?: BentoItem[];
}

const defaultItems: BentoItem[] = [
  {
    id: '1',
    title: 'Lightning Fast Speeds',
    description: 'Optimize your performance with custom compilers and Edge delivery networks designed for sub-millisecond reactions.',
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    className: 'md:col-span-2 md:row-span-1 bg-amber-500/5 hover:border-amber-500/30',
    badge: 'Performance',
  },
  {
    id: '2',
    title: 'Developer Console',
    description: 'A powerful interactive CLI toolchain that helps you deploy and inspect instantly.',
    icon: <Terminal className="h-6 w-6 text-blue-500" />,
    className: 'md:col-span-1 md:row-span-1 bg-blue-500/5 hover:border-blue-500/30',
  },
  {
    id: '3',
    title: 'Zero-Trust Security',
    description: 'We safeguard your databases with built-in active encryption, biometric passkeys, and multi-region backups.',
    icon: <Shield className="h-6 w-6 text-emerald-500" />,
    className: 'md:col-span-1 md:row-span-2 bg-emerald-500/5 hover:border-emerald-500/30 flex-col justify-between',
    badge: 'Security',
  },
  {
    id: '4',
    title: 'Global Scale Node Network',
    description: 'Serve your application globally with over 150 low-latency edge caching regions mapped automatically.',
    icon: <Globe className="h-6 w-6 text-purple-500" />,
    className: 'md:col-span-2 md:row-span-1 bg-purple-500/5 hover:border-purple-500/30',
  },
  {
    id: '5',
    title: 'Neural Core AI Systems',
    description: 'Powered by highly optimized inference models yielding context-aware automated coding operations.',
    icon: <Cpu className="h-6 w-6 text-indigo-500" />,
    className: 'md:col-span-2 md:row-span-1 bg-indigo-500/5 hover:border-indigo-500/30',
    badge: 'AI Powered',
  },
];

export function FeatureBentoGrid({
  tag = 'Platform Capabilities',
  title = 'Engineered for the Modern Web',
  description = 'Everything you need to ship highly interactive, responsive applications at global scale without the operations tax.',
  items = defaultItems,
}: FeatureBentoGridProps) {
  return (
    <section className="py-20 bg-background">
      <Container>
        <SectionHeader tag={tag} title={title} description={description} align="center" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex h-full"
            >
              <Card
                className={cn(
                  'w-full hover:shadow-md transition-all duration-300 border border-border flex flex-col justify-between overflow-hidden',
                  item.className
                )}
              >
                <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-background rounded-lg shadow-sm w-fit border border-border">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-border bg-background">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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
