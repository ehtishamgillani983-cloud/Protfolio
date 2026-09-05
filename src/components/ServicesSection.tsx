import React, { useState } from 'react';
import {
  Layout,
  Code2,
  ShoppingBag,
  Laptop,
  Layers,
  Bot,
  Sparkles,
  Palette,
  Smartphone,
  Cpu,
  Search,
  TrendingUp,
  Compass,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceForContact: (serviceTitle: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layout,
  Code2,
  ShoppingBag,
  Laptop,
  Layers,
  Bot,
  Sparkles,
  Palette,
  Smartphone,
  Cpu,
  Search,
  TrendingUp,
  Compass,
  RefreshCw,
  ShieldCheck,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForContact,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Web & Apps',
    'AI & Automation',
    'Design & Branding',
    'Marketing & Growth',
  ];

  const filterServiceByCategory = (srv: Service, cat: string) => {
    if (cat === 'All') return true;
    if (cat === 'Web & Apps') {
      return ['website-design', 'website-development', 'ecommerce-development', 'web-app-development', 'saas-product-development', 'mobile-app-development'].includes(srv.slug);
    }
    if (cat === 'AI & Automation') {
      return ['ai-chatbots', 'ai-agents', 'business-automation'].includes(srv.slug);
    }
    if (cat === 'Design & Branding') {
      return ['ui-ux-design', 'branding-creative-design', 'website-redesign'].includes(srv.slug);
    }
    if (cat === 'Marketing & Growth') {
      return ['seo', 'digital-marketing', 'website-maintenance'].includes(srv.slug);
    }
    return true;
  };

  const filteredServices = services.filter((srv) => {
    const matchesCat = filterServiceByCategory(srv, activeCategory);
    const matchesSearch =
      srv.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>WHAT WE DO</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Digital Services. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Simple, Powerful, Business-Focused.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Nova Web Studio helps businesses, startups, and brands build modern digital products and grow online.
            Explore our comprehensive range of services below.
          </p>
        </div>

        {/* Filter / Quick Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white glass-panel'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search services..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Services Grid (15 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || Sparkles;
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isExpanded
                    ? 'border-cyan-500/40 bg-[#0d1424]/95 shadow-2xl shadow-cyan-950/50'
                    : 'border-white/10 hover:border-cyan-500/30 bg-[#090d18]/80'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Index */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Highlights pills */}
                  {service.deliverablesHighlights && service.deliverablesHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.deliverablesHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {service.fullDesc}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          What is included:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {service.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => onSelectServiceForContact(service.title)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Consultation Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 text-center max-w-3xl mx-auto space-y-3 bg-[#0a0f1d]/80">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Need a custom package or not sure what your business needs?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Speak directly with Syed Ehtisham Gillani to discuss your goals, requirements, and budget.
          </p>
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => onSelectServiceForContact('General Inquiry')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
