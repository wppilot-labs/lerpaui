'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Mail, Linkedin, Twitter, Sparkles, Network } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  departments: string[]; // e.g. ['Engineering', 'Leadership']
  avatarUrl?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

interface TeamDepartmentSwapperProps extends React.HTMLAttributes<HTMLDivElement> {
  members?: TeamMember[];
  departments?: string[];
}

const DEFAULT_DEPARTMENTS = ['All', 'Leadership', 'Engineering', 'Design', 'Marketing'];

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Vance',
    role: 'Chief Executive Officer',
    departments: ['Leadership'],
    bio: 'Pioneering interactive design & SaaS infrastructure strategy for the next generation of creative web platforms.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    name: 'Alex Rivera',
    role: 'Principal Creative Technologist',
    departments: ['Engineering', 'Design'],
    bio: 'Crafting performant 3D graphics, vector canvas maps, and interactive physical UI systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'VP of Product Experience',
    departments: ['Leadership', 'Design'],
    bio: 'Spearheading design language rules and tactile physics models across microservices.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 4,
    name: 'Marcus Thorne',
    role: 'Senior Core Systems Engineer',
    departments: ['Engineering'],
    bio: 'Designing responsive high-throughput heatmaps, SaaS microservice architectures, and DB clusters.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 5,
    name: 'Zaria Jenkins',
    role: 'Lead Brand & Motion Designer',
    departments: ['Design'],
    bio: 'Fusing color-dodge holographic overlays and organic vector dissolve particles into motion graphics.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 6,
    name: 'Kai Takahashi',
    role: 'Head of Growth Marketing',
    departments: ['Marketing'],
    bio: 'Amplifying high-performance UI systems globally with organic narrative-driven models.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
];

export function TeamDepartmentSwapper({
  members = DEFAULT_MEMBERS,
  departments = DEFAULT_DEPARTMENTS,
  className,
  ...props
}: TeamDepartmentSwapperProps) {
  const [activeDept, setActiveDept] = useState('All');

  // Filter list based on selected tab
  const filteredMembers = useMemo(() => {
    if (activeDept === 'All') return members;
    return members.filter((m) => m.departments.includes(activeDept));
  }, [activeDept, members]);

  return (
    <div
      className={cn(
        "relative w-full bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-3xl text-white select-none overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header and Brand */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full w-fit mb-2">
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-300">
              TALENT INFRASTRUCTURE SWAPPER
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Meet the Creative Squad
          </h2>
        </div>

        {/* Tab Buttons Container */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          {departments.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={cn(
                  "relative px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-xl transition-all duration-300",
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-zinc-800 border border-zinc-700/60 rounded-xl"
                    transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  />
                )}
                <span className="relative z-10">{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid container with AnimatePresence layoutId motion */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member) => {
            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 28, stiffness: 180 }}
                className={cn(
                  "group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                )}
              >
                {/* Visual Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  {/* Photo & Roster Tags */}
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800 shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-zinc-500 font-mono tracking-tight">
                        {member.role}
                      </p>
                      
                      {/* Department Badges */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {member.departments.map((d) => (
                          <span
                            key={d}
                            className="text-[8px] font-black font-mono tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded"
                          >
                            {d.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-2">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Footer Socials */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800/80">
                  <div className="flex space-x-2">
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on Twitter`}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        aria-label={`Email ${member.name}`}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <span className="flex items-center space-x-1 text-[9px] font-black font-mono text-zinc-600 group-hover:text-purple-400 transition-colors">
                    <Sparkles className="w-3 h-3 text-purple-400/80" />
                    <span>VERIFIED</span>
                  </span>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
