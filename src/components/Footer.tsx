import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
  ArrowUp,
  Shield,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { SiteSettings, Service } from '../types';

interface FooterProps {
  settings: SiteSettings;
  services: Service[];
  onOpenAdmin: () => void;
  onSelectService: (serviceTitle: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  services,
  onOpenAdmin,
  onSelectService,
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="relative bg-[#04060a] border-t border-white/10 pt-20 pb-12 overflow-hidden text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1 & 2: Agency Identity & Founder info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.customLogoUrl || '/assets/nova-logo.webp'}
                alt={settings.studioName}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-contain border border-white/20 shadow-md shadow-cyan-500/20"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                }}
              />
              <div className="flex flex-col">
                <span className="font-display text-lg font-extrabold tracking-wider text-white leading-none">
                  NOVA <span className="text-cyan-400 font-light">WEB STUDIO</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                  Digital Technology
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              Nova Web Studio is a modern digital technology and creative agency building high-performance
              websites, scalable SaaS platforms, AI chatbots, and complete online systems.
            </p>

            {/* Founder info badge */}
            <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/20 bg-[#080d18] max-w-sm space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block">
                Agency Leadership:
              </span>
              <p className="text-xs font-bold text-white">
                {settings.founderName}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {settings.founderTitle}
              </p>
            </div>

            {/* Direct Contact details */}
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Services (Key subset) */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-white uppercase tracking-wider block font-semibold">
              Digital Services
            </span>
            <ul className="space-y-2">
              {services.slice(0, 7).map((srv) => (
                <li key={srv.id}>
                  <a
                    href="#services"
                    onClick={() => onSelectService(srv.title)}
                    className="hover:text-cyan-300 transition-colors text-xs"
                  >
                    {srv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: More Services & Capabilities */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-white uppercase tracking-wider block font-semibold">
              AI & Tech Solutions
            </span>
            <ul className="space-y-2">
              {services.slice(7, 14).map((srv) => (
                <li key={srv.id}>
                  <a
                    href="#services"
                    onClick={() => onSelectService(srv.title)}
                    className="hover:text-cyan-300 transition-colors text-xs"
                  >
                    {srv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Navigation & Admin */}
          <div className="space-y-3">
            <span className="font-mono text-xs text-white uppercase tracking-wider block font-semibold">
              Quick Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About & Founder
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-white transition-colors">
                  Portfolio & Demos
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition-colors">
                  Technologies
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  7-Step Process
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 font-mono transition-colors"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} {settings.studioName}. Owner & Founder: {settings.founderName}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#07090e] max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Privacy Policy — Nova Web Studio
            </h3>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Nova Web Studio respects your privacy. When you contact us or request a consultation,
                we only collect the necessary information (such as your name, company, email, and phone number)
                to communicate with you regarding your project.
              </p>
              <p>
                We do not sell, rent, or distribute your personal or corporate data to third parties.
                All client communications and project materials are treated with strict confidentiality.
              </p>
              <p>
                For questions regarding data practices, contact Syed Ehtisham Gillani at webstudionova1@gmail.com.
              </p>
            </div>
            <div className="pt-6 text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#07090e] max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Terms of Service — Nova Web Studio
            </h3>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                All digital project proposals, deliverables, milestones, and timelines are clearly governed
                by agreed-upon scopes of work between Nova Web Studio and the client.
              </p>
              <p>
                Intellectual property of custom-designed assets and code is transferred to the client upon
                final settlement of project milestones.
              </p>
              <p>
                Nova Web Studio is founded by Syed Ehtisham Gillani and operated with professional integrity and transparent billing.
              </p>
            </div>
            <div className="pt-6 text-right">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
