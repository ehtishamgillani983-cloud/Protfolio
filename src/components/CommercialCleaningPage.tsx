import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  Search,
  Smartphone,
  BarChart3,
  RefreshCw,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Send,
  ExternalLink,
  Layers,
  ArrowLeft,
  Briefcase,
  Star,
} from 'lucide-react';
import { SiteSettings, formatWhatsAppUrl } from '../types';
import { submitContactLead } from '../lib/supabase';

interface CommercialCleaningPageProps {
  settings: SiteSettings;
  onNavigateHome: () => void;
  onOpenAdmin?: () => void;
}

export const CommercialCleaningPage: React.FC<CommercialCleaningPageProps> = ({
  settings,
  onNavigateHome,
  onOpenAdmin,
}) => {
  // SEO & Head tag synchronization
  useEffect(() => {
    const originalTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const originalCanonical = canonicalLink ? canonicalLink.getAttribute('href') : '';

    document.title = 'Commercial Cleaning Website Design & SEO (USA) | Nova Web Studio';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Specialized website design, local SEO, and 60-second quote-request forms for USA commercial cleaning companies, janitorial contractors, and office cleaning services.'
      );
    }
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://novawebstudio.agency/commercial-cleaning-websites');
    }

    // JSON-LD Structured Data for Commercial Cleaning Web Service
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'commercial-cleaning-seo-schema';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      'serviceType': 'Commercial Cleaning Website Design & Local SEO',
      'provider': {
        '@type': 'ProfessionalService',
        'name': 'Nova Web Studio',
        'url': 'https://novawebstudio.agency',
        'telephone': settings.contactPhone,
        'email': settings.contactEmail,
        'founder': {
          '@type': 'Person',
          'name': settings.founderName,
        },
      },
      'areaServed': {
        '@type': 'Country',
        'name': 'United States',
      },
      'description':
        'Specialized website design, local search engine optimization, mobile optimization, and quote-request systems for commercial cleaning companies and janitorial contractors across the USA.',
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
      },
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
      if (canonicalLink && originalCanonical) canonicalLink.setAttribute('href', originalCanonical);
      const existingSchema = document.getElementById('commercial-cleaning-seo-schema');
      if (existingSchema) existingSchema.remove();
    };
  }, [settings]);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [facilityTypes, setFacilityTypes] = useState<string[]>(['Office Buildings']);
  const [serviceNeeded, setServiceNeeded] = useState('New Commercial Website');
  const [budget, setBudget] = useState('$1,500 – $3,500');
  const [notes, setNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Accordion FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  const handleFacilityTypeToggle = (type: string) => {
    setFacilityTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setStatusMessage('Connecting with Nova Web Studio...');

    const combinedMessage = [
      `USA Commercial Cleaning Inquiry:`,
      `Company: ${companyName}`,
      `Service Territory/City: ${location || 'USA'}`,
      `Facility Types: ${facilityTypes.join(', ')}`,
      `Service Needed: ${serviceNeeded}`,
      `Notes: ${notes || 'None provided'}`,
    ].join('\n');

    try {
      const res = await submitContactLead({
        name: contactName,
        company: companyName,
        email,
        phone,
        servicesRequested: ['Commercial Cleaning Websites', serviceNeeded],
        budget,
        timeline: '1-3 Weeks',
        message: combinedMessage,
      });

      if (res && res.id) {
        setFormStatus('success');
        setStatusMessage(
          'Thank you! Your consultation request has been received. Syed Ehtisham Gillani will review your cleaning business details and respond within 24 hours.'
        );
        // Reset form
        setCompanyName('');
        setContactName('');
        setEmail('');
        setPhone('');
        setLocation('');
        setNotes('');
      } else {
        setFormStatus('error');
        setStatusMessage('Submission error. Please reach out directly on WhatsApp or Email.');
      }
    } catch {
      setFormStatus('error');
      setStatusMessage('Submission failed. Please connect directly via WhatsApp or phone call.');
    }
  };

  const whatsappMessage =
    'Hello Syed Ehtisham Gillani, I am contacting Nova Web Studio regarding a website for my USA commercial cleaning business.';
  const whatsappUrl = formatWhatsAppUrl(settings.whatsappNumber, whatsappMessage);

  const scrollToConsultation = () => {
    const el = document.getElementById('consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commonProblems = [
    {
      title: 'Outdated & Template-Heavy Aesthetics',
      desc: 'Many janitorial websites look like 2012 DIY templates. Corporate facility managers and commercial property directors quickly leave if your site fails to reflect enterprise reliability and professional standards.',
      icon: AlertCircle,
    },
    {
      title: 'Frustrating Mobile Experiences',
      desc: 'Busy office managers and property executives browse on their smartphones between site walkthroughs. If your website is sluggish, hard to tap, or non-responsive, you lose valuable RFP opportunities.',
      icon: Smartphone,
    },
    {
      title: 'Vague or Clunky Quote Processes',
      desc: 'Commercial buyers do not want endless generic text. Without a structured quote form specifying facility type, square footage, and cleaning frequency, buyers drop off before submitting an inquiry.',
      icon: FileText,
    },
    {
      title: 'Weak Local Search Visibility in Key Metro Areas',
      desc: 'Without focused city, suburb, and county SEO architecture, your commercial cleaning business misses out on high-intent local searches like "commercial janitorial contractor" or "office cleaning services near me".',
      icon: Search,
    },
  ];

  const specializedServices = [
    {
      title: 'Commercial Cleaning Website Design',
      desc: 'Bespoke, high-authority website design engineered specifically for American commercial cleaning contractors. Clean typography, high-contrast layouts, and reassuring corporate credibility.',
      highlights: ['Custom B2B Brand Identity', 'Facility-Focused Architecture', 'Trust Badges & Insurance Credentials'],
      icon: Building2,
    },
    {
      title: 'Commercial Website Redesign',
      desc: 'Transform slow, dated WordPress, Wix, or Squarespace cleaning sites into lightning-fast, modern web platforms built with modern React and Next.js engineering.',
      highlights: ['Faster Load Speeds', 'Modernized Corporate Look', 'Zero Downtime Migration'],
      icon: RefreshCw,
    },
    {
      title: 'Local SEO for Service Areas & Metros',
      desc: 'Targeted local SEO architecture structured to rank for commercial cleaning in your specific US cities, business parks, industrial corridors, and suburban commercial districts.',
      highlights: ['City & Territory Service Pages', 'Schema.org Local Business Markup', 'Google Business Profile Alignment'],
      icon: Search,
    },
    {
      title: '60-Second Quote Request & RFP Forms',
      desc: 'Conversion-focused estimate request workflows where property managers can select facility type (offices, medical, industrial, schools), square footage, and cleaning schedule.',
      highlights: ['Multi-Step Commercial Forms', 'Square Footage & Frequency Selectors', 'Instant Email & WhatsApp Lead Alerts'],
      icon: FileText,
    },
    {
      title: 'Mobile Optimization for Busy Decision-Makers',
      desc: 'Engineered mobile-first with instant tap-to-call, WhatsApp messaging, and seamless form entry for facility supervisors reviewing vendors on job sites.',
      highlights: ['1-Tap Phone & WhatsApp Dial', 'Fast Page Load Under 1s', 'Touch-Friendly Navigation'],
      icon: Smartphone,
    },
    {
      title: 'Conversion Tracking & Analytics Setup',
      desc: 'Full configuration of Google Analytics and conversion event tracking to measure quote form completions, click-to-calls, and inquiry channels accurately.',
      highlights: ['Form Submission Event Tracking', 'Click-to-Call Monitoring', 'Clear Traffic Attribution'],
      icon: BarChart3,
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Consultation & Discovery',
      desc: 'We analyze your commercial cleaning business model, service territories in the USA, target facility types, and current website challenges.',
      duration: 'Step 1',
    },
    {
      number: '02',
      title: 'Website Planning & Wireframing',
      desc: 'We map the sitemap, design the commercial quote-request flow, and structure service pages for offices, clinics, warehouses, and schools.',
      duration: 'Step 2',
    },
    {
      number: '03',
      title: 'Design & Clean Engineering',
      desc: 'We build a modern, high-speed website using clean TypeScript and Tailwind CSS, prioritizing fast loading speeds and crisp mobile presentation.',
      duration: 'Step 3',
    },
    {
      number: '04',
      title: 'Quality Testing & Launch',
      desc: 'We test form delivery across desktop and mobile, verify local SEO schema, connect your custom domain with secure SSL, and go live.',
      duration: 'Step 4',
    },
  ];

  const cleaningFaqs = [
    {
      q: 'Why do commercial cleaning contractors need a specialized website?',
      a: 'Unlike residential house cleaning where consumers look for cheap hourly rates, commercial cleaning involves property directors, office managers, and procurement officers making substantial contract commitments. A specialized B2B website proves your credibility, insurance compliance, facility scope, and makes requesting commercial quotes seamless.',
    },
    {
      q: 'How does an optimized quote-request form increase inquiries?',
      a: 'Generic contact forms ask vague questions, leaving facility managers unsure whether you handle their specific facility size. Our commercial quote forms allow them to indicate facility type (e.g. corporate office, medical clinic, industrial warehouse), estimated square footage, and cleaning frequency, drastically lowering friction and generating actionable RFPs.',
    },
    {
      q: 'Can our website target multiple cities or metropolitan areas in the USA?',
      a: 'Yes. We architect organized service-area pages and localized SEO structures that allow your business to showcase operations across specific cities, counties, and metropolitan districts without keyword stuffing or duplicate content issues.',
    },
    {
      q: 'How long does it take to design and launch a commercial cleaning website?',
      a: 'Most commercial cleaning websites are designed, engineered, reviewed, and deployed within 2 to 3 weeks. If you require advanced multi-location territory pages or custom quote calculators, we define transparent milestone timelines during our initial consultation.',
    },
    {
      q: 'Can facility managers easily request a quote on mobile phones?',
      a: 'Yes. Every website we build is optimized mobile-first. Facility managers walking a job site can tap to call your office immediately, message via WhatsApp, or fill out the streamlined 60-second quote form with large, ergonomic touch targets.',
    },
    {
      q: 'Do you provide ongoing technical maintenance and updates?',
      a: 'Yes. Nova Web Studio offers ongoing support and maintenance to ensure your site remains secure, updated, and fast, including regular software updates, security monitoring, and content additions as your cleaning company expands into new territories.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-cyan-500 selection:text-black relative">
      {/* Top Header / Sticky Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#05070c]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Agency Identity */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 group text-left"
          >
            <img
              src={settings.customLogoUrl || '/assets/nova-logo.webp'}
              alt={settings.studioName}
              className="w-10 h-10 rounded-full object-contain border border-white/20 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
              }}
            />
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-extrabold tracking-wider text-white leading-none">
                NOVA <span className="text-cyan-400 font-light">STUDIO</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-300 tracking-widest uppercase">
                Commercial Cleaning Solutions
              </span>
            </div>
          </button>

          {/* Desktop Links & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onNavigateHome}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-full glass-panel"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Main Agency</span>
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${settings.contactPhone}`}
              className="p-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-all"
              title={`Call: ${settings.contactPhone}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Consultation CTA */}
            <button
              onClick={scrollToConsultation}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="pt-24 sm:pt-28 pb-20 relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Industry Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-lg shadow-cyan-950/40">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SPECIALIZED FOR USA COMMERCIAL CLEANING & JANITORIAL CONTRACTORS</span>
            </div>

            {/* Single Clear H1 */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
              Websites Engineered for <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                USA Commercial Cleaning Companies
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="mt-6 text-sm sm:text-lg text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
              We help commercial cleaning contractors, janitorial businesses, and office cleaning providers in the United States build high-converting websites, capture qualified RFPs, and stand out to facility managers.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Primary CTA */}
              <button
                onClick={scrollToConsultation}
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2"
              >
                <span>Get a Free Website Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${settings.contactPhone}`}
                className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 glass-panel border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call: {settings.contactPhone}</span>
              </a>
            </div>

            {/* Credibility & Focus Points */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#090d18]/80">
                <span className="font-display text-lg sm:text-xl font-bold text-white block">USA B2B Focus</span>
                <span className="text-xs text-slate-400">Tailored for property & facility managers</span>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#090d18]/80">
                <span className="font-display text-lg sm:text-xl font-bold text-cyan-400 block">60-Sec Quotes</span>
                <span className="text-xs text-slate-400">Interactive facility estimate workflows</span>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#090d18]/80">
                <span className="font-display text-lg sm:text-xl font-bold text-white block">Local SEO</span>
                <span className="text-xs text-slate-400">Targeted by US city, suburb & territory</span>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/10 bg-[#090d18]/80">
                <span className="font-display text-lg sm:text-xl font-bold text-cyan-400 block">Mobile-First</span>
                <span className="text-xs text-slate-400">Instant 1-tap call & dispatch inquiry</span>
              </div>
            </div>

            {/* Real Industry Imagery Banner */}
            <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                alt="Pristine modern corporate commercial office facility workspace with spotless floors"
                className="w-full h-64 sm:h-96 object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-black/40 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-left max-w-2xl">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                    Industry Perspective
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Facility directors and commercial leasing managers judge vendor reliability within 5 seconds of visiting your website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMMON PROBLEMS WE SOLVE */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-amber-500/30 text-xs font-mono text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>CHALLENGES IN THE CLEANING INDUSTRY</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why Many Commercial Cleaning Websites <br />
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-rose-400 bg-clip-text text-transparent">
                  Fail to Win Corporate Contracts.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Most janitorial websites are treated like digital business cards rather than active conversion engines. Here is where potential clients are lost:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {commonProblems.map((prob, idx) => {
                const IconComponent = prob.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#090d18]/90 hover:border-amber-500/30 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {prob.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {prob.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SERVICES BREAKDOWN */}
        <section className="py-20 relative bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>WHAT WE BUILD FOR YOU</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Dedicated Web Services for <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  Commercial Cleaning Contractors.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Everything required to establish an authoritative online presence and make quoting effortless for prospective commercial clients across the USA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedServices.map((srv, idx) => {
                const IconComp = srv.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-cyan-500/40 bg-[#090d18]/90 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-2">
                        {srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Included Features:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {srv.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PORTFOLIO DEMO SHOWCASE (Clearly labeled Concept Preview) */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 bg-[#0a0f1e]/90 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PORTFOLIO CONCEPT PREVIEW</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Commercial Cleaning <br />
                    <span className="text-cyan-400">Website Demo & Layout</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Designed as a premier design concept for USA commercial cleaning contractors. This blueprint features clean facility breakdowns, trust badges, localized territory showcases, and an interactive 60-second quote estimator.
                  </p>

                  <div className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Dedicated service pages: Offices, Medical Clinics, Warehouses, Schools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Square-footage & frequency quote estimator workflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Targeted Schema.org local business markup for USA metro territories</span>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    <button
                      onClick={scrollToConsultation}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
                    >
                      <span>Inquire About This Design</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full text-xs font-semibold text-emerald-300 glass-panel border border-emerald-500/30 hover:bg-emerald-500/10 transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Discuss on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Concept Preview Image Visual */}
                <div className="lg:col-span-6 relative">
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative group">
                    <img
                      src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                      alt="Spotless corporate conference room showcasing high-end commercial office cleaning standard"
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                      Concept Prototype
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-xs text-white">
                      <span className="font-bold">Facility Cleanliness Showcase</span>
                      <p className="text-[11px] text-slate-300">Demonstrates spotless commercial environments to build immediate B2B confidence.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMPLE 4-STEP PROCESS */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>HOW WE WORK</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Straightforward 4-Step Process.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Clear, transparent, and collaborative from initial discovery to live website launch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#090d18]/90 space-y-3 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xl font-black text-cyan-400">
                        {step.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full border border-white/10">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-20 relative bg-white/[0.01]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMMON QUESTIONS</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Commercial Cleaning Website FAQ.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Answers to questions American janitorial contractors frequently ask when planning a website.
              </p>
            </div>

            <div className="space-y-3">
              {cleaningFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'border-cyan-500/40 bg-[#0d1424]/90 shadow-lg shadow-cyan-950/30'
                        : 'border-white/10 bg-[#090d18]/70 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-sm sm:text-base font-bold text-white">
                        {faq.q}
                      </span>
                      <span className="text-cyan-400 shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONSULTATION & QUOTE REQUEST FORM */}
        <section id="consultation-form" className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 bg-[#0a0f1e]/95 shadow-2xl relative">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FREE STRATEGY & CONSULTATION</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Get a Free Website Consultation <br />
                  <span className="text-cyan-400">For Your Cleaning Company</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Tell us about your business, target cities, and facility services. Syed Ehtisham Gillani will review your information and provide tailored recommendations.
                </p>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pb-6 border-b border-white/10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
                  <span>Immediate Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="p-3.5 rounded-2xl glass-panel border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Direct Phone: {settings.contactPhone}</span>
                </a>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Cleaning Business / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Janitorial Services"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Miller"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. robert@apexjanitorial.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Service Territory / City & State (USA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dallas-Fort Worth, TX or Greater Atlanta, GA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Facility Types Checkboxes */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Commercial Facility Types You Service (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Office Buildings',
                      'Medical Clinics & Healthcare',
                      'Industrial & Warehouses',
                      'Schools & Daycares',
                      'Retail Stores & Showrooms',
                      'Financial & Banks',
                    ].map((facility) => {
                      const isSelected = facilityTypes.includes(facility);
                      return (
                        <button
                          type="button"
                          key={facility}
                          onClick={() => handleFacilityTypeToggle(facility)}
                          className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                              : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span>{facility}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Primary Service Needed
                    </label>
                    <select
                      value={serviceNeeded}
                      onChange={(e) => setServiceNeeded(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0d1424] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="New Commercial Website">New Commercial Website</option>
                      <option value="Website Redesign">Website Redesign & Speed Fix</option>
                      <option value="Local Territory SEO">Local Territory SEO Architecture</option>
                      <option value="Quote Request Form Setup">Quote Request & RFP Form Setup</option>
                      <option value="Full Growth Package">Complete Web & Local SEO Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      Estimated Investment Budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0d1424] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="$1,000 – $2,000">$1,000 – $2,000</option>
                      <option value="$2,000 – $3,500">$2,000 – $3,500</option>
                      <option value="$3,500 – $5,000">$3,500 – $5,000</option>
                      <option value="$5,000+ Enterprise Multi-Location">$5,000+ (Multi-Location Territory)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    Current Website URL or Project Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. www.apexjanitorial.com - We need to rank for office cleaning in North Dallas and have a 60-second quote form."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Status Feedback */}
                {formStatus === 'submitting' && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>{statusMessage}</span>
                  </div>
                )}
                {formStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{statusMessage}</span>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Free Commercial Cleaning Website Consultation</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative bg-[#04060a] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={settings.customLogoUrl || '/assets/nova-logo.webp'}
                alt={settings.studioName}
                className="w-9 h-9 rounded-full object-contain border border-white/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                }}
              />
              <div>
                <span className="font-display text-base font-extrabold text-white block">
                  NOVA <span className="text-cyan-400 font-light">WEB STUDIO</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Commercial Cleaning & Digital Engineering Agency
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={onNavigateHome}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Agency Home
              </button>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {settings.contactEmail}
              </a>
              <a
                href={`tel:${settings.contactPhone}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {settings.contactPhone}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                WhatsApp Direct
              </a>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-[11px] font-mono text-slate-500 hover:text-cyan-400"
                >
                  Admin CMS
                </button>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <div>
              © {new Date().getFullYear()} Nova Web Studio. Specialized B2B web engineering for the USA commercial cleaning sector.
            </div>
            <div>
              Founder: {settings.founderName} • Verified Business Details
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
