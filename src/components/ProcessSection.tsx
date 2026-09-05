import React from 'react';
import {
  Compass,
  Lightbulb,
  Palette,
  Code2,
  CheckCircle2,
  Rocket,
  Headphones,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PROCESS_STEPS } from '../data/initialData';

const STEP_ICONS = [
  Compass,
  Lightbulb,
  Palette,
  Code2,
  CheckCircle2,
  Rocket,
  Headphones,
];

interface ProcessSectionProps {
  onStartProject?: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onStartProject }) => {
  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOW WE WORK</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our 7-Step <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Client Delivery Process.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            We follow a structured, transparent process from your first consultation to post-launch support,
            ensuring your project is delivered on schedule, with zero surprises.
          </p>
        </div>

        {/* 7 Steps Vertical / Timeline Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => {
            const IconComponent = STEP_ICONS[idx] || Compass;

            return (
              <div
                key={step.step}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group bg-[#090d18]/80 hover:bg-[#0c1424]/90"
              >
                <div>
                  {/* Step number badge & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-cyan-400">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    {step.phase}
                  </span>

                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {step.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Phase {step.step}</span>
                  <span className="text-cyan-300">Milestone Driven</span>
                </div>
              </div>
            );
          })}

          {/* 8th CTA Card in the grid */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-[#0a0f1d] to-[#07090e] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Ready to Start Phase 01?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Book a free initial discovery session with Syed Ehtisham Gillani to discuss your project.
              </p>
            </div>

            <div className="pt-6">
              <a
                href="#contact"
                onClick={onStartProject}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Book Discovery Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
