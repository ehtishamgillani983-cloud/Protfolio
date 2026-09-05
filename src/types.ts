export type ProjectType = 'real' | 'concept' | 'demo';
export type VisualStyle = 'cyber' | 'quantum' | 'nebula';

export type PortfolioCategory =
  | 'Websites'
  | 'E-commerce'
  | 'Web Apps'
  | 'SaaS'
  | 'AI'
  | 'UI/UX'
  | 'Branding';

export interface ProjectMetric {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  year: string;
  category: PortfolioCategory;
  projectType: ProjectType; // Clearly distinguishing real projects, concept projects, and demo projects
  summary: string;
  fullDescription: string;
  challenge: string;
  solution: string;
  metrics: ProjectMetric[];
  techStack: string[];
  liveUrl: string;
  repoUrl?: string;
  featured: boolean;
  mainImage: string;
  galleryImages: string[];
  videoUrl?: string;
  order: number;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  iconName: string; // Lucide icon key
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  deliverablesHighlights: string[];
  technologies: string[];
  startingPrice?: string;
  featured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  avatarUrl: string;
  quote: string;
  projectTitle: string;
  rating: number; // 1-5
  verified: boolean;
  createdAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  servicesRequested: string[];
  budget: string;
  timeline?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'closed';
  createdAt: string;
}

export interface SocialLink {
  platform: 'github' | 'twitter' | 'linkedin' | 'instagram' | 'dribbble' | 'behance' | 'youtube' | 'facebook';
  url: string;
  handle: string;
}

export interface TimezoneItem {
  city: string;
  tz: string;
  offsetLabel: string;
}

export interface SiteSettings {
  studioName: string;
  tagline: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderAvatar: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address?: string;
  timezones: TimezoneItem[];
  socialLinks: SocialLink[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalUrl: string;
    ogImage: string;
    googleAnalyticsId?: string;
  };
  customLogoUrl?: string;
  customLogoText: string;
  projectAvailability: string;
  callNowEnabled: boolean;
  whatsappEnabled: boolean;
  // Cinematic background video configuration for Hero
  heroBackgroundMode: '3d-canvas' | 'cinematic-video' | 'hybrid';
  heroVideoUrl?: string; // Replaceable video URL or frame sequence video
  heroVideoScrubEnabled: boolean; // Scroll-controlled playback
  heroVideoPlaybackRate: number; // Slow smooth speed (e.g. 0.6)
}

export interface IndustryItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  stat: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; level: number; tags: string[] }[];
}

export interface ProcessStep {
  step: string;
  title: string;
  phase: string;
  description: string;
  deliverables: string[];
  duration: string;
}
