import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
  Play,
  ArrowRight,
  Eye,
  CheckCircle2,
  Cpu,
  Monitor,
} from 'lucide-react';
import { Project, PortfolioCategory, ProjectType } from '../types';

interface PortfolioSectionProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

const CATEGORIES: ('All' | PortfolioCategory)[] = [
  'All',
  'Websites',
  'E-commerce',
  'Web Apps',
  'SaaS',
  'AI',
  'UI/UX',
  'Branding',
];

const TYPE_FILTERS: { label: string; value: 'all' | ProjectType }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Real Projects', value: 'real' },
  { label: 'Concept Projects', value: 'concept' },
  { label: 'Live Demos', value: 'demo' },
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  onOpenProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | PortfolioCategory>('All');
  const [selectedType, setSelectedType] = useState<'all' | ProjectType>('all');

  const filteredProjects = projects.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchType = selectedType === 'all' || p.projectType === selectedType;
    return matchCategory && matchType;
  });

  const getBadgeStyle = (type: ProjectType) => {
    switch (type) {
      case 'real':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'concept':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'demo':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  const getTypeLabel = (type: ProjectType) => {
    switch (type) {
      case 'real':
        return 'Real Client Project';
      case 'concept':
        return 'Concept Project';
      case 'demo':
        return 'Demo Project';
      default:
        return 'Project';
    }
  };

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SELECTED PORTFOLIO</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured Work & <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Digital Case Studies.
              </span>
            </h2>
          </div>
          <div className="max-w-md space-y-2">
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Explore our real client work, conceptual lab explorations, and interactive technology demos.
              Every project is clearly labeled for authentic transparency.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white glass-panel'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Type Filter */}
          <div className="flex items-center gap-1 glass-panel px-2 py-1 rounded-full border border-white/10">
            {TYPE_FILTERS.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedType(tf.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                  selectedType === tf.value
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center max-w-md mx-auto my-12">
            <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-slate-400">
              No projects match the selected category and filter combination.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between bg-[#090d18]/80 hover:bg-[#0c1424]/90"
              >
                {/* Image / Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-[#07090e]">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-black/30" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono border backdrop-blur-md ${getBadgeStyle(
                        project.projectType
                      )}`}
                    >
                      {getTypeLabel(project.projectType)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {project.videoUrl && (
                    <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-cyan-500/80 text-black backdrop-blur-md" title="Video preview available">
                      <Play className="w-3 h-3 fill-black" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {project.summary}
                    </p>

                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Live Demo + View Case Study */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onOpenProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case Study</span>
                    </button>

                    {project.liveUrl && project.liveUrl !== '#' ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white glass-panel hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    ) : (
                      <button
                        onClick={() => onOpenProject(project)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 glass-panel hover:text-white transition-all"
                      >
                        <Monitor className="w-3 h-3 text-cyan-400" />
                        <span>Interactive Preview</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
