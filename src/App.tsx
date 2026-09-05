import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutFounder } from './components/AboutFounder';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { SkillsTech } from './components/SkillsTech';
import { IndustriesSection } from './components/IndustriesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import {
  Project,
  Service,
  Testimonial,
  FAQ,
  SiteSettings,
  VisualStyle,
} from './types';
import {
  getProjects,
  getServices,
  getTestimonials,
  getFAQs,
  getSiteSettings,
  updateSiteSettings,
} from './lib/supabase';

// Code splitting & lazy loading for heavy modals and CMS to maximize initial page performance
const ProjectModal = React.lazy(() =>
  import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<string | null>(null);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('cyber');

  // Load all dynamic content from data layer (Supabase-first, local-fallback)
  const refreshData = async () => {
    try {
      const [p, s, t, f, st] = await Promise.all([
        getProjects(),
        getServices(),
        getTestimonials(),
        getFAQs(),
        getSiteSettings(),
      ]);
      setProjects(p);
      setServices(s);
      setTestimonials(t);
      setFaqs(f);
      setSettings(st);
    } catch (err) {
      console.warn('Initial data load completed with local cache.', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setPreSelectedService(serviceTitle);
    scrollToSection('contact');
  };

  const handleInquireFromModal = (projectName: string) => {
    setActiveProjectModal(null);
    setPreSelectedService(`Case Study Ref: ${projectName}`);
    scrollToSection('contact');
  };

  const handleToggleHeroVideoMode = async (mode: '3d-canvas' | 'cinematic-video' | 'hybrid') => {
    if (!settings) return;
    const updated = { ...settings, heroBackgroundMode: mode };
    setSettings(updated);
    await updateSiteSettings(updated);
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#05070c] flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING NOVA WEB STUDIO...</span>
        </div>
      </div>
    );
  }

  const showThreeCanvas = settings.heroBackgroundMode !== 'cinematic-video';

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-cyan-500 selection:text-black relative">
      {/* 3D WebGL Kinetic Background Canvas (rendered unless in pure cinematic video mode) */}
      {showThreeCanvas && (
        <ThreeCanvas
          visualStyle={visualStyle}
          onStyleChange={setVisualStyle}
        />
      )}

      {/* Main Navigation */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => scrollToSection('contact')}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        <Hero
          settings={settings}
          onOpenContact={() => scrollToSection('contact')}
          onExploreWork={() => scrollToSection('work')}
          onToggleHeroVideoMode={handleToggleHeroVideoMode}
        />

        <AboutFounder
          settings={settings}
          onOpenContact={() => scrollToSection('contact')}
        />

        <ServicesSection
          services={services}
          onSelectServiceForContact={handleSelectService}
        />

        <WhyChooseUs />

        <SkillsTech />

        <IndustriesSection
          onSelectIndustry={(industry) =>
            handleSelectService(`Industry Inquiry: ${industry}`)
          }
        />

        <PortfolioSection
          projects={projects}
          onOpenProject={(project) => setActiveProjectModal(project)}
        />

        <ProcessSection
          onStartProject={() => scrollToSection('contact')}
        />

        <TestimonialsSection
          testimonials={testimonials}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        <FAQSection
          faqs={faqs}
          onAskQuestion={() => scrollToSection('contact')}
        />

        <ContactSection
          settings={settings}
          services={services}
          preSelectedService={preSelectedService}
        />

        <FinalCTA
          settings={settings}
          onOpenContact={() => scrollToSection('contact')}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        services={services}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectService={handleSelectService}
      />

      {/* Case Study Detail Modal (Lazy-loaded on demand) */}
      {activeProjectModal && (
        <React.Suspense fallback={null}>
          <ProjectModal
            project={activeProjectModal}
            allProjects={projects}
            onClose={() => setActiveProjectModal(null)}
            onSelectProject={(project) => setActiveProjectModal(project)}
            onInquireProject={handleInquireFromModal}
          />
        </React.Suspense>
      )}

      {/* Full Admin Dashboard / CMS (Lazy-loaded on demand) */}
      {isAdminOpen && (
        <React.Suspense fallback={null}>
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onDataUpdated={refreshData}
          />
        </React.Suspense>
      )}
    </div>
  );
}
