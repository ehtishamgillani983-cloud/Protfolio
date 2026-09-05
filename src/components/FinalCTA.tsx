import React from 'react';
import { Sparkles, Phone, MessageCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { SiteSettings } from '../types';

interface FinalCTAProps {
  settings: SiteSettings;
  onOpenContact?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ settings, onOpenContact }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Syed Ehtisham Gillani, I would like to start a project with Nova Web Studio.'
  )}`;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-cyan-500/30 text-center space-y-8 bg-gradient-to-b from-[#0c1424]/95 via-[#090d18]/95 to-[#060912]/95 shadow-2xl shadow-cyan-950/40">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LET’S GET STARTED</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Turn Your Vision <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Into a Modern Reality?
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Partner with Nova Web Studio to build modern websites, web applications, SaaS platforms,
              and AI solutions that give your business a competitive edge.
            </p>
          </div>

          {/* High Conversion CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* Start a Project / Book Consultation */}
            <a
              href="#contact"
              onClick={onOpenContact}
              className="px-7 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* WhatsApp Us */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full text-xs font-bold text-emerald-300 glass-panel border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>

            {/* Call Now */}
            <a
              href={`tel:${settings.contactPhone}`}
              className="px-6 py-3.5 rounded-full text-xs font-bold text-slate-200 glass-panel hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call: {settings.contactPhone}</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Direct Founder Review</span>
            </span>
            <span>•</span>
            <span>100% Free Initial Assessment</span>
            <span>•</span>
            <span className="text-cyan-400">Owner & Founder: Syed Ehtisham Gillani</span>
          </div>
        </div>
      </div>
    </section>
  );
};
