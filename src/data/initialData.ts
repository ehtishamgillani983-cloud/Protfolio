import {
  Project,
  Service,
  Testimonial,
  FAQ,
  SiteSettings,
  IndustryItem,
  SkillCategory,
  ProcessStep,
} from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  studioName: 'Nova Web Studio',
  tagline: 'Modern Digital Technology & Creative Agency',
  founderName: 'Syed Ehtisham Gillani',
  founderTitle: 'Owner & Founder — Nova Web Studio',
  founderBio:
    'Syed Ehtisham Gillani is the Owner & Founder of Nova Web Studio. Under his leadership, Nova Web Studio helps businesses, startups, and brands build modern digital products and grow online. The agency builds websites, web applications, SaaS products, AI solutions, automation systems, and complete digital experiences.',
  founderAvatar: '/assets/founder-photo.jpg',
  contactEmail: 'webstudionova1@gmail.com',
  contactPhone: '03375192915',
  whatsappNumber: '03375192915',
  address: 'Pakistan & Global Remote Operations',
  timezones: [
    { city: 'Karachi / PKT', tz: 'Asia/Karachi', offsetLabel: 'PKT / UTC+5' },
    { city: 'London', tz: 'Europe/London', offsetLabel: 'GMT / UTC+0' },
    { city: 'New York', tz: 'America/New_York', offsetLabel: 'EST / UTC-5' },
    { city: 'Dubai', tz: 'Asia/Dubai', offsetLabel: 'GST / UTC+4' },
  ],
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com', handle: 'Nova Web Studio' },
    { platform: 'github', url: 'https://github.com', handle: '@novawebstudio' },
    { platform: 'twitter', url: 'https://twitter.com', handle: '@novawebstudio' },
    { platform: 'instagram', url: 'https://instagram.com', handle: '@novawebstudio' },
  ],
  seo: {
    metaTitle: 'Nova Web Studio | Modern Digital Technology & Creative Agency',
    metaDescription:
      'Nova Web Studio helps businesses, startups and brands build modern digital products: websites, web applications, SaaS platforms, AI chatbots, AI agents, and business automation.',
    keywords:
      'Nova Web Studio, Syed Ehtisham Gillani, website design, website development, e-commerce development, SaaS product development, AI chatbots, AI agents, UI/UX design, mobile app development, business automation, SEO, digital technology agency',
    canonicalUrl: 'https://novawebstudio.agency',
    ogImage: '/assets/nova-logo.webp',
    googleAnalyticsId: '',
  },
  customLogoText: 'NOVA',
  customLogoUrl: '/assets/nova-logo.webp',
  projectAvailability: 'Accepting New Projects & Free Consultations',
  callNowEnabled: true,
  whatsappEnabled: true,
  heroBackgroundMode: 'cinematic-video',
  heroVideoUrl: '/assets/hero-bg.mp4',
  heroVideoScrubEnabled: true,
  heroVideoPlaybackRate: 0.5,
  mediaGallery: [
    {
      id: 'media-logo',
      name: 'Nova Studio Logo',
      url: '/assets/nova-logo.webp',
      type: 'image',
      category: 'branding',
      uploadedAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'media-founder',
      name: 'Syed Ehtisham Gillani (Founder)',
      url: '/assets/founder-photo.jpg',
      type: 'image',
      category: 'founder',
      uploadedAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'media-hero-vid',
      name: 'Hero Cinematic Background Video',
      url: '/assets/hero-bg.mp4',
      type: 'video',
      category: 'hero',
      uploadedAt: '2026-03-01T00:00:00Z',
    },
  ],
};

// 15 SERVICES: Simple, clear, easy to understand. No complex technical jargon!
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Website Design',
    slug: 'website-design',
    iconName: 'Layout',
    shortDesc: 'Modern, clean, and visually stunning website layouts designed to attract visitors and build trust.',
    fullDesc:
      'We craft tailored website designs that capture your brand essence. Every layout is crafted for clean readability, intuitive navigation, and high engagement on both desktop and mobile devices.',
    deliverables: [
      'Custom website visual layouts',
      'Mobile and desktop responsive design',
      'Interactive visual prototypes',
      'Brand style and typography guide',
      'High-resolution design assets',
    ],
    deliverablesHighlights: ['Modern Clean Layouts', 'Mobile-First Design', 'Custom Visuals'],
    technologies: ['Figma', 'Responsive Design', 'Wireframing'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 1,
  },
  {
    id: 'srv-2',
    title: 'Website Development',
    slug: 'website-development',
    iconName: 'Code2',
    shortDesc: 'Fast, secure, and responsive websites built with modern web technologies that work smoothly everywhere.',
    fullDesc:
      'We turn website designs into high-speed, secure, and responsive digital products. Using clean modern code, your website will load fast, look sharp on all screens, and be easy to manage.',
    deliverables: [
      'Clean and fast website coding',
      'Fully responsive for all mobile phones and tablets',
      'Contact forms with email alerts',
      'Google search readiness (SEO friendly)',
      'Easy content management setup',
    ],
    deliverablesHighlights: ['Fast Loading', 'Mobile Responsive', 'Clean Code'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 2,
  },
  {
    id: 'srv-3',
    title: 'E-commerce Development',
    slug: 'ecommerce-development',
    iconName: 'ShoppingBag',
    shortDesc: 'Complete online stores with secure payments, simple product catalogs, and easy checkout flows.',
    fullDesc:
      'Sell products online effortlessly. We build modern online stores equipped with product catalogs, shopping carts, secure checkout gateways, order management, and inventory tracking.',
    deliverables: [
      'Online store setup and design',
      'Secure payment gateway integration',
      'Product catalog and search filters',
      'Customer order notifications',
      'Inventory and discount management',
    ],
    deliverablesHighlights: ['Secure Payments', 'Product Management', 'Seamless Checkout'],
    technologies: ['E-Commerce Platforms', 'Stripe', 'Supabase', 'Next.js'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 3,
  },
  {
    id: 'srv-4',
    title: 'Web App Development',
    slug: 'web-app-development',
    iconName: 'Laptop',
    shortDesc: 'Custom interactive web applications designed for business operations, portals, and customer tools.',
    fullDesc:
      'When your business needs more than a standard website, we build custom web applications. From customer portals and booking systems to internal dashboards, our web apps are fast and intuitive.',
    deliverables: [
      'Custom user dashboards and portals',
      'User accounts and authentication',
      'Real-time data updates',
      'Secure cloud database integration',
      'API connections to external software',
    ],
    deliverablesHighlights: ['Custom Dashboards', 'User Accounts', 'Cloud Database'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 4,
  },
  {
    id: 'srv-5',
    title: 'SaaS Product Development',
    slug: 'saas-product-development',
    iconName: 'Layers',
    shortDesc: 'Turn your software idea into a scalable subscription-based product ready for paying users.',
    fullDesc:
      'We help founders and businesses build Software as a Service (SaaS) products from ground up. We handle subscription billing, user management, secure databases, and scalable cloud hosting.',
    deliverables: [
      'Multi-user subscription management',
      'Billing and recurring payment integration',
      'Admin control dashboard',
      'User onboarding flows',
      'Scalable cloud infrastructure',
    ],
    deliverablesHighlights: ['Subscription Billing', 'Admin Controls', 'Scalable Architecture'],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Supabase', 'Stripe'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 5,
  },
  {
    id: 'srv-6',
    title: 'AI Chatbots',
    slug: 'ai-chatbots',
    iconName: 'Bot',
    shortDesc: 'Intelligent AI chat assistants that answer customer questions 24/7 and capture leads automatically.',
    fullDesc:
      'Provide instant customer support day and night. We create intelligent AI chatbots trained on your business information that can answer inquiries, capture visitor contact details, and route questions.',
    deliverables: [
      'Custom-trained 24/7 AI chat widget',
      'Trained on your business FAQ and docs',
      'Automatic lead and email capture',
      'Seamless website integration',
      'Chat history and analytics',
    ],
    deliverablesHighlights: ['24/7 Support', 'Lead Capture', 'Trained on Your Data'],
    technologies: ['AI APIs', 'LLM Integrations', 'Next.js', 'Node.js'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 6,
  },
  {
    id: 'srv-7',
    title: 'AI Agents',
    slug: 'ai-agents',
    iconName: 'Sparkles',
    shortDesc: 'Autonomous AI agents that execute repetitive workflows, process data, and streamline business tasks.',
    fullDesc:
      'Take business efficiency to the next level with autonomous AI agents. These intelligent digital workers can research data, generate reports, respond to emails, and execute multi-step digital operations.',
    deliverables: [
      'Custom task-oriented AI agent workflows',
      'Automated data analysis and reporting',
      'Integration with your business software',
      'Automated email and response drafting',
      'Human-in-the-loop review controls',
    ],
    deliverablesHighlights: ['Autonomous Workflows', 'Smart Data Processing', 'Custom Actions'],
    technologies: ['AI Agents', 'Automation APIs', 'TypeScript', 'Node.js'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 7,
  },
  {
    id: 'srv-8',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    iconName: 'Palette',
    shortDesc: 'User-friendly interfaces and wireframes that make digital products effortless and enjoyable to use.',
    fullDesc:
      'Great digital experiences start with thoughtful design. We design clear user flows, clean visual interfaces, and clickable prototypes that keep visitors engaged and make products easy to navigate.',
    deliverables: [
      'User journey mapping and wireframes',
      'Modern UI component design',
      'Clickable interactive prototypes',
      'Usability and accessibility testing',
      'Developer-ready design files',
    ],
    deliverablesHighlights: ['User-Friendly Flows', 'Clickable Prototypes', 'Modern Aesthetics'],
    technologies: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: 8,
  },
  {
    id: 'srv-9',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    iconName: 'Smartphone',
    shortDesc: 'Cross-platform mobile applications for iOS and Android with smooth navigation and fast performance.',
    fullDesc:
      'Reach customers on their smartphones. We build clean, responsive cross-platform mobile apps with push notifications, offline support, smooth animations, and secure cloud synchronization.',
    deliverables: [
      'iOS and Android compatible application',
      'Push notification capability',
      'User account login and profile management',
      'Cloud data synchronization',
      'App store deployment guidance',
    ],
    deliverablesHighlights: ['iOS & Android', 'Push Notifications', 'Fast & Responsive'],
    technologies: ['React Native / PWA', 'TypeScript', 'Supabase', 'REST APIs'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 9,
  },
  {
    id: 'srv-10',
    title: 'Business Automation',
    slug: 'business-automation',
    iconName: 'Cpu',
    shortDesc: 'Connect your software tools together to eliminate manual repetitive work and save hours every week.',
    fullDesc:
      'Stop wasting time on repetitive manual tasks. We connect your forms, CRM, spreadsheets, email systems, and messaging tools so leads, orders, and customer data sync automatically.',
    deliverables: [
      'Automatic lead notification to WhatsApp / Email',
      'CRM and spreadsheet data syncing',
      'Invoice and receipt automation',
      'Customer onboarding workflow automation',
      'System integration testing and monitoring',
    ],
    deliverablesHighlights: ['Save Time', 'Zero Manual Copy-Paste', 'Instant Alerts'],
    technologies: ['Webhooks', 'Zapier/Make', 'Node.js', 'Supabase'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 10,
  },
  {
    id: 'srv-11',
    title: 'SEO (Search Engine Optimization)',
    slug: 'seo',
    iconName: 'Search',
    shortDesc: 'Help your business appear higher on Google search results and attract high-intent organic visitors.',
    fullDesc:
      'Get found by customers searching for your services online. We optimize your website structure, page speed, meta tags, local listings, and keywords to rank higher on search engines.',
    deliverables: [
      'On-page SEO and keyword optimization',
      'Fast page load speed optimization',
      'Google Search Console and sitemap setup',
      'Schema markup for rich search results',
      'Technical SEO audit and fixes',
    ],
    deliverablesHighlights: ['Higher Google Rank', 'More Organic Traffic', 'Speed Optimization'],
    technologies: ['Google Search Console', 'Technical SEO', 'Structured Data'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 11,
  },
  {
    id: 'srv-12',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    iconName: 'TrendingUp',
    shortDesc: 'Strategic online marketing campaigns, landing pages, and growth funnels that generate genuine leads.',
    fullDesc:
      'Promote your business online effectively. We build high-converting landing pages, set up advertising funnels, and assist in growing your online presence across digital channels.',
    deliverables: [
      'High-converting landing page creation',
      'Lead generation funnel strategy',
      'Conversion tracking and analytics setup',
      'Social media integration',
      'Campaign performance review',
    ],
    deliverablesHighlights: ['High-Conversion Pages', 'Lead Funnels', 'Growth Strategy'],
    technologies: ['Analytics', 'Conversion Optimization', 'Landing Pages'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 12,
  },
  {
    id: 'srv-13',
    title: 'Branding & Creative Design',
    slug: 'branding-creative-design',
    iconName: 'Compass',
    shortDesc: 'Distinctive logos, color palettes, and visual branding assets that make your company stand out.',
    fullDesc:
      'Build a memorable brand identity that instills confidence in your clients. We design professional logos, select color schemes and typography, and provide complete digital brand guidelines.',
    deliverables: [
      'Custom vector logo design and variations',
      'Cohesive color palette and typography rules',
      'Social media branding templates',
      'Business card and letterhead layouts',
      'Digital brand guidelines package',
    ],
    deliverablesHighlights: ['Memorable Logo', 'Consistent Identity', 'Ready-to-use Assets'],
    technologies: ['Vector Design', 'Typography', 'Figma', 'Creative Direction'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 13,
  },
  {
    id: 'srv-14',
    title: 'Website Redesign',
    slug: 'website-redesign',
    iconName: 'RefreshCw',
    shortDesc: 'Upgrade outdated or slow websites into modern, fast, and high-performing digital experiences.',
    fullDesc:
      'If your current website feels outdated, slow, or fails to generate leads, we give it a complete modern transformation with updated visuals, modern mobile responsiveness, and faster load times.',
    deliverables: [
      'Complete visual and functional overhaul',
      'Mobile optimization for all modern phones',
      'Performance and speed improvement',
      'Retaining existing SEO rankings safely',
      'Modernized content and fresh calls to action',
    ],
    deliverablesHighlights: ['Modern Fresh Look', 'Faster Speed', 'Better Conversions'],
    technologies: ['Modern Web Stacks', 'Responsive Design', 'Speed Tuning'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 14,
  },
  {
    id: 'srv-15',
    title: 'Website Maintenance',
    slug: 'website-maintenance',
    iconName: 'ShieldCheck',
    shortDesc: 'Reliable ongoing updates, security monitoring, regular backups, and technical support.',
    fullDesc:
      'Keep your website running smoothly and securely without having to worry about technical issues. We handle routine software updates, security checks, data backups, and quick content changes.',
    deliverables: [
      'Regular security updates and patches',
      'Automated cloud backups',
      'Uptime monitoring and issue resolution',
      'Quick content and image updates',
      'Direct technical support channel',
    ],
    deliverablesHighlights: ['Peace of Mind', 'Automated Backups', 'Fast Technical Support'],
    technologies: ['Cloud Hosting', 'Security Audits', 'Uptime Monitoring'],
    startingPrice: 'Custom Quote',
    featured: false,
    order: 15,
  },
];

// 10 INDUSTRIES: The exact business types requested
export const INDUSTRIES: IndustryItem[] = [
  {
    id: 'ind-1',
    name: 'E-commerce',
    tagline: 'Online retail & direct-to-consumer stores',
    description: 'Fast product catalogs, seamless shopping carts, and secure payment integrations built for smooth shopping.',
    iconName: 'ShoppingBag',
    stat: 'High-Conversion Stores',
  },
  {
    id: 'ind-2',
    name: 'Healthcare',
    tagline: 'Clinics, practices & health services',
    description: 'Trustworthy medical websites, patient appointment booking, and clear healthcare service presentations.',
    iconName: 'HeartPulse',
    stat: 'Patient-First Portals',
  },
  {
    id: 'ind-3',
    name: 'Education',
    tagline: 'Schools, academies & e-learning platforms',
    description: 'Interactive course catalogs, student portals, and enrollment systems tailored for modern learners.',
    iconName: 'GraduationCap',
    stat: 'Interactive Portals',
  },
  {
    id: 'ind-4',
    name: 'Real Estate',
    tagline: 'Agencies, brokers & property developments',
    description: 'Stunning property showcases, location filters, inquiry capture forms, and virtual viewing integration.',
    iconName: 'Building2',
    stat: 'Property Showcases',
  },
  {
    id: 'ind-5',
    name: 'Restaurants',
    tagline: 'Cafes, dining & culinary businesses',
    description: 'Digital food menus, table reservation requests, location directions, and online ordering integration.',
    iconName: 'Utensils',
    stat: 'Digital Menus & Booking',
  },
  {
    id: 'ind-6',
    name: 'Fitness',
    tagline: 'Gyms, trainers & wellness studios',
    description: 'Class schedules, membership sign-ups, coach profiles, and personal training booking systems.',
    iconName: 'Dumbbell',
    stat: 'Membership Systems',
  },
  {
    id: 'ind-7',
    name: 'Professional Services',
    tagline: 'Law firms, consultants & financial advisors',
    description: 'Authoritative, polished corporate websites that establish credibility and generate high-value client inquiries.',
    iconName: 'Briefcase',
    stat: 'High-Trust Websites',
  },
  {
    id: 'ind-8',
    name: 'Technology Startups',
    tagline: 'High-growth tech companies & apps',
    description: 'Futuristic product landing pages, interactive feature demonstrations, and investor-ready digital presences.',
    iconName: 'Cpu',
    stat: 'Product Landing Pages',
  },
  {
    id: 'ind-9',
    name: 'Local Businesses',
    tagline: 'Local shops, contractors & service providers',
    description: 'Clean websites with click-to-call, WhatsApp chat, Google Maps directions, and local search visibility.',
    iconName: 'Store',
    stat: 'Local Lead Generation',
  },
  {
    id: 'ind-10',
    name: 'SaaS Companies',
    tagline: 'Software platforms & cloud applications',
    description: 'Feature-rich web applications, interactive software dashboards, and recurring subscription checkouts.',
    iconName: 'Layers',
    stat: 'Scalable Software UI',
  },
];

// 7-STEP PROCESS: The exact professional process requested
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery',
    phase: 'Consultation & Scoping',
    description:
      'We discuss your business goals, target audience, brand requirements, and project scope to create a clear project roadmap.',
    deliverables: ['Project roadmap', 'Scope of work', 'Initial visual direction'],
    duration: 'Step 1',
  },
  {
    step: '02',
    title: 'Strategy',
    phase: 'Architecture & Planning',
    description:
      'We plan the website structure, choose the optimal technology stack, define user journeys, and set up project timelines.',
    deliverables: ['Sitemap layout', 'Tech stack selection', 'Content outline'],
    duration: 'Step 2',
  },
  {
    step: '03',
    title: 'Design',
    phase: 'Visual Layouts & UX',
    description:
      'We create modern, elegant visual designs, typography pairings, color systems, and interactive previews for your review.',
    deliverables: ['Custom page layouts', 'Mobile design views', 'Interactive preview'],
    duration: 'Step 3',
  },
  {
    step: '04',
    title: 'Development',
    phase: 'Clean Engineering',
    description:
      'We write fast, secure, and clean code to build your website, web application, AI chatbot, or automation system.',
    deliverables: ['Responsive code', 'Database integration', 'Interactive features'],
    duration: 'Step 4',
  },
  {
    step: '05',
    title: 'Testing',
    phase: 'Quality Assurance',
    description:
      'We test every page across multiple devices (phones, tablets, laptops), verify form submissions, and check page loading speeds.',
    deliverables: ['Cross-device testing', 'Speed verification', 'Form & link validation'],
    duration: 'Step 5',
  },
  {
    step: '06',
    title: 'Launch',
    phase: 'Go Live & Deployment',
    description:
      'We connect your domain, configure secure SSL certificates, set up search engine indexing, and deploy your live project.',
    deliverables: ['Live domain setup', 'SSL security enabled', 'Google Search setup'],
    duration: 'Step 6',
  },
  {
    step: '07',
    title: 'Support',
    phase: 'Ongoing Care & Growth',
    description:
      'We provide continued support, guidance, and assistance so your digital product continues to run smoothly and support your growth.',
    deliverables: ['Technical guidance', 'Maintenance options', 'Future update support'],
    duration: 'Step 7',
  },
];

// TECHNOLOGIES: Clean presentation as capabilities, not certifications
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Core Technologies',
    description: 'Modern, proven tools and frameworks we use to build high-performance digital products.',
    skills: [
      { name: 'React', level: 98, tags: ['Modern UI', 'Interactive Components', 'Fast State'] },
      { name: 'Next.js', level: 96, tags: ['High Speed', 'SEO Optimization', 'Server Rendering'] },
      { name: 'TypeScript', level: 95, tags: ['Clean Code', 'Type Safety', 'Reliable Systems'] },
      { name: 'JavaScript', level: 98, tags: ['Modern ES6+', 'Dynamic Interactions', 'APIs'] },
      { name: 'Tailwind CSS', level: 99, tags: ['Modern Styling', 'Responsive Design', 'Lightweight'] },
    ],
  },
  {
    category: 'Backend & Cloud Database',
    description: 'Secure, scalable cloud databases and backend technologies.',
    skills: [
      { name: 'Node.js', level: 94, tags: ['Backend Services', 'API Integration', 'Automation'] },
      { name: 'Supabase', level: 95, tags: ['Cloud Database', 'Secure Auth', 'Realtime Sync'] },
      { name: 'PostgreSQL', level: 92, tags: ['Relational Data', 'Fast Queries', 'Data Integrity'] },
      { name: 'GitHub', level: 96, tags: ['Version Control', 'Code Safety', 'Collaboration'] },
      { name: 'Vercel', level: 97, tags: ['Fast Global Hosting', 'Continuous Deployment', 'Zero Downtime'] },
    ],
  },
  {
    category: 'Creative Tech & AI',
    description: 'Visual 3D technologies and modern AI integrations.',
    skills: [
      { name: 'Three.js', level: 92, tags: ['Interactive 3D', 'WebGL Graphics', 'Scroll Visuals'] },
      { name: 'AI APIs', level: 95, tags: ['Smart Chatbots', 'Automated Agents', 'Workflow AI'] },
      { name: 'UI/UX Systems', level: 96, tags: ['User-Centered', 'Accessible Design', 'Mobile-First'] },
      { name: 'Automation Workflows', level: 94, tags: ['Lead Routing', 'Instant Alerts', 'Data Sync'] },
    ],
  },
];

// PORTFOLIO: Clearly distinguish Real Client Project, Concept Project, Demo Project
// Categories: Websites, E-commerce, Web Apps, SaaS, AI, UI/UX, Branding
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Nova Apex Digital Experience',
    slug: 'nova-apex-digital-experience',
    client: 'Nova Web Studio Showcase',
    year: '2026',
    category: 'Websites',
    projectType: 'real',
    summary: 'A modern, high-speed agency web experience engineered with interactive 3D elements and responsive design.',
    fullDescription:
      'Nova Web Studio engineered this flagship digital experience to demonstrate modern technology capabilities: responsive layouts, clean typography, dynamic 3D visual canvas, and integrated CMS architecture.',
    challenge:
      'Creating an impressive, futuristic agency aesthetic that remains fast to load on mobile networks without overwhelming visitor devices.',
    solution:
      'Implemented clean TypeScript, Tailwind CSS, lightweight Three.js canvas rendering, and direct integration with Supabase for data management.',
    metrics: [
      { metric: '100%', label: 'Mobile Responsive' },
      { metric: 'Under 1s', label: 'Fast Page Load' },
      { metric: '15 Services', label: 'Integrated Catalog' },
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Supabase'],
    liveUrl: '#',
    featured: true,
    mainImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: '',
    order: 1,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'LuxeCart E-Commerce Platform',
    slug: 'luxecart-ecommerce-platform',
    client: 'Nova Concept Lab (Internal Design)',
    year: '2026',
    category: 'E-commerce',
    projectType: 'concept',
    summary: 'A sleek, luxury online store concept featuring frictionless product filtering and fast checkout flow.',
    fullDescription:
      'A concept project developed by Nova Web Studio exploring modern e-commerce user journeys: minimalist product cards, category filtering, instant cart updates, and mobile-first shopping navigation.',
    challenge:
      'Designing a digital storefront that maintains a luxury, uncluttered aesthetic while offering comprehensive product variations.',
    solution:
      'Crafted a clean visual layout using generous whitespace, crisp typography, and streamlined checkout UI components.',
    metrics: [
      { metric: 'Concept', label: 'Design Exploration' },
      { metric: '3-Step', label: 'Streamlined Checkout Flow' },
      { metric: 'Mobile-First', label: 'Ergonomic Cart Drawer' },
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript', 'E-commerce UI'],
    liveUrl: '#',
    featured: true,
    mainImage:
      'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 2,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'CloudMetrics SaaS Dashboard',
    slug: 'cloudmetrics-saas-dashboard',
    client: 'Nova Concept Lab (Internal Design)',
    year: '2026',
    category: 'SaaS',
    projectType: 'concept',
    summary: 'A modern multi-tenant SaaS application dashboard interface with real-time data visualizers and team settings.',
    fullDescription:
      'An internal concept prototype exploring intuitive software dashboards for modern SaaS products. Includes clear analytics cards, customizable data views, user permissions, and billing management screens.',
    challenge:
      'Making complex data and metrics feel clean, approachable, and easy to interpret at a glance.',
    solution:
      'Designed modular cards with high-contrast typography, clear status indicators, and collapsible navigation panels.',
    metrics: [
      { metric: 'Concept', label: 'SaaS UI Prototype' },
      { metric: 'Dark Mode', label: 'High-Contrast Theme' },
      { metric: 'Modular', label: 'Scalable Component System' },
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    liveUrl: '#',
    featured: true,
    mainImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 3,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'proj-4',
    title: 'OmniBot Customer Support AI Agent',
    slug: 'omnibot-customer-support-ai',
    client: 'Nova Interactive R&D (Demo Lab)',
    year: '2026',
    category: 'AI',
    projectType: 'demo',
    summary: 'A live interactive demonstration of an intelligent AI customer chatbot capable of instant Q&A and lead capture.',
    fullDescription:
      'A technical demo built by Nova Web Studio demonstrating how AI chatbots can handle 24/7 visitor questions, capture contact details, and route qualified business inquiries automatically.',
    challenge:
      'Ensuring AI responses remain accurate, concise, and helpful without confusing visitors or making hallucinations.',
    solution:
      'Built a structured prompt architecture and business-knowledge retrieval system with clean fallback to human contact.',
    metrics: [
      { metric: 'Live Demo', label: 'Interactive Prototype' },
      { metric: '24/7', label: 'Automated Response Speed' },
      { metric: 'Instant', label: 'Lead Notification Sync' },
    ],
    techStack: ['AI APIs', 'TypeScript', 'Node.js', 'React'],
    liveUrl: '#',
    featured: true,
    mainImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 4,
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'proj-5',
    title: 'Pulse Clinic Web Portal',
    slug: 'pulse-clinic-web-portal',
    client: 'Nova Concept Lab (Internal Design)',
    year: '2026',
    category: 'Web Apps',
    projectType: 'concept',
    summary: 'A streamlined healthcare clinic web application for patient appointment booking and doctor profiles.',
    fullDescription:
      'A healthcare portal concept focused on making doctor appointments easy to book online. Features specialty search, doctor schedules, service pricing, and appointment confirmation emails.',
    challenge:
      'Providing an accessible, reassuring user experience for patients of all ages on mobile phones.',
    solution:
      'Designed large accessible buttons, straightforward form steps, and clear visual confirmations for all bookings.',
    metrics: [
      { metric: 'Concept', label: 'Healthcare UI' },
      { metric: '3-Step', label: 'Simple Booking Flow' },
      { metric: 'Accessible', label: 'High Legibility Design' },
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    liveUrl: '#',
    featured: false,
    mainImage:
      'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 5,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'proj-6',
    title: 'Vanguard Visual Identity & UI System',
    slug: 'vanguard-visual-identity',
    client: 'Nova Concept Lab (Internal Design)',
    year: '2026',
    category: 'Branding',
    projectType: 'concept',
    summary: 'A cohesive modern brand identity system including logo design, color harmonies, and typography rules.',
    fullDescription:
      'An identity project showcasing Nova Web Studio’s branding methodology: crafting distinct logos, balancing contrast, choosing modern typefaces, and building adaptable digital brand guidelines.',
    challenge:
      'Creating a brand look that feels both futuristic and trustworthy for a modern technology company.',
    solution:
      'Developed geometric vector logos, an energetic cyan-and-deep-slate palette, and strict typography hierarchy.',
    metrics: [
      { metric: 'Concept', label: 'Brand & Identity' },
      { metric: 'Vector', label: 'Scalable SVG Marks' },
      { metric: 'Complete', label: 'Design System Tokens' },
    ],
    techStack: ['Vector Design', 'Figma', 'Typography Systems', 'UI Kit'],
    liveUrl: '#',
    featured: false,
    mainImage:
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 6,
    createdAt: '2026-02-25T10:00:00Z',
  },
];

// TESTIMONIALS: Strict truthfulness — no fake testimonials!
// Testimonials can be added, edited, and published directly through the Admin Dashboard.
export const INITIAL_TESTIMONIALS: Testimonial[] = [];

// FAQS: Covering all requested topics: website development, e-commerce, SaaS, AI solutions, timelines, pricing, support, SEO, getting started
export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What types of websites and digital products does Nova Web Studio build?',
    answer:
      'Nova Web Studio builds modern websites, custom web applications, e-commerce stores, SaaS platforms, AI chatbots, AI agents, and business automation systems. We handle everything from design to full-stack development and launch.',
    category: 'Website Development',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How long does it typically take to complete a website project?',
    answer:
      'A standard business website typically takes 2 to 3 weeks. More extensive web applications, custom e-commerce stores, or SaaS products usually take 4 to 8 weeks depending on complexity. We establish clear timelines during our initial consultation.',
    category: 'Project Timelines',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How do your pricing and payment structures work?',
    answer:
      'We offer transparent, project-based pricing tailored to your specific requirements. We discuss your budget upfront and provide a straightforward quote with zero hidden fees. Payments are typically split into milestones (e.g. deposit upon kickoff and completion upon launch).',
    category: 'Pricing',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Can you build custom e-commerce stores with online payments?',
    answer:
      'Yes. We build modern, secure e-commerce websites with product catalogs, shopping carts, inventory tracking, and seamless payment gateway integrations (such as Stripe, local payment processors, or bank transfers) so your customers enjoy a smooth checkout experience.',
    category: 'E-commerce',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'How can AI Chatbots and AI Agents help my business?',
    answer:
      'AI Chatbots provide 24/7 instant support for your website visitors, answering frequently asked questions and capturing lead inquiries even when you are offline. AI Agents can automate routine workflows like sending notifications, processing incoming requests, and syncing customer data.',
    category: 'AI Solutions',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Can Nova Web Studio help build a Software as a Service (SaaS) product?',
    answer:
      'Yes. We help entrepreneurs and businesses turn software ideas into functional SaaS products. We build user authentication, subscription billing, multi-tenant databases, responsive dashboards, and scalable cloud backends ready for paying users.',
    category: 'SaaS',
    order: 6,
  },
  {
    id: 'faq-7',
    question: 'Will my website be optimized for Google search (SEO)?',
    answer:
      'Yes. All websites developed by Nova Web Studio are built following modern SEO best practices: clean semantic HTML, fast loading speeds, mobile responsiveness, meta tags, and automated sitemap submission to help you rank higher on Google search results.',
    category: 'SEO',
    order: 7,
  },
  {
    id: 'faq-8',
    question: 'Do you provide ongoing support and maintenance after launch?',
    answer:
      'Yes. We offer ongoing maintenance and support to keep your website fast, updated, and secure. This includes regular software updates, automated backups, security monitoring, and quick content additions whenever needed.',
    category: 'Support',
    order: 8,
  },
  {
    id: 'faq-9',
    question: 'How do we get started with Nova Web Studio?',
    answer:
      'Getting started is simple! Click "Book a Free Consultation", send us a message through the contact form, or reach out directly on WhatsApp or phone at 03375192915. We will schedule a discussion about your project and provide a clear plan.',
    category: 'Getting Started',
    order: 9,
  },
];
