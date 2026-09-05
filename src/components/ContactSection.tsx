import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SiteSettings, Service } from '../types';
import { submitContactLead } from '../lib/supabase';

interface ContactSectionProps {
  settings: SiteSettings;
  services: Service[];
  preSelectedService?: string | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  services,
  preSelectedService,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState<string>('Website Development');
  const [budget, setBudget] = useState<string>('$1,000 – $3,000');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [statusText, setStatusText] = useState('');

  // Update selected service if preSelectedService changed
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService);
    }
  }, [preSelectedService]);

  const budgetOptions = [
    'Under $1,000 / Flexible',
    '$1,000 – $3,000',
    '$3,000 – $5,000',
    '$5,000 – $10,000',
    '$10,000+ Enterprise',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('sending');
    setStatusText('Encrypting and sending your inquiry to Nova Web Studio...');

    try {
      const result = await submitContactLead({
        name,
        company,
        email,
        phone,
        servicesRequested: [selectedService],
        budget,
        message,
      });

      if (result && result.id) {
        setSubmissionStatus('success');
        setStatusText(
          'Thank you! Your project inquiry has been received. Syed Ehtisham Gillani and the Nova team will contact you within 24 hours.'
        );
        // Reset form fields
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setSubmissionStatus('error');
        setStatusText('Failed to submit inquiry. Please reach out directly on WhatsApp or Email.');
      }
    } catch {
      setSubmissionStatus('error');
      setStatusText('Network connection interrupted. Please use WhatsApp or Call directly.');
    }
  };

  const whatsappLink = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Syed Ehtisham Gillani, I am contacting Nova Web Studio regarding ${selectedService}.`
  )}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>START A CONVERSATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Let’s Build Something <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Extraordinary Together.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Reach out directly to Syed Ehtisham Gillani and Nova Web Studio. Whether you need a full website,
            a custom web app, an AI chatbot, or ongoing digital support, we are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action CTAs */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#090d18]/90">
              <h3 className="font-display text-xl font-bold text-white">
                Direct Contact Channels
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Prefer immediate messaging or a phone call? Contact Syed Ehtisham Gillani directly:
              </p>

              <div className="space-y-3">
                {/* Phone / Call Now */}
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400 block">Phone / Call Now</span>
                      <span className="text-sm font-semibold text-white">{settings.contactPhone}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Call Now
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400 block">WhatsApp Chat</span>
                      <span className="text-sm font-semibold text-white">{settings.whatsappNumber}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Message
                  </span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400 block">Direct Email</span>
                      <span className="text-sm font-semibold text-white">{settings.contactEmail}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Send Email
                  </span>
                </a>
              </div>

              {/* Response Time Guarantee */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Response Time: Typically under 2 hours</span>
              </div>
            </div>

            {/* Founder Note */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#090d18]/80 text-xs text-slate-300 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block">
                Direct Oversight
              </span>
              <p>
                Every project proposal is reviewed and prepared directly by Syed Ehtisham Gillani,
                Founder of Nova Web Studio, guaranteeing personalized attention and clear technical roadmaps.
              </p>
            </div>
          </div>

          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090d18]/90 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Project Consultation Inquiry
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Fill out this form to receive a detailed breakdown, estimated timeline, and tailored quote.
            </p>

            {submissionStatus === 'success' ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-white">Inquiry Received</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {statusText}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmissionStatus('idle')}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-white glass-panel hover:border-cyan-400/50"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submissionStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{statusText}</span>
                  </div>
                )}

                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Tech Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 03375192915 or +92..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Service Selection Dropdown */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Primary Service Needed *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d18] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-[#090d18] text-white">
                        {srv.title}
                      </option>
                    ))}
                    <option value="Custom Project / Multi-Service" className="bg-[#090d18] text-white">
                      Custom Project / Multi-Service Package
                    </option>
                  </select>
                </div>

                {/* Budget Range Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                    Budget Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setBudget(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          budget === opt
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/[0.03] text-slate-300 border border-white/5 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Project Details / Goals *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project, target audience, timeline, or any specific requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[11px] font-mono text-slate-400">
                    No obligation • 100% confidential
                  </span>

                  <button
                    type="submit"
                    disabled={submissionStatus === 'sending'}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submissionStatus === 'sending' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
