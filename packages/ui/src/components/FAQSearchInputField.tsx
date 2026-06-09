"use client";

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQSearchInputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  placeholder?: string;
  defaultCategory?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    id: 'faq1',
    category: 'Billing',
    question: 'How does the 14-day premium trial work?',
    answer: 'Once you sign up, you get complete access to all 10 high-fidelity statement components, canvas builders, and documentation. You will not be charged until the trial completes, and you can cancel anytime with one click.'
  },
  {
    id: 'faq2',
    category: 'Technical',
    question: 'Are these components fully SSR-safe and Next.js compatible?',
    answer: 'Yes! Every premium component in this workspace utilizes standard React boundaries, client-only guards (useEffect hooks), and SSR-safe viewport dimension checks. They are fully compatible with Next.js App Router (RSC) and standard Vite build cycles.'
  },
  {
    id: 'faq3',
    category: 'Licensing',
    question: 'Can I use these assets in multiple commercial client projects?',
    answer: 'Absolutely. Our commercial license grants you full permission to compile, customize, and bundle these interactive files into finished client websites, SaaS templates, or internal corporate dashboards without paying royalties.'
  },
  {
    id: 'faq4',
    category: 'Technical',
    question: 'Do these templates support dark mode automatically?',
    answer: 'Yes. They are engineered to inherit theme parameters. They utilize standard CSS variables and utility classes (such as bg-background, text-foreground, primary, accent, border, etc.) that adapt dynamically based on your root selectors.'
  },
  {
    id: 'faq5',
    category: 'Billing',
    question: 'Do you offer custom enterprise pricing plans or custom development?',
    answer: 'We do! For corporate teams needing bespoke interface hooks, specific animations, or on-site layout design workshops, contact our sales desk for customized license bundles.'
  },
  {
    id: 'faq6',
    category: 'Security',
    question: 'How is customer payment data managed and secured?',
    answer: 'All billing sessions are processed via Stripe using high-grade end-to-end tokenization. We never record, process, or store credit card details on our local database servers.'
  }
];

export const FAQSearchInputField: React.FC<FAQSearchInputFieldProps> = ({
  faqs = defaultFAQs,
  title = "Frequently Asked Questions",
  subtitle = "Have questions? Filter by category or search text to immediately discover answer panels for our custom canvas architectures.",
  placeholder = "Search questions, categories, keywords...",
  defaultCategory = "All",
  className,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Extract unique categories
  const categories = useMemo(() => {
    const list = new Set(faqs.map(f => f.category));
    return ["All", ...Array.from(list)];
  }, [faqs]);

  // Filter FAQs based on query & category
  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === "All" || faq.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, searchQuery, activeCategory]);

  // Highlight search text
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-primary/20 text-primary font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "w-full bg-background text-foreground py-16 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center",
        className
      )}
      {...props}
    >
      {/* Header section */}
      <div className="text-center max-w-2xl mb-10">
        <div className="inline-flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground/90">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support Desk FAQs</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Modern Search bar */}
      <div className="w-full relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setExpandedId(null);
          }}
          placeholder={placeholder}
          className="w-full bg-muted/65 hover:bg-muted/95 focus:bg-muted border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-2xl pl-11 pr-10 py-3 text-xs font-semibold outline-none transition-all placeholder:text-muted-foreground/80 shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              searchInputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted-foreground/15 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-8 max-w-xl border-b border-border/40 pb-4 w-full">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedId(null);
            }}
            className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border",
              activeCategory === cat
                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                : "bg-muted/40 border-border/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <motion.div 
        layout={!prefersReducedMotion}
        className="w-full space-y-3.5"
      >
        <AnimatePresence mode="popLayout">
          {filteredFAQs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <motion.div
                layout={!prefersReducedMotion}
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={cn(
                  "border border-border/60 hover:border-primary/30 rounded-xl overflow-hidden transition-all bg-card/40 backdrop-blur-sm shadow-sm",
                  isExpanded && "border-primary/40 ring-1 ring-primary/10"
                )}
              >
                {/* Header FAQ Row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left p-4 cursor-pointer hover:bg-muted/20 focus:outline-none focus:bg-muted/20"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider mt-0.5">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-foreground leading-snug">
                      {renderHighlightedText(faq.question, searchQuery)}
                    </h3>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ml-4",
                    isExpanded && "rotate-180 text-primary"
                  )} />
                </button>

                {/* Animated expandable container */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-border/20 text-xs text-muted-foreground leading-relaxed pl-14 pr-6 bg-muted/10">
                        {renderHighlightedText(faq.answer, searchQuery)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* No matching results state */}
      {filteredFAQs.length === 0 && (
        <div className="w-full text-center py-12 border border-dashed border-border/60 rounded-2xl bg-muted/10">
          <p className="text-xs sm:text-sm font-bold text-muted-foreground">
            No matching questions found for &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="text-xs font-black text-primary mt-2 hover:underline cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};

