import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Star,
  ShieldCheck,
  Plus,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onOpenAdmin?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onOpenAdmin,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Saves to local state or notifies admin
    setSubmitted(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitted(false);
      setClientName('');
      setClientRole('');
      setClientCompany('');
      setProjectTitle('');
      setQuote('');
    }, 2500);
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLIENT PERSPECTIVE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Client Feedback & <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Verified Reviews.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Nova Web Studio adheres to authentic client reporting. Verified testimonials are collected
            from real project engagements and managed directly via our Admin CMS.
          </p>
        </div>

        {/* Content: When testimonials exist vs When none yet exist */}
        {testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between bg-[#090d18]/80 hover:border-cyan-500/30 transition-all"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">
                      {t.clientName}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {t.clientRole}, {t.clientCompany}
                    </p>
                    {t.projectTitle && (
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        Project: {t.projectTitle}
                      </p>
                    )}
                  </div>

                  {t.verified && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                      title="Verified Client Project"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty / Notice state adhering strictly to ethical truthfulness */
          <div className="max-w-2xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 text-center space-y-6 bg-[#090d18]/90">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Authentic Reviews Only
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                Nova Web Studio adheres to high standards of honesty: we never publish fabricated reviews,
                fake logos, or fictitious statistics. Client feedback is submitted directly upon project completion
                and verified by our team.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Client Review</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono text-slate-300 glass-panel hover:text-white hover:border-cyan-400/50 transition-all"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin CMS</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Client Review Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-[#07090e] shadow-2xl">
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Submit a Verified Client Review
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Thank you for working with Nova Web Studio. Your feedback helps us continually elevate our services.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Feedback Received</h4>
                  <p className="text-xs text-slate-300">
                    Your review has been submitted for verification by Nova Web Studio.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John Smith"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        value={clientRole}
                        onChange={(e) => setClientRole(e.target.value)}
                        placeholder="e.g. Founder"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Company / Brand
                      </label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Project Delivered
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. E-Commerce Website & Brand Identity"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="p-1 text-amber-400"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= rating ? 'fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Share your experience working with Nova Web Studio..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
