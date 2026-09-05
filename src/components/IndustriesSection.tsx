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
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onSelectIndustry }) => {
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
      </div>
    </section>
  );
};
