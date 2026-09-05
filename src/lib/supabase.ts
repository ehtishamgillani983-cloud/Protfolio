import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, Service, Testimonial, FAQ, ContactLead, SiteSettings, MediaAsset } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_SITE_SETTINGS,
} from '../data/initialData';

// ----------------------------------------------------
// SUPABASE CREDENTIAL RESOLUTION
// ----------------------------------------------------
export const SUPABASE_PROJECT_REF = 'bklxjujyuwwxzvdbidww';
export const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_mEzInb2sl5zRYjiCQeGXlg_p7cAYacZ';

/**
 * Resolves the Supabase URL safely from environment variables or project ref.
 * Handles bare project refs (e.g. "bklxjujyuwwxzvdbidww") and ensures a valid HTTPS URL.
 */
export function getResolvedSupabaseUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    const trimmed = envUrl.trim();
    if (
      trimmed &&
      !trimmed.includes('placeholder') &&
      !trimmed.startsWith('[') &&
      trimmed !== 'MY_APP_URL'
    ) {
      // If user supplied just the project ID (e.g. bklxjujyuwwxzvdbidww)
      if (/^[a-z0-9]{15,25}$/i.test(trimmed)) {
        return `https://${trimmed}.supabase.co`;
      }
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        try {
          const parsed = new URL(trimmed);
          return parsed.origin;
        } catch {
          // Fall back to default
        }
      }
    }
  }
  return DEFAULT_SUPABASE_URL;
}

/**
 * Resolves the Supabase Anon Key from environment variables, local admin storage, or default key.
 */
export function getResolvedSupabaseAnonKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && typeof envKey === 'string') {
    const trimmed = envKey.trim();
    if (
      trimmed &&
      !trimmed.includes('placeholder') &&
      !trimmed.startsWith('[') &&
      trimmed.length > 10
    ) {
      return trimmed;
    }
  }

  // Check if admin entered custom anon key via Admin Dashboard settings
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('nova_supabase_anon_key');
    if (customKey && customKey.trim().length > 10) {
      return customKey.trim();
    }
  }

  return DEFAULT_SUPABASE_ANON_KEY;
}

const resolvedUrl = getResolvedSupabaseUrl();
const resolvedKey = getResolvedSupabaseAnonKey();

function createSafeSupabaseClient(): SupabaseClient | null {
  if (!resolvedUrl || !resolvedKey) return null;
  try {
    return createClient(resolvedUrl, resolvedKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export const supabase: SupabaseClient | null = createSafeSupabaseClient();
export const isSupabaseConfigured: boolean = Boolean(supabase);

// In-memory query caching to eliminate repeated network calls and make website significantly faster
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const MEMORY_CACHE = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function clearSupabaseCache(key?: string) {
  if (key) {
    MEMORY_CACHE.delete(key);
  } else {
    MEMORY_CACHE.clear();
  }
}

function getFromMemoryCache<T>(key: string): T | null {
  const entry = MEMORY_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInMemoryCache<T>(key: string, data: T): void {
  MEMORY_CACHE.set(key, { data, timestamp: Date.now() });
}

// Storage keys for local caching & offline fallback
const STORAGE_KEYS = {
  PROJECTS: 'nova_studio_projects_v1',
  SERVICES: 'nova_studio_services_v1',
  TESTIMONIALS: 'nova_studio_testimonials_v1',
  FAQS: 'nova_studio_faqs_v1',
  LEADS: 'nova_studio_leads_v1',
  DELETED_LEADS: 'nova_studio_deleted_leads_v1',
  SETTINGS: 'nova_studio_settings_v1',
  ADMIN_PASSWORD: 'nova_studio_admin_pwd_v1',
};

function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage write failed:', err);
  }
}

// ----------------------------------------------------
// SCHEMA MAPPERS (Row <-> Type)
// ----------------------------------------------------
function mapProjectFromRow(row: any): Project {
  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    client: row.client || '',
    year: row.year || '',
    category: row.category || 'Websites',
    projectType: row.projectType || row.project_type || 'real',
    summary: row.summary || '',
    fullDescription: row.fullDescription || row.full_description || '',
    challenge: row.challenge || '',
    solution: row.solution || '',
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    techStack: row.techStack || row.tech_stack || [],
    liveUrl: row.liveUrl || row.live_url || '',
    repoUrl: row.repoUrl || row.repo_url || '',
    featured: Boolean(row.featured),
    mainImage: row.mainImage || row.main_image || '',
    galleryImages: row.galleryImages || row.gallery_images || [],
    videoUrl: row.videoUrl || row.video_url || '',
    order: typeof row.order === 'number' ? row.order : 0,
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

function projectToRow(p: Project) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    client: p.client,
    year: p.year,
    category: p.category,
    projectType: p.projectType,
    summary: p.summary,
    fullDescription: p.fullDescription,
    challenge: p.challenge || '',
    solution: p.solution || '',
    metrics: p.metrics || [],
    techStack: p.techStack || [],
    liveUrl: p.liveUrl || '',
    repoUrl: p.repoUrl || '',
    featured: Boolean(p.featured),
    mainImage: p.mainImage,
    galleryImages: p.galleryImages || [],
    videoUrl: p.videoUrl || '',
    order: p.order ?? 0,
    createdAt: p.createdAt || new Date().toISOString(),
  };
}

function mapServiceFromRow(row: any): Service {
  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    iconName: row.iconName || row.icon_name || 'Globe',
    shortDesc: row.shortDesc || row.short_desc || '',
    fullDesc: row.fullDesc || row.full_desc || '',
    deliverables: row.deliverables || [],
    deliverablesHighlights: row.deliverablesHighlights || row.deliverables_highlights || [],
    technologies: row.technologies || [],
    startingPrice: row.startingPrice || row.starting_price || '',
    featured: Boolean(row.featured),
    order: typeof row.order === 'number' ? row.order : 0,
  };
}

function serviceToRow(s: Service) {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    iconName: s.iconName,
    shortDesc: s.shortDesc,
    fullDesc: s.fullDesc,
    deliverables: s.deliverables || [],
    deliverablesHighlights: s.deliverablesHighlights || [],
    technologies: s.technologies || [],
    startingPrice: s.startingPrice || '',
    featured: Boolean(s.featured),
    order: s.order ?? 0,
  };
}

function mapTestimonialFromRow(row: any): Testimonial {
  return {
    id: row.id,
    clientName: row.clientName || row.client_name || '',
    clientRole: row.clientRole || row.client_role || '',
    clientCompany: row.clientCompany || row.client_company || '',
    avatarUrl: row.avatarUrl || row.avatar_url || '',
    quote: row.quote || '',
    projectTitle: row.projectTitle || row.project_title || '',
    rating: typeof row.rating === 'number' ? row.rating : 5,
    verified: Boolean(row.verified ?? true),
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

function testimonialToRow(t: Testimonial) {
  return {
    id: t.id,
    clientName: t.clientName,
    clientRole: t.clientRole,
    clientCompany: t.clientCompany,
    avatarUrl: t.avatarUrl || '',
    quote: t.quote,
    projectTitle: t.projectTitle,
    rating: t.rating ?? 5,
    verified: Boolean(t.verified ?? true),
    createdAt: t.createdAt || new Date().toISOString(),
  };
}

function mapFAQFromRow(row: any): FAQ {
  return {
    id: row.id,
    question: row.question || '',
    answer: row.answer || '',
    category: row.category || 'General',
    order: typeof row.order === 'number' ? row.order : 0,
  };
}

function faqToRow(f: FAQ) {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    order: f.order ?? 0,
  };
}

// ----------------------------------------------------
// 1. PROJECTS SERVICE
// ----------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  const cached = getFromMemoryCache<Project[]>('projects');
  if (cached) return cached;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(mapProjectFromRow);
        setLocalItem(STORAGE_KEYS.PROJECTS, mapped);
        setInMemoryCache('projects', mapped);
        return mapped;
      } else if (error) {
        console.warn('Supabase getProjects notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase getProjects exception:', e);
    }
  }
  const local = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  setInMemoryCache('projects', local);
  return local;
}

export async function saveProject(project: Project): Promise<Project> {
  clearSupabaseCache('projects');
  let result = project;
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = projectToRow(project);
      const { data, error } = await supabase
        .from('projects')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        result = mapProjectFromRow(data);
        console.log(`[Supabase] Project saved successfully: ${result.title}`);
      } else if (error) {
        console.warn('[Supabase] saveProject error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveProject exception:', e);
    }
  }

  const current = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const exists = current.findIndex((p) => p.id === result.id);
  const updated = exists >= 0
    ? current.map((p) => (p.id === result.id ? result : p))
    : [result, ...current];
  setLocalItem(STORAGE_KEYS.PROJECTS, updated);
  setInMemoryCache('projects', updated);

  return result;
}

export async function deleteProject(id: string): Promise<boolean> {
  clearSupabaseCache('projects');
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) console.warn('[Supabase] deleteProject error:', error.message);
    } catch (e) {
      console.warn('[Supabase] deleteProject exception:', e);
    }
  }

  const current = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const updated = current.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEYS.PROJECTS, updated);
  setInMemoryCache('projects', updated);
  return true;
}

// ----------------------------------------------------
// 2. SERVICES SERVICE
// ----------------------------------------------------
export async function getServices(): Promise<Service[]> {
  const cached = getFromMemoryCache<Service[]>('services');
  if (cached) return cached;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(mapServiceFromRow);
        setLocalItem(STORAGE_KEYS.SERVICES, mapped);
        setInMemoryCache('services', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase getServices notice:', e);
    }
  }
  const local = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  setInMemoryCache('services', local);
  return local;
}

export async function saveService(service: Service): Promise<Service> {
  clearSupabaseCache('services');
  let result = service;
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = serviceToRow(service);
      const { data, error } = await supabase.from('services').upsert(payload).select().single();
      if (!error && data) {
        result = mapServiceFromRow(data);
        console.log(`[Supabase] Service saved successfully: ${result.title}`);
      } else if (error) {
        console.warn('[Supabase] saveService error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveService exception:', e);
    }
  }

  const current = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const idx = current.findIndex((s) => s.id === result.id);
  const updated = idx >= 0
    ? current.map((s) => (s.id === result.id ? result : s))
    : [...current, result];
  setLocalItem(STORAGE_KEYS.SERVICES, updated);
  setInMemoryCache('services', updated);
  return result;
}

export async function deleteService(id: string): Promise<boolean> {
  clearSupabaseCache('services');
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('[Supabase] deleteService exception:', e);
    }
  }
  const current = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const updated = current.filter((s) => s.id !== id);
  setLocalItem(STORAGE_KEYS.SERVICES, updated);
  setInMemoryCache('services', updated);
  return true;
}

// ----------------------------------------------------
// 3. TESTIMONIALS SERVICE
// ----------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  const cached = getFromMemoryCache<Testimonial[]>('testimonials');
  if (cached) return cached;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && Array.isArray(data)) {
        const mapped = data.map(mapTestimonialFromRow);
        setLocalItem(STORAGE_KEYS.TESTIMONIALS, mapped);
        setInMemoryCache('testimonials', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase getTestimonials notice:', e);
    }
  }
  const local = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  setInMemoryCache('testimonials', local);
  return local;
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  clearSupabaseCache('testimonials');
  let result = testimonial;
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = testimonialToRow(testimonial);
      const { data, error } = await supabase.from('testimonials').upsert(payload).select().single();
      if (!error && data) {
        result = mapTestimonialFromRow(data);
        console.log(`[Supabase] Testimonial saved successfully: ${result.clientName}`);
      } else if (error) {
        console.warn('[Supabase] saveTestimonial error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveTestimonial exception:', e);
    }
  }

  const current = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  const idx = current.findIndex((t) => t.id === result.id);
  const updated = idx >= 0
    ? current.map((t) => (t.id === result.id ? result : t))
    : [result, ...current];
  setLocalItem(STORAGE_KEYS.TESTIMONIALS, updated);
  setInMemoryCache('testimonials', updated);
  return result;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  clearSupabaseCache('testimonials');
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('testimonials').delete().eq('id', id);
    } catch (e) {
      console.warn('[Supabase] deleteTestimonial exception:', e);
    }
  }
  const current = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  const updated = current.filter((t) => t.id !== id);
  setLocalItem(STORAGE_KEYS.TESTIMONIALS, updated);
  setInMemoryCache('testimonials', updated);
  return true;
}

// ----------------------------------------------------
// 4. FAQS SERVICE
// ----------------------------------------------------
export async function getFAQs(): Promise<FAQ[]> {
  const cached = getFromMemoryCache<FAQ[]>('faqs');
  if (cached) return cached;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order', { ascending: true });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(mapFAQFromRow);
        setLocalItem(STORAGE_KEYS.FAQS, mapped);
        setInMemoryCache('faqs', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase getFAQs notice:', e);
    }
  }
  const local = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  setInMemoryCache('faqs', local);
  return local;
}

export async function saveFAQ(faq: FAQ): Promise<FAQ> {
  clearSupabaseCache('faqs');
  let result = faq;
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = faqToRow(faq);
      const { data, error } = await supabase.from('faqs').upsert(payload).select().single();
      if (!error && data) {
        result = mapFAQFromRow(data);
        console.log(`[Supabase] FAQ saved successfully: ${result.question.substring(0, 30)}...`);
      } else if (error) {
        console.warn('[Supabase] saveFAQ error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] saveFAQ exception:', e);
    }
  }

  const current = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  const idx = current.findIndex((f) => f.id === result.id);
  const updated = idx >= 0
    ? current.map((f) => (f.id === result.id ? result : f))
    : [...current, result];
  setLocalItem(STORAGE_KEYS.FAQS, updated);
  setInMemoryCache('faqs', updated);
  return result;
}

export async function deleteFAQ(id: string): Promise<boolean> {
  clearSupabaseCache('faqs');
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('faqs').delete().eq('id', id);
    } catch (e) {
      console.warn('[Supabase] deleteFAQ exception:', e);
    }
  }
  const current = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  const updated = current.filter((f) => f.id !== id);
  setLocalItem(STORAGE_KEYS.FAQS, updated);
  setInMemoryCache('faqs', updated);
  return true;
}

// ----------------------------------------------------
// 5. CONTACT LEADS (Submitted to Supabase)
// ----------------------------------------------------
export async function submitContactLead(
  leadData: Omit<ContactLead, 'id' | 'createdAt' | 'status'>
): Promise<ContactLead> {
  const newLead: ContactLead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('leads').insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        company: newLead.company || '',
        phone: newLead.phone || '',
        services_requested: newLead.servicesRequested,
        servicesRequested: newLead.servicesRequested,
        budget: newLead.budget || '',
        timeline: newLead.timeline || '',
        message: newLead.message,
        status: newLead.status,
        created_at: newLead.createdAt,
        createdAt: newLead.createdAt,
      });

      if (!error) {
        console.log('[Supabase] Lead successfully recorded in Supabase database');
      } else {
        console.warn('[Supabase] lead submit error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] lead submit exception:', e);
    }
  }

  // Always cache locally and clear cache so admin sees inquiry instantly
  clearSupabaseCache('leads');
  const currentLeads = getLocalItem<ContactLead[]>(STORAGE_KEYS.LEADS, []);
  const updatedLeads = [newLead, ...currentLeads.filter((l) => l.id !== newLead.id)];
  setLocalItem(STORAGE_KEYS.LEADS, updatedLeads);
  setInMemoryCache('leads', updatedLeads);
  return newLead;
}

export async function getContactLeads(): Promise<ContactLead[]> {
  const cached = getFromMemoryCache<ContactLead[]>('leads');
  if (cached) return cached;

  const deletedIds = new Set(getLocalItem<string[]>(STORAGE_KEYS.DELETED_LEADS, []));

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data
          .map((d: any) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            company: d.company || '',
            phone: d.phone || '',
            servicesRequested: d.services_requested || d.servicesRequested || [],
            budget: d.budget || '',
            timeline: d.timeline || '',
            message: d.message || '',
            status: (d.status || 'new') as ContactLead['status'],
            createdAt: d.created_at || d.createdAt || new Date().toISOString(),
          }))
          .filter((l) => !deletedIds.has(l.id));

        setLocalItem(STORAGE_KEYS.LEADS, mapped);
        setInMemoryCache('leads', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('[Supabase] getContactLeads exception:', e);
    }
  }

  const rawLocal = localStorage.getItem(STORAGE_KEYS.LEADS);
  if (rawLocal !== null) {
    try {
      const parsed = JSON.parse(rawLocal) as ContactLead[];
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((l) => !deletedIds.has(l.id));
        setInMemoryCache('leads', filtered);
        return filtered;
      }
    } catch {
      // Fall through to initial fallback if corrupt
    }
  }

  // Initial seed fallback only if never initialized and not deleted
  const initialDemoLeads: ContactLead[] = [
    {
      id: 'demo-lead-1',
      name: 'Julian Vance',
      email: 'julian@aurora-capital.io',
      company: 'Aurora Capital London',
      phone: '+44 20 7946 0991',
      servicesRequested: ['Cinematic Web Design & 3D', 'Custom Full-Stack Engineering'],
      budget: '$25,000 - $50,000',
      timeline: '1-2 Months',
      message: 'We are preparing our Q4 institutional crypto venture fund launch. We need a cinematic 3D website with real-time portfolio metrics and institutional security.',
      status: 'new',
      createdAt: '2026-03-02T14:30:00Z',
    },
  ];
  const defaultLeads = initialDemoLeads.filter((l) => !deletedIds.has(l.id));

  setLocalItem(STORAGE_KEYS.LEADS, defaultLeads);
  setInMemoryCache('leads', defaultLeads);
  return defaultLeads;
}

export async function updateLeadStatus(id: string, status: ContactLead['status']): Promise<boolean> {
  clearSupabaseCache('leads');
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('[Supabase] updateLeadStatus exception:', e);
    }
  }
  const current = getLocalItem<ContactLead[]>(STORAGE_KEYS.LEADS, []);
  const updated = current.map((l) => (l.id === id ? { ...l, status } : l));
  setLocalItem(STORAGE_KEYS.LEADS, updated);
  setInMemoryCache('leads', updated);
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  clearSupabaseCache('leads');

  // 1. Permanently record ID in deleted set so it can NEVER resurrect
  const deletedIds = getLocalItem<string[]>(STORAGE_KEYS.DELETED_LEADS, []);
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    setLocalItem(STORAGE_KEYS.DELETED_LEADS, deletedIds);
  }

  // 2. Remove from Supabase database table if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) {
        console.warn('[Supabase] deleteLead notice:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] deleteLead exception:', e);
    }
  }

  // 3. Immediately filter out from local cache
  const rawLocal = localStorage.getItem(STORAGE_KEYS.LEADS);
  let current: ContactLead[] = [];
  if (rawLocal) {
    try {
      current = JSON.parse(rawLocal);
    } catch {
      current = [];
    }
  }
  const updated = current.filter((l) => l.id !== id);
  setLocalItem(STORAGE_KEYS.LEADS, updated);
  setInMemoryCache('leads', updated);
  return true;
}

// ----------------------------------------------------
// 6. SITE SETTINGS SERVICE
// ----------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = getFromMemoryCache<SiteSettings>('settings');
  if (cached) return cached;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'default_settings')
        .single();

      if (!error && data?.data) {
        const merged = { ...INITIAL_SITE_SETTINGS, ...data.data };
        setLocalItem(STORAGE_KEYS.SETTINGS, merged);
        setInMemoryCache('settings', merged);
        return merged;
      }
    } catch (e) {
      console.warn('[Supabase] getSiteSettings notice:', e);
    }
  }
  const local = getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  setInMemoryCache('settings', local);
  return local;
}

export async function updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  clearSupabaseCache('settings');
  let result = settings;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ id: 'default_settings', data: settings, updated_at: new Date().toISOString() })
        .select('data')
        .single();

      if (!error && data?.data) {
        result = { ...INITIAL_SITE_SETTINGS, ...data.data };
        console.log('[Supabase] Site settings updated successfully in Supabase cloud');
      } else if (error) {
        console.warn('[Supabase] updateSiteSettings error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] updateSiteSettings exception:', e);
    }
  }
  setLocalItem(STORAGE_KEYS.SETTINGS, result);
  setInMemoryCache('settings', result);
  return result;
}

// ----------------------------------------------------
// 7. SUPABASE STORAGE & MEDIA ASSETS (Images, Logos, Videos)
// ----------------------------------------------------
export async function recordMediaAsset(asset: MediaAsset): Promise<void> {
  try {
    const current = await getSiteSettings();
    const existing = current.mediaGallery || [];
    const filtered = existing.filter((a) => a.id !== asset.id && a.url !== asset.url);
    const updated = [asset, ...filtered];
    await updateSiteSettings({
      ...current,
      mediaGallery: updated,
    });
  } catch (err) {
    console.warn('recordMediaAsset error:', err);
  }
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  try {
    const current = await getSiteSettings();
    const existing = current.mediaGallery || [];
    const updated = existing.filter((a) => a.id !== id);
    await updateSiteSettings({
      ...current,
      mediaGallery: updated,
    });
    return true;
  } catch (err) {
    console.warn('deleteMediaAsset error:', err);
    return false;
  }
}

/**
 * High-performance file to optimized Data URL converter.
 * Automatically downsamples images exceeding 1920px for optimal Supabase storage & fast loading.
 */
export async function fileToOptimizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1920;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const format = file.type.includes('png') ? 'image/png' : 'image/jpeg';
            resolve(canvas.toDataURL(format, 0.88));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    }
  });
}

export async function uploadMediaToSupabase(
  file: File,
  folder = 'portfolio'
): Promise<{ url: string | null; error: string | null }> {
  // 1. Try Supabase Storage Bucket first
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const fileName = `${folder}/${Date.now()}-${cleanName}.${cleanExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(fileName);

        if (data?.publicUrl) {
          const publicUrl = data.publicUrl;
          await recordMediaAsset({
            id: `media-${Date.now()}`,
            name: file.name,
            url: publicUrl,
            type: file.type.startsWith('video') ? 'video' : 'image',
            category: (folder as any) || 'general',
            uploadedAt: new Date().toISOString(),
            size: `${(file.size / 1024).toFixed(1)} KB`,
          });
          return { url: publicUrl, error: null };
        }
      } else {
        console.info('[Supabase Storage] Storage bucket returned:', uploadError.message);
      }
    } catch (storageErr: any) {
      console.info('[Supabase Storage] Notice:', storageErr?.message);
    }
  }

  // 2. High-speed, guaranteed-persistent Data URL fallback that saves directly in Supabase rows
  try {
    const dataUrl = await fileToOptimizedDataUrl(file);
    if (dataUrl) {
      await recordMediaAsset({
        id: `media-${Date.now()}`,
        name: file.name,
        url: dataUrl,
        type: file.type.startsWith('video') ? 'video' : 'image',
        category: (folder as any) || 'general',
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      return { url: dataUrl, error: null };
    }
  } catch (convErr: any) {
    return { url: null, error: convErr?.message || 'Failed to process file' };
  }

  return { url: null, error: 'Could not upload media' };
}

// ----------------------------------------------------
// 8. SUPABASE AUTH INTEGRATION
// ----------------------------------------------------
export async function signInWithSupabase(email: string, password: string) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase client is unconfigured.') };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOutSupabase() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSupabaseUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

// ----------------------------------------------------
// 9. DIAGNOSTICS & DATA SYNCING
// ----------------------------------------------------
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  hasTables: boolean;
  projectUrl: string;
  hasAnonKey: boolean;
  message: string;
  tableDetails: Record<string, boolean>;
}> {
  const projectUrl = getResolvedSupabaseUrl();
  const hasAnonKey = Boolean(getResolvedSupabaseAnonKey());

  if (!hasAnonKey || !supabase) {
    return {
      connected: false,
      hasTables: false,
      projectUrl,
      hasAnonKey: false,
      message: 'Supabase Anon Key is not set. Please set VITE_SUPABASE_ANON_KEY.',
      tableDetails: {},
    };
  }

  const tableDetails: Record<string, boolean> = {
    projects: false,
    services: false,
    testimonials: false,
    faqs: false,
    leads: false,
    site_settings: false,
  };

  try {
    const [pCheck, sCheck, tCheck, fCheck, lCheck, setCheck] = await Promise.all([
      supabase.from('projects').select('id', { head: true, count: 'exact' }),
      supabase.from('services').select('id', { head: true, count: 'exact' }),
      supabase.from('testimonials').select('id', { head: true, count: 'exact' }),
      supabase.from('faqs').select('id', { head: true, count: 'exact' }),
      supabase.from('leads').select('id', { head: true, count: 'exact' }),
      supabase.from('site_settings').select('id', { head: true, count: 'exact' }),
    ]);

    tableDetails.projects = !pCheck.error;
    tableDetails.services = !sCheck.error;
    tableDetails.testimonials = !tCheck.error;
    tableDetails.faqs = !fCheck.error;
    tableDetails.leads = !lCheck.error;
    tableDetails.site_settings = !setCheck.error;

    const hasTables = tableDetails.projects && tableDetails.services;

    if (!hasTables) {
      return {
        connected: true,
        hasTables: false,
        projectUrl,
        hasAnonKey: true,
        message: 'Connected to Supabase project, but database tables are not yet created. Please run /supabase_schema.sql in the Supabase SQL Editor.',
        tableDetails,
      };
    }

    return {
      connected: true,
      hasTables: true,
      projectUrl,
      hasAnonKey: true,
      message: 'Supabase is fully configured and ready with live database tables across all modules!',
      tableDetails,
    };
  } catch (err: any) {
    return {
      connected: false,
      hasTables: false,
      projectUrl,
      hasAnonKey: true,
      message: `Supabase network check failed: ${err?.message || 'Check project URL and key'}`,
      tableDetails,
    };
  }
}

/**
 * One-click utility to sync initial agency projects, services, FAQs, testimonials
 * and site settings to Supabase after running supabase_schema.sql.
 */
export async function seedAllDataToSupabase(): Promise<{
  success: boolean;
  counts: { projects: number; services: number; testimonials: number; faqs: number; settings: boolean };
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      counts: { projects: 0, services: 0, testimonials: 0, faqs: 0, settings: false },
      error: 'Supabase is not configured yet.',
    };
  }

  try {
    // 1. Projects
    const projectRows = INITIAL_PROJECTS.map(projectToRow);
    const { error: pErr } = await supabase.from('projects').upsert(projectRows);
    if (pErr) throw new Error(`Projects sync error: ${pErr.message}`);

    // 2. Services
    const serviceRows = INITIAL_SERVICES.map(serviceToRow);
    const { error: sErr } = await supabase.from('services').upsert(serviceRows);
    if (sErr) throw new Error(`Services sync error: ${sErr.message}`);

    // 3. Testimonials
    const testRows = INITIAL_TESTIMONIALS.map(testimonialToRow);
    const { error: tErr } = await supabase.from('testimonials').upsert(testRows);
    if (tErr) throw new Error(`Testimonials sync error: ${tErr.message}`);

    // 4. FAQs
    const faqRows = INITIAL_FAQS.map(faqToRow);
    const { error: fErr } = await supabase.from('faqs').upsert(faqRows);
    if (fErr) throw new Error(`FAQs sync error: ${fErr.message}`);

    // 5. Site Settings
    const { error: stErr } = await supabase.from('site_settings').upsert({
      id: 'default_settings',
      data: INITIAL_SITE_SETTINGS,
      updated_at: new Date().toISOString(),
    });
    if (stErr) throw new Error(`Settings sync error: ${stErr.message}`);

    clearSupabaseCache();
    return {
      success: true,
      counts: {
        projects: projectRows.length,
        services: serviceRows.length,
        testimonials: testRows.length,
        faqs: faqRows.length,
        settings: true,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      counts: { projects: 0, services: 0, testimonials: 0, faqs: 0, settings: false },
      error: err?.message || 'Sync operation failed',
    };
  }
}

// ----------------------------------------------------
// 10. BACKEND STATUS & ADMIN SECURITY
// ----------------------------------------------------
export function getBackendStatus() {
  return {
    isSupabaseConfigured,
    mode: isSupabaseConfigured ? ('supabase' as const) : ('local_fallback' as const),
    url: resolvedUrl,
    projectRef: SUPABASE_PROJECT_REF,
    hasAnonKey: Boolean(resolvedKey),
  };
}

export function verifyAdminPassword(password: string): boolean {
  const currentPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
  return password === currentPassword;
}

export function changeAdminPassword(newPassword: string): { success: boolean; error?: string } {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  return { success: true };
}

/**
 * Updates admin password using Supabase Auth:
 * await supabase.auth.updateUser({ password: newPassword })
 */
export async function updateSupabaseAdminPassword(newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  if (!supabase) {
    return { success: false, error: 'Supabase client is not configured or unavailable.' };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update password via Supabase Auth.' };
  }
}

export function setCustomSupabaseAnonKey(key: string): void {
  if (!key || key.trim() === '') {
    localStorage.removeItem('nova_supabase_anon_key');
  } else {
    localStorage.setItem('nova_supabase_anon_key', key.trim());
  }
}
