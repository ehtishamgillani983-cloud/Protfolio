import React from 'react';
import { User, Sparkles, CheckCircle2, ShieldCheck, ArrowUpRight, Phone, MessageCircle, Mail } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutFounderProps {
  settings: SiteSettings;
  onOpenContact?: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ settings, onOpenContact }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Syed Ehtisham Gillani, I would like to schedule a consultation regarding my digital project with Nova Web Studio.'
  )}`;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEADERSHIP & VISION</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              About Nova Web Studio <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                & Leadership.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Nova Web Studio is a modern digital technology agency dedicated to building high-performance
            digital products, scalable web systems, and intelligent digital experiences for forward-thinking businesses.
          </p>
        </div>

        {/* Founder & Mission Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Founder Profile Card */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-b from-[#0b101d]/90 to-[#07090e]/95">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-cyan-500/20 transition-all duration-700" />

            <div>
              {/* Founder Photo */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden mb-6 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50 bg-[#0c1424] flex items-center justify-center">
                <img
                  src={
                    settings.founderAvatar && !settings.founderAvatar.startsWith('blob:')
                      ? settings.founderAvatar
                      : '/assets/founder-photo.jpg'
                  }
                  alt={settings.founderName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/founder-photo.jpg';
                  }}
                />
              </div>

              {/* Name & Title */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {settings.founderName}
                  </h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" title="Verified Founder" />
                </div>
                <p className="text-sm font-mono text-cyan-300 font-semibold tracking-wide">
                  {settings.founderTitle}
                </p>
              </div>

              {/* Bio Statement */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                {settings.founderBio}
              </p>

              {/* Direct Founder Communications */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Direct Founder Contact:
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 glass-panel hover:border-cyan-400/50 hover:text-white transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{settings.contactPhone}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 glass-panel hover:border-emerald-400/50 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 glass-panel hover:border-cyan-400/50 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{settings.contactEmail}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Nova Web Studio Founder</span>
              </span>
              <span>Online & Remote Ready</span>
            </div>
          </div>

          {/* Agency Positioning & Core Tenets */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0a0f1d]/80 space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                Modern Digital Agency Positioning
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                More Than Just Websites — We Build Digital Solutions.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                Nova Web Studio positions itself as a serious creative technology partner. We do not stop
                at standard static pages. We architect end-to-end digital solutions: custom web applications,
                scalable SaaS platforms, 24/7 AI chatbots, intelligent AI agents, streamlined business automation,
                and high-conversion digital experiences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Business-Focused Engineering</span>
                    <span className="text-[11px] text-slate-400">Every line of code is structured to support real business growth.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white block">AI & Modern Automation</span>
                    <span className="text-[11px] text-slate-400">Smart assistants and connected workflows that save time.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Clean & Fast Web Systems</span>
                    <span className="text-[11px] text-slate-400">No sluggish templates. Lightning-fast response across devices.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Direct Founder Oversight</span>
                    <span className="text-[11px] text-slate-400">Personal dedication and clear communication on every project.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-[#0d1424] to-[#0a0f1d] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  Have a project in mind or want to discuss ideas?
                </h4>
                <p className="text-xs text-slate-300">
                  Book a free consultation directly with Syed Ehtisham Gillani and the Nova team.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#contact"
                  onClick={onOpenContact}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                >
                  Book a Free Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
