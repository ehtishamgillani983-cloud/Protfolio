import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Search } from 'lucide-react';
import { FAQ } from '../types';

interface FAQSectionProps {
  faqs: FAQ[];
  onAskQuestion?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, onAskQuestion }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Website Development',
    'E-commerce',
    'SaaS',
    'AI Solutions',
    'Project Timelines',
    'Pricing',
    'SEO',
    'Support',
    'Getting Started',
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      faq.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLARITY & TRANSPARENCY</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Questions.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Everything you need to know about working with Nova Web Studio, our technology, timelines,
            pricing, and ongoing support.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-8">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category badges */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white glass-panel'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center text-slate-400 text-xs">
              No questions found matching your search.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-cyan-500/40 bg-[#0d1424]/95 shadow-lg shadow-cyan-950/30'
                      : 'border-white/10 hover:border-white/20 bg-[#090d18]/80'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="font-display text-sm sm:text-base font-bold text-white">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-slate-300 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5 animate-in fade-in duration-150">
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Extra Question Callout */}
        <div className="mt-12 text-center text-xs text-slate-400">
          Have a question not listed here?{' '}
          <a
            href="#contact"
            onClick={onAskQuestion}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
          >
            Contact Syed Ehtisham Gillani directly
          </a>
        </div>
      </div>
    </section>
  );
};
