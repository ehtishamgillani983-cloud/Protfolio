import React from 'react';
import {
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Building2,
  Utensils,
  Dumbbell,
  Briefcase,
  Cpu,
  Store,
  Layers,
  Globe2,
  ArrowUpRight,
} from 'lucide-react';
import { INDUSTRIES } from '../data/initialData';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Building2,
  Utensils,
  Dumbbell,
  Briefcase,
  Cpu,
  Store,
  Layers,
};

interface IndustriesSectionProps {
  onSelectIndustry?: (name: string) => void;
  onNavigateCommercialCleaning?: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  onSelectIndustry,
  onNavigateCommercialCleaning,
}) => {
  return (
    <section id="industries" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>WHO WE WORK WITH</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Industries & Business Types <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              We Build For.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            From local businesses to fast-growing tech startups, we tailor digital solutions to the specific
            operational and customer needs of your industry.
          </p>
        </div>

        {/* 10 Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {INDUSTRIES.map((ind) => {
            const IconComponent = ICON_MAP[ind.iconName] || Globe2;

            return (
              <div
                key={ind.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group bg-[#090d18]/80 hover:bg-[#0c1424]/90"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="font-display text-base font-bold text-white mb-1">
                    {ind.name}
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400 mb-2">
                    {ind.tagline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ind.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {ind.stat}
                  </span>
                  <a
                    href="#contact"
                    onClick={() => onSelectIndustry?.(ind.name)}
                    className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-white transition-colors"
                  >
                    <span>Inquire</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial Cleaning Callout Card */}
        <div className="mt-12 p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-[#090e1c]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-sm sm:text-base font-bold text-white block">
                Commercial Cleaning & Janitorial Contractors (USA)
              </span>
              <span className="text-xs text-slate-300">
                Explore our dedicated high-conversion web design, local SEO, and 60-second quote-request solutions tailored for American cleaning companies.
              </span>
            </div>
          </div>
          <a
            href="/commercial-cleaning-websites"
            onClick={(e) => {
              if (onNavigateCommercialCleaning) {
                e.preventDefault();
                onNavigateCommercialCleaning();
              }
            }}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <span>View Dedicated Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
