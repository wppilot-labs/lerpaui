"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Mail, Linkedin, Twitter, Globe, Search, ArrowRight, User } from 'lucide-react';
import { cn } from '../lib/cn';

export interface RosterMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image?: string;
  bio: string;
  keyMetric?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    website?: string;
  };
}

export interface StructuredRosterGridProps extends React.HTMLAttributes<HTMLDivElement> {
  members?: RosterMember[];
  title?: string;
  subtitle?: string;
  departments?: string[];
  enableSearch?: boolean;
}

const defaultMembers: RosterMember[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Chief Executive Officer',
    department: 'Leadership',
    bio: 'Sarah leads with 15+ years of building venture-backed infrastructure startups and scaling remote engineering teams globally.',
    keyMetric: 'ex-Stripe • Wharton MBA',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'sarah@company.com'
    }
  },
  {
    id: '2',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    department: 'Engineering',
    bio: 'Marcus oversees all cloud services, pipeline orchestration architectures, and devops processes, pushing standard deployment bounds.',
    keyMetric: '12 patents • Rust Core contributor',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'marcus@company.com'
    }
  },
  {
    id: '3',
    name: 'Aiko Tanaka',
    role: 'Principal UX Architect',
    department: 'Design',
    bio: 'Aiko crafts interactive canvases and fluid designs, bridging the gap between tactile physical feelings and virtual product interactions.',
    keyMetric: 'Red Dot Winner • ex-Apple',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://aiko.design'
    }
  },
  {
    id: '4',
    name: 'Elena Rostova',
    role: 'Director of Growth',
    department: 'Marketing',
    bio: 'Elena directs client acquisitions and brand engagement. She loves using performance graphs and conversion metrics to scale markets.',
    keyMetric: '+320% funnel lift in 12 months',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'elena@company.com'
    }
  },
  {
    id: '5',
    name: 'David Chen',
    role: 'Senior Staff Engineer',
    department: 'Engineering',
    bio: 'David focuses on edge analytics and WebGL hardware rendering systems, bringing physical simulation logic to browser viewports.',
    keyMetric: 'ex-Netflix • WebGL Lead',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'david@company.com'
    }
  },
  {
    id: '6',
    name: 'Clarissa Montgomery',
    role: 'Lead Visual Designer',
    department: 'Design',
    bio: 'Clarissa translates high-level corporate visions into stunning brand identities, vector libraries, and modern system palettes.',
    keyMetric: '10+ years experience • RISD Graduate',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    socials: {
      linkedin: 'https://linkedin.com',
      website: 'https://clarissa.co'
    }
  }
];

export const StructuredRosterGrid: React.FC<StructuredRosterGridProps> = ({
  members = defaultMembers,
  title = "Our Leadership & Experts",
  subtitle = "Meet the world-class architects and technologists driving operational breakthroughs and shaping future canvas engines.",
  departments = ["All", "Leadership", "Engineering", "Design", "Marketing"],
  enableSearch = true,
  className,
  ...props
}) => {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBioId, setActiveBioId] = useState<string | null>(null);
  
  const prefersReducedMotion = usePrefersReducedMotion();

  // Filter roster items based on category and search query
  const filteredMembers = members.filter((m) => {
    const matchesDept = selectedDept === "All" || m.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground py-16 px-4 md:px-8 max-w-7xl mx-auto",
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
            Corporate Team
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3">
            {title}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Search Field */}
        {enableSearch && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl pl-9 pr-4 py-2 text-xs font-medium outline-none transition-all placeholder:text-muted-foreground/80"
            />
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => {
              setSelectedDept(dept);
              setActiveBioId(null);
            }}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all relative",
              selectedDept === dept
                ? "text-primary-foreground bg-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Roster Grid */}
      <motion.div 
        layout={!prefersReducedMotion}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member) => {
            const isBioExpanded = activeBioId === member.id;
            
            return (
              <motion.div
                layout={!prefersReducedMotion}
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "group relative bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/40 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md",
                  isBioExpanded && "ring-1 ring-primary/40 border-primary/40"
                )}
              >
                <div>
                  {/* Card Header Roster details */}
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-muted/80 flex-shrink-0 relative border border-border/40">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-muted-foreground/90 font-medium">
                        {member.role}
                      </p>
                      <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Metric */}
                  {member.keyMetric && (
                    <div className="mt-4 bg-muted/30 border border-border/30 rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-foreground tracking-wide">
                      {member.keyMetric}
                    </div>
                  )}

                  {/* Expandable Bio Drawer block */}
                  <div className="mt-4">
                    <p className={cn(
                      "text-xs leading-relaxed text-muted-foreground transition-all duration-300",
                      isBioExpanded ? "" : "line-clamp-2"
                    )}>
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Card Footer Socials & Expander CTA */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    {member.socials?.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials?.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials?.email && (
                      <a
                        href={`mailto:${member.socials.email}`}
                        className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials?.website && (
                      <a
                        href={member.socials.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveBioId(isBioExpanded ? null : member.id)}
                    className="text-[10px] font-black text-primary flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{isBioExpanded ? "Show Less" : "Read Bio"}</span>
                    <ArrowRight className={cn(
                      "w-3 h-3 transition-transform",
                      isBioExpanded ? "rotate-90" : "group-hover:translate-x-0.5"
                    )} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-muted/10">
          <p className="text-sm font-semibold text-muted-foreground">No team members match your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDept("All");
            }}
            className="text-xs text-primary font-bold mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
};

const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};
