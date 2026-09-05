-- ==========================================================
-- NOVA WEB STUDIO - COMPLETE SUPABASE ARCHITECTURE SCHEMA
-- Project Reference: bklxjujyuwwxzvdbidww
-- Project URL: https://bklxjujyuwwxzvdbidww.supabase.co
--
-- Instructions: Copy and paste the entire script below into
-- your Supabase Dashboard -> SQL Editor and click "Run".
-- ==========================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 2. PROJECTS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client TEXT NOT NULL,
  year TEXT NOT NULL,
  category TEXT NOT NULL,
  "projectType" TEXT NOT NULL DEFAULT 'real' CHECK ("projectType" IN ('real', 'concept', 'demo')),
  summary TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  challenge TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  metrics JSONB DEFAULT '[]'::jsonb,
  "techStack" TEXT[] DEFAULT '{}',
  "liveUrl" TEXT DEFAULT '',
  "repoUrl" TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  "mainImage" TEXT NOT NULL DEFAULT '',
  "galleryImages" TEXT[] DEFAULT '{}',
  "videoUrl" TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 3. SERVICES TABLE (15 Core Digital Services)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "iconName" TEXT NOT NULL,
  "shortDesc" TEXT NOT NULL,
  "fullDesc" TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  "deliverablesHighlights" TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  "startingPrice" TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

-- ==========================================================
-- 4. TESTIMONIALS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  "clientName" TEXT NOT NULL,
  "clientRole" TEXT NOT NULL,
  "clientCompany" TEXT NOT NULL,
  "avatarUrl" TEXT DEFAULT '',
  quote TEXT NOT NULL,
  "projectTitle" TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  verified BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 5. FAQS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

-- ==========================================================
-- 6. CONTACT LEADS (Client inquiries submitted from website)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  services_requested TEXT[] DEFAULT '{}',
  "servicesRequested" TEXT[] DEFAULT '{}',
  budget TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 7. SITE SETTINGS TABLE (Global branding, founder bio, SEO, video)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 8. STORAGE BUCKET CONFIGURATION (Portfolio images, logos & media)
-- ==========================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 52428800;

-- ==========================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 9.1 Public Read Access
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- 9.2 Contact Form Submission (Public insert)
DROP POLICY IF EXISTS "Public can submit contact leads" ON public.leads;
CREATE POLICY "Public can submit contact leads" ON public.leads FOR INSERT WITH CHECK (true);

-- 9.3 Admin Full Access (Allows client CMS with anon key or Supabase authenticated users)
DROP POLICY IF EXISTS "Full access to projects" ON public.projects;
CREATE POLICY "Full access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to services" ON public.services;
CREATE POLICY "Full access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to testimonials" ON public.testimonials;
CREATE POLICY "Full access to testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to faqs" ON public.faqs;
CREATE POLICY "Full access to faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to leads" ON public.leads;
CREATE POLICY "Full access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to site settings" ON public.site_settings;
CREATE POLICY "Full access to site settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 9.4 Storage Bucket RLS Policies
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow upload to portfolio assets" ON storage.objects;
CREATE POLICY "Allow upload to portfolio assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow update to portfolio assets" ON storage.objects;
CREATE POLICY "Allow update to portfolio assets" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow delete on portfolio assets" ON storage.objects;
CREATE POLICY "Allow delete on portfolio assets" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'portfolio-assets');

-- ==========================================================
-- 10. INITIAL DEFAULT SITE SETTINGS SEED
-- ==========================================================
INSERT INTO public.site_settings (id, data, updated_at)
VALUES (
  'default_settings',
  '{
    "studioName": "Nova Web Studio",
    "tagline": "Modern Digital Technology & Creative Agency",
    "founderName": "Syed Ehtisham Gillani",
    "founderTitle": "Owner & Founder — Nova Web Studio",
    "founderBio": "Syed Ehtisham Gillani is the Owner & Founder of Nova Web Studio. Under his leadership, Nova Web Studio helps businesses, startups, and brands build modern digital products and grow online. The agency builds websites, web applications, SaaS products, AI solutions, automation systems, and complete digital experiences.",
    "contactEmail": "webstudionova1@gmail.com",
    "contactPhone": "03375192915",
    "whatsappNumber": "03375192915",
    "address": "Pakistan & Global Remote Operations",
    "customLogoText": "NOVA",
    "customLogoUrl": "",
    "projectAvailability": "Accepting New Projects & Free Consultations",
    "callNowEnabled": true,
    "whatsappEnabled": true,
    "heroBackgroundMode": "3d-canvas",
    "heroVideoUrl": "",
    "heroVideoScrubEnabled": true,
    "heroVideoPlaybackRate": 0.6
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
