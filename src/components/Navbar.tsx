import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Sparkles,
  Lock,
  ArrowRight,
  Monitor,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Syed Ehtisham Gillani, I would like to schedule a consultation regarding Nova Web Studio services.'
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070c]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-xl shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo / Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={settings.customLogoUrl || '/assets/nova-logo.webp'}
              alt={settings.studioName}
              loading="eager"
              decoding="async"
              className="w-10 h-10 rounded-full object-contain border border-white/20 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
              }}
            />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-extrabold tracking-wider text-white leading-none">
                NOVA <span className="text-cyan-400 font-light">STUDIO</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                Digital Technology
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Quick Call Button */}
            <a
              href={`tel:${settings.contactPhone}`}
              className="p-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-all"
              title={`Call: ${settings.contactPhone}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Main Book Free Consultation Button */}
            <a
              href="#contact"
              onClick={onOpenContact}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full glass-panel text-emerald-400 border border-emerald-500/30 sm:hidden"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 pt-2 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/[0.05] hover:text-cyan-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <a
                href="#contact"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="py-2.5 rounded-full text-xs font-mono text-center text-slate-200 glass-panel border border-cyan-500/30 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Call Now</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-full text-xs font-mono text-center text-emerald-300 glass-panel border border-emerald-500/30 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin CMS</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
