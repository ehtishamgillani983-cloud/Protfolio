import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  FolderGit2,
  Layers,
  Inbox,
  HelpCircle,
  Settings,
  Search,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  Download,
  ExternalLink,
  Eye,
  Database,
  Globe,
  AlertCircle,
  Copy,
  LogOut,
  Key,
  Upload,
  RefreshCw,
  CheckCircle2,
  Server,
  ShieldCheck,
  Image as ImageIcon,
  Film,
  Link2,
  Phone,
  MessageCircle,
  Mail,
  Palette,
  FileText,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  Project,
  Service,
  Testimonial,
  FAQ,
  ContactLead,
  SiteSettings,
  SocialLink,
  ProjectType,
  MediaAsset,
} from '../../types';
import {
  getProjects,
  saveProject,
  deleteProject,
  getServices,
  saveService,
  deleteService,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getFAQs,
  saveFAQ,
  deleteFAQ,
  getContactLeads,
  updateLeadStatus,
  deleteLead,
  getSiteSettings,
  updateSiteSettings,
  getBackendStatus,
  verifyAdminPassword,
  resetAdminPasswordToDefault,
  changeAdminPassword,
  getSupabaseSession,
  onSupabaseAuthStateChange,
  signUpWithSupabase,
  checkSupabaseHealth,
  seedAllDataToSupabase,
  deleteMediaAsset,
  signInWithSupabase,
  signOutSupabase,
  getSupabaseUser,
  DEFAULT_SUPABASE_URL,
  SUPABASE_PROJECT_REF,
  supabase,
} from '../../lib/supabase';
import { MediaUploadField } from './MediaUploadField';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

type TabType =
  | 'overview'
  | 'branding'
  | 'leads'
  | 'content'
  | 'services'
  | 'projects'
  | 'media'
  | 'seo'
  | 'contact_info'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nova_admin_logged_in') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginMode, setLoginMode] = useState<'master' | 'supabase'>('master');
  const [supabaseEmail, setSupabaseEmail] = useState('');
  const [supabasePassword, setSupabasePassword] = useState('');
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Loaded database state
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Diagnostics & sync state
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Leads filter & search
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [leadPendingDeleteId, setLeadPendingDeleteId] = useState<string | null>(null);

  // Project edit/add modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Service edit/add modal state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const backendStatus = getBackendStatus();

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [p, s, l, t, f, st] = await Promise.all([
        getProjects(),
        getServices(),
        getContactLeads(),
        getTestimonials(),
        getFAQs(),
        getSiteSettings(),
      ]);
      setProjects(p);
      setServices(s);
      setLeads(l);
      setTestimonials(t);
      setFaqs(f);
      setSettings(st);
    } catch (err) {
      console.warn('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    getSupabaseUser().then((u) => {
      if (u?.email) setActiveUserEmail(u.email);
    });
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllData();
      runHealthCheck();
    }
  }, [isOpen, isAuthenticated]);

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await checkSupabaseHealth();
      setHealthStatus(res);
    } catch (e: any) {
      setHealthStatus({
        connected: false,
        hasTables: false,
        message: e?.message || 'Health check failed',
        tableDetails: {},
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSeedingData(true);
    try {
      const res = await seedAllDataToSupabase();
      if (res.success) {
        showToast(
          `Successfully seeded Supabase: ${res.counts.projects} projects, ${res.counts.services} services!`
        );
        await loadAllData();
        onDataUpdated();
        await runHealthCheck();
      } else {
        showToast(`Sync notice: ${res.error}`);
      }
    } catch (err: any) {
      showToast(`Sync failed: ${err?.message || 'Error syncing data'}`);
    } finally {
      setIsSeedingData(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginMode === 'supabase') {
      try {
        const res = await signInWithSupabase(supabaseEmail, supabasePassword);
        if (res.error) {
          setLoginError(`Supabase Auth error: ${res.error.message}`);
          return;
        }
        setIsAuthenticated(true);
        sessionStorage.setItem('nova_admin_logged_in', 'true');
        setActiveUserEmail(supabaseEmail);
        setSupabasePassword('');
        loadAllData();
        runHealthCheck();
      } catch (err: any) {
        setLoginError(`Login failed: ${err?.message || 'Check network'}`);
      }
      return;
    }

    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nova_admin_logged_in', 'true');
      setPasswordInput('');
      loadAllData();
      runHealthCheck();
    } else {
      setLoginError('Invalid password. Default is: admin123');
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nova_admin_logged_in');
    setActiveUserEmail(null);
    await signOutSupabase();
  };

  // Password update
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setPasswordStatusMsg(null);

    if (!newPassword || newPassword.length < 8) {
      setPasswordStatusMsg({
        text: 'Password must be at least 8 characters long.',
        isError: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatusMsg({
        text: 'Passwords do not match. Please verify and try again.',
        isError: true,
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      if (supabase) {
        try {
          await supabase.auth.updateUser({ password: newPassword });
        } catch {
          // ignore if unauthenticated in supabase auth session
        }
      }
      changeAdminPassword(newPassword);
      setPasswordStatusMsg({
        text: 'Admin password successfully updated!',
        isError: false,
      });
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully.');
    } catch (err: any) {
      setPasswordStatusMsg({
        text: err?.message || 'Error updating password.',
        isError: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Save Settings helper
  const handleSaveSettings = async (updated: SiteSettings) => {
    setSettings(updated);
    await updateSiteSettings(updated);
    onDataUpdated();
    showToast('Settings saved and live website updated successfully!');
  };

  // Leads actions
  const handleUpdateLeadStatus = async (id: string, status: ContactLead['status']) => {
    await updateLeadStatus(id, status);
    setLeads(await getContactLeads());
    showToast('Lead status updated.');
  };

  const handleDeleteLead = async (id: string) => {
    setLeadPendingDeleteId(null);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await deleteLead(id);
    showToast('Lead inquiry removed.');
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }
    const headers = [
      'ID',
      'Name',
      'Email',
      'Company',
      'Phone',
      'Services',
      'Budget',
      'Status',
      'Date',
      'Message',
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.servicesRequested || []).join(', ')}"`,
      `"${l.budget}"`,
      l.status,
      l.createdAt,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `nova_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Projects actions
  const handleSaveProject = async (p: Project) => {
    await saveProject(p);
    setProjects(await getProjects());
    setEditingProject(null);
    setIsAddingProject(false);
    onDataUpdated();
    showToast(`Project "${p.title}" saved.`);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    await deleteProject(id);
    setProjects(await getProjects());
    onDataUpdated();
    showToast('Project deleted.');
  };

  // Services actions
  const handleSaveService = async (s: Service) => {
    await saveService(s);
    setServices(await getServices());
    setEditingService(null);
    setIsAddingService(false);
    onDataUpdated();
    showToast(`Service "${s.title}" saved.`);
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    await deleteService(id);
    setServices(await getServices());
    onDataUpdated();
    showToast('Service deleted.');
  };

  const createEmptyProject = (): Project => ({
    id: 'proj-' + Date.now(),
    title: '',
    slug: '',
    client: '',
    year: new Date().getFullYear().toString(),
    category: 'Websites',
    projectType: 'real',
    summary: '',
    fullDescription: '',
    challenge: '',
    solution: '',
    metrics: [],
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    featured: true,
    mainImage: '/assets/nova-logo.webp',
    galleryImages: [],
    order: (projects.length || 0) + 1,
    createdAt: new Date().toISOString(),
  });

  const createEmptyService = (): Service => ({
    id: 'srv-' + Date.now(),
    title: '',
    slug: '',
    iconName: 'Layout',
    shortDesc: '',
    fullDesc: '',
    deliverables: ['Custom design', 'Responsive coding', 'Speed optimization'],
    technologies: ['React', 'Next.js'],
    startingPrice: 'Custom Quote',
    featured: true,
    order: (services.length || 0) + 1,
  });

  if (!isOpen) return null;

  // ----------------------------------------------------
  // LOGIN SCREEN (Clean, White, Light Interface)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Admin Dashboard Login
            </h2>
            <p className="text-xs text-slate-500">
              Nova Web Studio Management & Content Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Admin Security Password:
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (default: admin123)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">
                Default Password: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-blue-700 font-mono font-bold">admin123</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('admin123');
                  resetAdminPasswordToDefault();
                  setLoginError('');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2"
              >
                Use default password
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  resetAdminPasswordToDefault();
                  setPasswordInput('admin123');
                  setLoginError('');
                  alert('Password has been reset to default: admin123');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset password to default
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 font-medium"
              >
                Cancel & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN DASHBOARD (Clean, White, Light Interface)
  // ----------------------------------------------------
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(leadSearchQuery.toLowerCase()));
    const matchesStatus =
      leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'branding', label: 'Branding & Logo', icon: Palette, badge: 'New' },
    { id: 'leads', label: 'Leads & Submissions', icon: Inbox, count: leads.length },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'services', label: 'Services', icon: Layers, count: services.length },
    { id: 'projects', label: 'Projects & Portfolio', icon: FolderGit2, count: projects.length },
    { id: 'media', label: 'Images & Video', icon: Film },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'contact_info', label: 'Contact Details', icon: Phone },
    { id: 'settings', label: 'General Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-7xl h-[94vh] bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-800">
        {/* Top Header Bar (Clean White) */}
        <header className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={settings?.customLogoUrl || '/assets/nova-logo.webp'}
              alt="Nova Studio"
              className="w-9 h-9 rounded-full border border-slate-200 object-contain shadow-xs bg-slate-50"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  Nova Web Studio Admin
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud Active</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Connected to Supabase ({SUPABASE_PROJECT_REF})
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className="bg-blue-600 text-white text-xs px-6 py-2.5 flex items-center justify-between animate-in slide-in-from-top duration-150 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-3.5 h-3.5 text-white/80 hover:text-white" />
            </button>
          </div>
        )}

        {/* Dashboard Body (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar (Clean White) */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2 pb-1">
                Navigation
              </span>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === 'number' && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isActive
                            ? 'bg-blue-200/60 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Storage System Status in Sidebar footer */}
            <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Storage Bucket</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                portfolio-assets bucket connected for high-speed images and video CDN.
              </p>
            </div>
          </aside>

          {/* Main Content Area (Clean White / Light Slate) */}
          <main className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* ==================================================== */}
              {/* TAB 1: OVERVIEW */}
              {/* ==================================================== */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Welcome to Nova Web Studio Admin
                    </h2>
                    <p className="text-sm text-slate-500">
                      Manage your agency branding, incoming client inquiries, services, and website media.
                    </p>
                  </div>

                  {/* 4 Overview Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-xs font-semibold text-slate-500 block">Total Inquiries</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{leads.length}</span>
                        <Inbox className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {leads.filter((l) => l.status === 'new').length} new unread leads
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-xs font-semibold text-slate-500 block">Active Services</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{services.length}</span>
                        <Layers className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-slate-400">Available to clients</span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-xs font-semibold text-slate-500 block">Portfolio Projects</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900">{projects.length}</span>
                        <FolderGit2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-slate-400">Published case studies</span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <span className="text-xs font-semibold text-slate-500 block">Supabase Storage</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-emerald-700">Online</span>
                        <Database className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-[11px] text-slate-500">Bucket: portfolio-assets</span>
                    </div>
                  </div>

                  {/* Quick Shortcut Buttons */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Quick Management Shortcuts
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setActiveTab('branding')}
                        className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-700 text-sm mb-1">
                          <Palette className="w-4 h-4 text-blue-600" />
                          <span>Branding & Logo</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Upload new logo, favicon, or update brand monogram.
                        </p>
                      </button>

                      <button
                        onClick={() => setActiveTab('leads')}
                        className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-700 text-sm mb-1">
                          <Inbox className="w-4 h-4 text-blue-600" />
                          <span>Review Inquiries</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          View contact form submissions and client leads.
                        </p>
                      </button>

                      <button
                        onClick={() => setActiveTab('media')}
                        className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-700 text-sm mb-1">
                          <Film className="w-4 h-4 text-blue-600" />
                          <span>Hero Video & Images</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Directly upload hero video or manage image library.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Recent Leads Preview */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Recent Submissions (Last 5)
                      </h3>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View All Leads →
                      </button>
                    </div>

                    {leads.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        No contact submissions recorded yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {leads.slice(0, 5).map((l) => (
                          <div key={l.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {l.name} {l.company ? `(${l.company})` : ''}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                {l.email} • {l.phone || 'No phone'} • Budget: {l.budget}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                l.status === 'new'
                                  ? 'bg-blue-100 text-blue-800'
                                  : l.status === 'contacted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {l.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 2: BRANDING & LOGO MANAGER (User Requested #1) */}
              {/* ==================================================== */}
              {activeTab === 'branding' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Branding & Logo Manager
                    </h2>
                    <p className="text-sm text-slate-500">
                      Upload or replace the website logo, favicon, and brand monogram directly from your computer.
                    </p>
                  </div>

                  {/* Live Website Brand Preview Simulator */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Website Header Preview
                    </h3>
                    <p className="text-xs text-slate-500">
                      This shows how your logo appears in the dark navigation header on the live website:
                    </p>

                    <div className="p-4 bg-[#05070c] rounded-2xl border border-white/10 flex items-center justify-between max-w-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={settings.customLogoUrl || '/assets/nova-logo.webp'}
                          alt={settings.studioName}
                          className="w-10 h-10 rounded-full object-contain border border-white/20 bg-black/40"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-display text-base font-extrabold tracking-wider text-white leading-none">
                            {settings.customLogoText || 'NOVA'}{' '}
                            <span className="text-cyan-400 font-light">STUDIO</span>
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                            Digital Technology
                          </span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white">
                        WhatsApp Active
                      </span>
                    </div>
                  </div>

                  {/* Main Logo Upload Field */}
                  <MediaUploadField
                    label="Main Website Logo"
                    description="Upload your primary website logo. Supports PNG, JPG, SVG, and WebP formats."
                    currentValue={settings.customLogoUrl}
                    onChange={(newUrl) => {
                      setSettings({ ...settings, customLogoUrl: newUrl });
                    }}
                    folder="branding"
                    recommendation="Recommended: Transparent PNG or crisp vector SVG (at least 200x200px)."
                  />

                  {/* Favicon Upload Field */}
                  <MediaUploadField
                    label="Website Favicon (Browser Tab Icon)"
                    description="The small icon that appears in the user's browser tab."
                    currentValue={settings.faviconUrl || settings.customLogoUrl}
                    onChange={(newUrl) => {
                      setSettings({ ...settings, faviconUrl: newUrl });
                    }}
                    folder="branding"
                    recommendation="Recommended: 32x32px or 64x64px square PNG, ICO, or SVG."
                  />

                  {/* Brand Monogram & Studio Name Form */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Brand Text Settings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Logo Monogram Text:
                        </label>
                        <input
                          type="text"
                          value={settings.customLogoText || ''}
                          onChange={(e) =>
                            setSettings({ ...settings, customLogoText: e.target.value })
                          }
                          placeholder="e.g. NOVA"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Full Studio Name:
                        </label>
                        <input
                          type="text"
                          value={settings.studioName}
                          onChange={(e) =>
                            setSettings({ ...settings, studioName: e.target.value })
                          }
                          placeholder="Nova Web Studio"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings(settings)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Branding Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 3: LEADS & INQUIRIES */}
              {/* ==================================================== */}
              {activeTab === 'leads' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-900">
                        Client Leads & Inquiries
                      </h2>
                      <p className="text-sm text-slate-500">
                        {leads.length} total contact form submissions stored securely in Supabase.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportLeadsToCSV}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                        placeholder="Search leads by name, email, company..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={leadStatusFilter}
                        onChange={(e) => setLeadStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="all">All Inquiries</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_discussion">In Discussion</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Leads Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {filteredLeads.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-semibold">No inquiries found</p>
                        <p className="text-xs">Adjust your search filter or wait for new leads.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3">Client</th>
                              <th className="px-4 py-3">Contact</th>
                              <th className="px-4 py-3">Service & Budget</th>
                              <th className="px-4 py-3">Message</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredLeads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3">
                                  <span className="font-bold text-slate-900 block">{lead.name}</span>
                                  {lead.company && (
                                    <span className="text-[11px] text-slate-500">{lead.company}</span>
                                  )}
                                  <span className="text-[10px] text-slate-400 block">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <a
                                    href={`mailto:${lead.email}`}
                                    className="text-blue-600 hover:underline block truncate max-w-[160px]"
                                  >
                                    {lead.email}
                                  </a>
                                  {lead.phone ? (
                                    <a
                                      href={`tel:${lead.phone}`}
                                      className="text-slate-600 hover:underline block"
                                    >
                                      {lead.phone}
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">No phone</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-medium text-slate-800 block">
                                    {(lead.servicesRequested || []).join(', ') || 'General Inquiry'}
                                  </span>
                                  <span className="text-slate-500 font-mono text-[11px]">
                                    {lead.budget}
                                  </span>
                                </td>
                                <td className="px-4 py-3 max-w-xs">
                                  <p
                                    className="text-slate-600 line-clamp-2"
                                    title={lead.message}
                                  >
                                    {lead.message}
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={lead.status}
                                    onChange={(e) =>
                                      handleUpdateLeadStatus(
                                        lead.id,
                                        e.target.value as ContactLead['status']
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none border ${
                                      lead.status === 'new'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : lead.status === 'contacted'
                                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                                        : lead.status === 'in_discussion'
                                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    }`}
                                  >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="in_discussion">In Discussion</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Delete lead inquiry"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 4: WEBSITE CONTENT & PAGES */}
              {/* ==================================================== */}
              {activeTab === 'content' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Website Content & Copy
                    </h2>
                    <p className="text-sm text-slate-500">
                      Manage hero headlines, agency vision statement, and leadership details.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Hero & Tagline Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Agency Tagline:
                        </label>
                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(e) =>
                            setSettings({ ...settings, tagline: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Project Availability Badge:
                        </label>
                        <input
                          type="text"
                          value={settings.projectAvailability}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              projectAvailability: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Founder Leadership Section */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Founder Profile & Leadership
                    </h3>

                    {/* Founder Avatar Direct Upload */}
                    <MediaUploadField
                      label="Founder Photo / Avatar"
                      description="Upload Syed Ehtisham Gillani's leadership portrait."
                      currentValue={settings.founderAvatar}
                      onChange={(newUrl) => {
                        setSettings({ ...settings, founderAvatar: newUrl });
                      }}
                      folder="founder"
                      recommendation="Clean square portrait photo (at least 400x400px)."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Founder Name:
                        </label>
                        <input
                          type="text"
                          value={settings.founderName}
                          onChange={(e) =>
                            setSettings({ ...settings, founderName: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Founder Title:
                        </label>
                        <input
                          type="text"
                          value={settings.founderTitle}
                          onChange={(e) =>
                            setSettings({ ...settings, founderTitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Founder Bio & Mission:
                      </label>
                      <textarea
                        rows={4}
                        value={settings.founderBio}
                        onChange={(e) =>
                          setSettings({ ...settings, founderBio: e.target.value })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings(settings)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Content Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 5: SERVICES */}
              {/* ==================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-900">
                        Digital Services
                      </h2>
                      <p className="text-sm text-slate-500">
                        Configure the {services.length} agency offerings displayed on the website.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingService(createEmptyService());
                        setIsAddingService(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">{srv.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                              {srv.slug}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{srv.shortDesc}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {srv.deliverables.slice(0, 3).map((d, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">
                            {srv.startingPrice || 'Custom Quote'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingService(srv);
                                setIsAddingService(false);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-medium flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Service Edit / Add Modal */}
                  {editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-base">
                            {isAddingService ? 'Add Service' : 'Edit Service'}
                          </h3>
                          <button
                            onClick={() => setEditingService(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Service Title:
                            </label>
                            <input
                              type="text"
                              value={editingService.title}
                              onChange={(e) =>
                                setEditingService({ ...editingService, title: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Slug Identifier:
                            </label>
                            <input
                              type="text"
                              value={editingService.slug}
                              onChange={(e) =>
                                setEditingService({ ...editingService, slug: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Short Description:
                            </label>
                            <textarea
                              rows={2}
                              value={editingService.shortDesc}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  shortDesc: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Full Description:
                            </label>
                            <textarea
                              rows={3}
                              value={editingService.fullDesc}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  fullDesc: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Deliverables (one per line):
                            </label>
                            <textarea
                              rows={3}
                              value={(editingService.deliverables || []).join('\n')}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  deliverables: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          <button
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveService(editingService)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            Save Service
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 6: PROJECTS & PORTFOLIO */}
              {/* ==================================================== */}
              {activeTab === 'projects' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-900">
                        Projects & Case Studies
                      </h2>
                      <p className="text-sm text-slate-500">
                        {projects.length} portfolio items configured.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProject(createEmptyProject());
                        setIsAddingProject(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                          <img
                            src={proj.mainImage || '/assets/nova-logo.webp'}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                            }}
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs">
                            {proj.category}
                          </span>
                        </div>

                        <div className="p-4 space-y-2 flex-1">
                          <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{proj.summary}</p>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            Client: {proj.client} ({proj.year})
                          </span>
                        </div>

                        <div className="p-4 pt-0 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsAddingProject(false);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Project</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Project Edit / Add Modal with Direct Image Upload */}
                  {editingProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-base">
                            {isAddingProject ? 'Add Project' : 'Edit Project'}
                          </h3>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4 text-xs">
                          {/* Direct Main Image Upload */}
                          <MediaUploadField
                            label="Project Featured Image"
                            description="Upload screenshot or high-resolution visual for this project."
                            currentValue={editingProject.mainImage}
                            onChange={(newUrl) => {
                              setEditingProject({ ...editingProject, mainImage: newUrl });
                            }}
                            folder="projects"
                            recommendation="16:9 landscape aspect ratio (e.g. 1280x720px)."
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="font-semibold text-slate-700 block mb-1">
                                Project Title:
                              </label>
                              <input
                                type="text"
                                value={editingProject.title}
                                onChange={(e) =>
                                  setEditingProject({
                                    ...editingProject,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                              />
                            </div>

                            <div>
                              <label className="font-semibold text-slate-700 block mb-1">
                                Client Name:
                              </label>
                              <input
                                type="text"
                                value={editingProject.client}
                                onChange={(e) =>
                                  setEditingProject({
                                    ...editingProject,
                                    client: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Short Summary:
                            </label>
                            <textarea
                              rows={2}
                              value={editingProject.summary}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  summary: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                              Live Project URL:
                            </label>
                            <input
                              type="text"
                              value={editingProject.liveUrl}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  liveUrl: e.target.value,
                                })
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveProject(editingProject)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            Save Project
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 7: IMAGES & BACKGROUND VIDEO (User Requested #2) */}
              {/* ==================================================== */}
              {activeTab === 'media' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Images & Background Video
                    </h2>
                    <p className="text-sm text-slate-500">
                      Upload hero background video and manage assets stored in Supabase Storage.
                    </p>
                  </div>

                  {/* Hero Background Video Direct Upload */}
                  <div className="space-y-4">
                    <MediaUploadField
                      label="Hero Background Video"
                      description="Directly upload an MP4 or WebM video file for the website hero background."
                      currentValue={settings.heroVideoUrl || '/assets/hero-bg.mp4'}
                      onChange={(newUrl) => {
                        setSettings({ ...settings, heroVideoUrl: newUrl });
                      }}
                      mediaType="video"
                      folder="hero"
                      maxSizeMB={50}
                      recommendation="Under 25MB recommended for high-speed streaming without buffering."
                    />

                    {/* Video Settings Controls */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <h3 className="text-sm font-bold text-slate-900">
                        Hero Video Playback Behavior
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Background Display Mode:
                          </label>
                          <select
                            value={settings.heroBackgroundMode}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                heroBackgroundMode: e.target.value as any,
                              })
                            }
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            <option value="cinematic-video">Cinematic Video (Fastest & Cleanest)</option>
                            <option value="hybrid">Hybrid (Cinematic Video + 3D Kinetic Canvas)</option>
                            <option value="3d-canvas">Pure 3D Kinetic Canvas (No Video)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Ambient Playback Speed ({settings.heroVideoPlaybackRate || 0.5}x):
                          </label>
                          <input
                            type="range"
                            min="0.2"
                            max="1.5"
                            step="0.1"
                            value={settings.heroVideoPlaybackRate || 0.5}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                heroVideoPlaybackRate: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-blue-600 mt-2"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="scrubToggle"
                          checked={settings.heroVideoScrubEnabled}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              heroVideoScrubEnabled: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <label htmlFor="scrubToggle" className="text-xs font-medium text-slate-700">
                          Enable smooth scroll-scrubbing (interactively responds to mouse wheel and page scrolling)
                        </label>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleSaveSettings(settings)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Video Settings</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* General Media Library / Asset Upload */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Cloud Media Library
                    </h3>
                    <p className="text-xs text-slate-500">
                      Assets stored in Supabase Storage. You can upload any image or asset here to get a permanent CDN URL.
                    </p>

                    <MediaUploadField
                      label="Upload New Media Asset"
                      description="Upload any asset to Supabase cloud storage."
                      onChange={(url) => {
                        showToast('Asset uploaded to cloud gallery!');
                        loadAllData();
                      }}
                      folder="general"
                    />

                    {/* Gallery Items */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                      {(settings.mediaGallery || []).map((asset) => (
                        <div
                          key={asset.id}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 relative group"
                        >
                          <div className="h-24 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center">
                            {asset.type === 'video' ? (
                              <video src={asset.url} muted className="w-full h-full object-cover" />
                            ) : (
                              <img
                                src={asset.url}
                                alt={asset.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                                }}
                              />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 block truncate" title={asset.name}>
                            {asset.name}
                          </span>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{asset.category}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(asset.url);
                                showToast('Copied URL to clipboard!');
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Copy URL
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 8: SEO SETTINGS */}
              {/* ==================================================== */}
              {activeTab === 'seo' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      SEO & Search Engine Settings
                    </h2>
                    <p className="text-sm text-slate-500">
                      Search engine metadata, social share cards (OpenGraph), and Google Search Console tags.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    {/* Google Search Console Status Card */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          Google Search Console Verification Verified
                        </span>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Verification tag is permanently embedded in index.html: <br />
                          <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">
                            aFZqSEC6WuxbVdViBnlvzkpJB1e-IICW1bUdsyNUR8s
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Page Meta Title:
                        </label>
                        <input
                          type="text"
                          value={settings.seo.metaTitle}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seo: { ...settings.seo, metaTitle: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Meta Description:
                        </label>
                        <textarea
                          rows={3}
                          value={settings.seo.metaDescription}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seo: { ...settings.seo, metaDescription: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Canonical URL:
                        </label>
                        <input
                          type="text"
                          value={settings.seo.canonicalUrl}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seo: { ...settings.seo, canonicalUrl: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                        />
                      </div>

                      <MediaUploadField
                        label="Social Share Banner (Open Graph Image)"
                        description="Displayed when someone shares your website link on WhatsApp, LinkedIn, or Twitter."
                        currentValue={settings.seo.ogImage}
                        onChange={(newUrl) => {
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, ogImage: newUrl },
                          });
                        }}
                        folder="seo"
                        recommendation="1200x630px landscape image."
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings(settings)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save SEO Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 9: BUSINESS CONTACT INFORMATION */}
              {/* ==================================================== */}
              {activeTab === 'contact_info' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      Business Contact Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      WhatsApp, Phone, Email, and physical business location settings.
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    {/* Primary WhatsApp Card */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                        <span className="text-sm font-bold text-emerald-900">
                          Primary Contact Channel: WhatsApp
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        WhatsApp is highlighted prominently across the hero, header, and contact form for instant client inquiries.
                      </p>
                      <div>
                        <label className="text-xs font-bold text-emerald-900 block mb-1">
                          WhatsApp Number:
                        </label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) =>
                            setSettings({ ...settings, whatsappNumber: e.target.value })
                          }
                          placeholder="03375192915"
                          className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-mono font-semibold text-emerald-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Direct Phone Number (Call):
                        </label>
                        <input
                          type="text"
                          value={settings.contactPhone}
                          onChange={(e) =>
                            setSettings({ ...settings, contactPhone: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Contact Email Address:
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) =>
                            setSettings({ ...settings, contactEmail: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700 block mb-1">
                          Business Address / Operating Region:
                        </label>
                        <input
                          type="text"
                          value={settings.address || ''}
                          onChange={(e) =>
                            setSettings({ ...settings, address: e.target.value })
                          }
                          placeholder="Pakistan & Global Remote Operations"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings(settings)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Contact Information</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 10: GENERAL SETTINGS & SECURITY */}
              {/* ==================================================== */}
              {activeTab === 'settings' && settings && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900">
                      General Settings & Security
                    </h2>
                    <p className="text-sm text-slate-500">
                      Change admin password, test database connection, and sync default data.
                    </p>
                  </div>

                  {/* Password Change Form */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span>Change Admin Password</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Password must be at least 8 characters long.
                    </p>

                    <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          New Password:
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Confirm New Password:
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Retype password"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>

                      {passwordStatusMsg && (
                        <div
                          className={`p-3 rounded-xl flex items-center gap-2 ${
                            passwordStatusMsg.isError
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{passwordStatusMsg.text}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
                      >
                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* Supabase Diagnostics & Health */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-600" />
                      <span>Supabase Cloud Diagnostics</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">Supabase Project URL:</span>
                        <span className="text-slate-500 font-mono text-[11px] block truncate">
                          {DEFAULT_SUPABASE_URL}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">Storage Bucket Status:</span>
                        <span className="text-emerald-700 font-semibold block">
                          portfolio-assets (Active & Public)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={runHealthCheck}
                        disabled={isCheckingHealth}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                        <span>Run Supabase Health Check</span>
                      </button>

                      <button
                        onClick={handleSyncToSupabase}
                        disabled={isSeedingData}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl flex items-center gap-2"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{isSeedingData ? 'Syncing...' : 'Sync All Default Data to Supabase'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
