import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Shield,
  Play,
  Monitor,
} from 'lucide-react';
import { Project, ProjectType } from '../types';

interface ProjectModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onInquireProject: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  onClose,
  onSelectProject,
  onInquireProject,
}) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (project) {
      setActiveImage(project.mainImage);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject =
    allProjects[(currentIndex + 1) % allProjects.length] || allProjects[0];
  const prevProject =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length] ||
    allProjects[allProjects.length - 1];

  const getTypeLabel = (type: ProjectType) => {
    switch (type) {
      case 'real':
        return 'Real Client Project';
      case 'concept':
        return 'Concept Exploration';
      case 'demo':
        return 'Live Technology Demo';
      default:
        return 'Project';
    }
  };

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

  const allImages = [project.mainImage, ...(project.galleryImages || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#07090e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0b101d] shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono border ${getBadgeStyle(
                project.projectType
              )}`}
            >
              {getTypeLabel(project.projectType)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next shortcuts */}
            {allProjects.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button
                  onClick={() => onSelectProject(prevProject)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Previous Project"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectProject(nextProject)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Next Project"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Main Visual Display */}
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40">
              <img
                src={activeImage || project.mainImage}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img
                        ? 'border-cyan-400 scale-95'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Title & Metadata Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-1">
                <span>Client / Context: {project.client}</span>
                <span>•</span>
                <span>Year: {project.year}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {project.liveUrl && project.liveUrl !== '#' ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <span>Open Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => onInquireProject(project.title)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <span>Inquire About Similar Work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Project Video Section (if available) */}
          {project.videoUrl && (
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-semibold">
                <Play className="w-4 h-4 fill-cyan-400" />
                <span>VIDEO DEMONSTRATION</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                <video
                  src={project.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Core Case Study Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem / Challenge */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2 bg-[#090d18]/80">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                The Problem / Challenge
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                What needed to be solved
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* Solution & Implementation */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2 bg-[#090d18]/80">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                The Solution & Engineering
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                How Nova Web Studio engineered it
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Full Description / Deep Dive */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 bg-[#090d18]/80">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              Project Overview & Narrative
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Results / Goals Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                {project.projectType === 'real'
                  ? 'Key Results & Verified Metrics'
                  : 'Design Goals & Concept Metrics'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-4 rounded-2xl border border-white/10 text-center bg-[#090d18]/90"
                  >
                    <div className="font-display text-2xl font-extrabold text-cyan-400 mb-1">
                      {m.metric}
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Technologies & Frameworks Deployed
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar: Next Project Button */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0b101d] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onInquireProject(project.title)}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            Have a project like this? <span className="text-cyan-400 underline">Start a conversation</span>
          </button>

          {allProjects.length > 1 && (
            <button
              onClick={() => onSelectProject(nextProject)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-200 glass-panel hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <span>Next Project: {nextProject.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
