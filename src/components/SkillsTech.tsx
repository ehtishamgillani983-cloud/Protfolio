import React from 'react';
import { Cpu, Terminal, Sparkles, Code2, Database, Globe, Cloud, GitBranch } from 'lucide-react';

export const SkillsTech: React.FC = () => {
  const technologies = [
    {
      name: 'React',
      category: 'Frontend Engineering',
      description: 'Modern, component-driven user interfaces with fast state updates and fluid user interactions.',
      highlight: 'Interactive UI',
    },
    {
      name: 'Next.js',
      category: 'Full-Stack Framework',
      description: 'High-speed server rendering, automated SEO routing, and edge-ready deployment.',
      highlight: 'Speed & SEO',
    },
    {
      name: 'TypeScript',
      category: 'Programming Language',
      description: 'Strict type safety, clean code architecture, and bug-resistant application development.',
      highlight: 'Type Safety',
    },
    {
      name: 'JavaScript',
      category: 'Core Web Technology',
      description: 'Modern ES6+ standards powering dynamic browser interactions, animations, and APIs.',
      highlight: 'Dynamic Web',
    },
    {
      name: 'Node.js',
      category: 'Backend Architecture',
      description: 'Lightweight, scalable server backends, microservices, and webhook automation handlers.',
      highlight: 'Server Logic',
    },
    {
      name: 'Supabase',
      category: 'Cloud Backend & Auth',
      description: 'PostgreSQL database hosting, secure user authentication, instant APIs, and storage.',
      highlight: 'Cloud Database',
    },
    {
      name: 'PostgreSQL',
      category: 'Relational Database',
      description: 'Robust, enterprise-grade database management ensuring rock-solid data integrity.',
      highlight: 'Data Integrity',
    },
    {
      name: 'Tailwind CSS',
      category: 'Design & Styling',
      description: 'Modern utility-first styling ensuring lightweight CSS, dark mode, and responsive designs.',
      highlight: 'Responsive Design',
    },
    {
      name: 'Three.js',
      category: '3D & WebGL Graphics',
      description: 'Interactive 3D scenes, particle meshes, and cinematic visual elements rendered in-browser.',
      highlight: 'Interactive 3D',
    },
    {
      name: 'AI APIs',
      category: 'Artificial Intelligence',
      description: 'Integration of LLMs, intelligent 24/7 chatbots, automated agents, and workflow systems.',
      highlight: 'Smart Solutions',
    },
    {
      name: 'GitHub',
      category: 'Version Control',
      description: 'Collaborative code repositories, continuous versioning, and secure code safety.',
      highlight: 'Version Control',
    },
    {
      name: 'Vercel',
      category: 'Global Edge Hosting',
      description: 'Ultra-fast global CDN delivery, automated deployment pipelines, and zero-downtime scaling.',
      highlight: 'Global Edge',
    },
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>TOOLS & CAPABILITIES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Technologies We Build With. <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Proven, Scalable & Fast.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300 font-light leading-relaxed">
            We use industry-standard modern technologies to ensure your digital products load fast, scale
            effortlessly, and remain easy to maintain.
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group bg-[#090d18]/80 hover:bg-[#0c1424]/90"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                    {tech.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">
                    {tech.highlight}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 block mb-2">
                  {tech.category}
                </span>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Production Capability</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
