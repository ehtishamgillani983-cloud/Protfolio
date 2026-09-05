import React from 'react';
import {
  Cpu,
  Palette,
  Briefcase,
  Zap,
  Sparkles,
  Layers,
  Search,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: 'Modern Technology',
      description:
        'We build with modern frameworks like React, Next.js, and TypeScript to ensure your digital product is fast, secure, and future-proof.',
      icon: Cpu,
    },
    {
      title: 'Premium Design',
      description:
        'Every visual layout is thoughtfully designed with high aesthetic standards, clean typography, and purposeful micro-interactions.',
      icon: Palette,
    },
    {
      title: 'Business-Focused Solutions',
      description:
        'We do not build for the sake of visuals alone. Every feature is oriented around helping your business generate leads, sales, and client trust.',
      icon: Briefcase,
    },
    {
      title: 'Fast & Responsive Websites',
      description:
        'Sub-second loading times and flawless responsiveness across all mobile phones, tablets, and desktop displays.',
      icon: Zap,
    },
    {
      title: 'AI-Powered Solutions',
      description:
        'Deploy 24/7 AI chatbots, autonomous AI agents, and automated workflows that streamline operations and capture customer leads.',
      icon: Sparkles,
    },
    {
      title: 'Scalable Digital Products',
      description:
        'Engineered to grow alongside your business, from initial launch to handling thousands of concurrent visitors without slowdowns.',
      icon: Layers,
    },
    {
      title: 'SEO-Ready Development',
      description:
        'Built from the ground up following search engine best practices so your business is easily discoverable on Google.',
      icon: Search,
    },
    {
      title: 'Ongoing Support',
      description:
        'We stand behind our work with reliable maintenance, security updates, regular backups, and direct communication whenever you need help.',
      icon: Headphones,
    },
  ];

  return (
    <section id="why-us" className="py-24 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE AGENCY ADVANTAGE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Choose <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Nova Web Studio.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            We partner with businesses, startups, and brands to engineer reliable, high-performing digital
            products that deliver lasting business value.
          </p>
        </div>

        {/* 8 Core Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const IconComponent = b.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group bg-[#090d18]/80 hover:bg-[#0c1424]/90"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-5 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-1.5 text-cyan-300 text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
