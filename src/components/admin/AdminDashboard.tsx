import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  FolderGit2,
  Layers,
  Inbox,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  Share2,
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
  changeAdminPassword,
  checkSupabaseHealth,
  seedAllDataToSupabase,
  setCustomSupabaseAnonKey,
  uploadMediaToSupabase,
  deleteMediaAsset,
  signInWithSupabase,
  signOutSupabase,
  getSupabaseUser,
  DEFAULT_SUPABASE_URL,
  SUPABASE_PROJECT_REF,
  supabase,
  updateSupabaseAdminPassword,
} from '../../lib/supabase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

type TabType =
  | 'overview'
  | 'projects'
  | 'services'
  | 'leads'
  | 'testimonials'
  | 'faqs'
  | 'media'
  | 'settings'
  | 'seo'
  | 'security';

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

  // Health and Sync states
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [customAnonKeyInput, setCustomAnonKeyInput] = useState('');
  const [schemaCopied, setSchemaCopied] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Modals & form state inside admin
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);

  // Media gallery filter state
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Leads CRM delete confirmation state
  const [leadPendingDeleteId, setLeadPendingDeleteId] = useState<string | null>(null);

  const createEmptyService = (): Service => ({
    id: 'srv-' + Date.now(),
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    deliverables: ['Custom High-Impact Architecture', 'Full Responsive Experience'],
    deliverablesHighlights: ['Scalable Architecture', 'SEO Ready'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    startingPrice: '$2,500',
    turnaround: '2-3 Weeks',
    iconName: 'Globe',
    featured: true,
    order: (services.length || 0) + 1,
  });

  const createEmptyTestimonial = (): Testimonial => ({
    id: 'test-' + Date.now(),
    clientName: '',
    clientCompany: '',
    clientRole: 'CEO & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    quote: '',
    rating: 5,
    projectTitle: 'Custom Digital Platform',
    projectDelivered: 'Custom Digital Platform',
    verified: true,
  });

  const createEmptyFAQ = (): FAQ => ({
    id: 'faq-' + Date.now(),
    question: '',
    answer: '',
    category: 'General',
    order: (faqs.length || 0) + 1,
  });

  // Security password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Toast / alert banner
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const backendStatus = getBackendStatus();

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

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await checkSupabaseHealth();
      setHealthStatus(res);
    } catch (e: any) {
      setHealthStatus({
        connected: false,
        hasTables: false,
        message: e?.message || 'Check failed',
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
          `Successfully seeded Supabase: ${res.counts.projects} projects, ${res.counts.services} services, ${res.counts.testimonials} testimonials, ${res.counts.faqs} FAQs!`
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

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllData();
      runHealthCheck();
    }
  }, [isOpen, isAuthenticated]);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Login handler supporting Master Key and Supabase Auth
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
      setLoginError('Invalid security credential. Default is: admin123');
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nova_admin_logged_in');
    setActiveUserEmail(null);
    await signOutSupabase();
  };

  // Password change state & handler with Supabase Auth updateUser
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const calculatePasswordStrength = (pwd: string): { label: string; color: string; score: number } => {
    if (!pwd) return { label: 'None', color: 'text-slate-500', score: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: 'Weak', color: 'text-rose-400', score: 1 };
    if (score <= 3) return { label: 'Moderate', color: 'text-amber-400', score: 2 };
    return { label: 'Strong', color: 'text-emerald-400', score: 3 };
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setPasswordStatusMsg(null);

    // Minimum 8 characters validation
    if (!newPassword || newPassword.length < 8) {
      setPasswordStatusMsg({
        text: 'Password must be at least 8 characters long.',
        isError: true,
      });
      return;
    }

    // Password mismatch validation
    if (newPassword !== confirmPassword) {
      setPasswordStatusMsg({
        text: 'Passwords do not match. Please verify and try again.',
        isError: true,
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      let supabaseMessage = '';
      let isError = false;

      // Update password via Supabase Auth
      if (supabase) {
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) {
            // Check if user needs an active session or if Supabase returns specific policy message
            supabaseMessage = error.message;
            isError = true;
          } else {
            supabaseMessage = 'Password successfully updated in Supabase Auth!';
          }
        } catch (sbErr: any) {
          supabaseMessage = sbErr?.message || 'Supabase Auth updateUser call failed';
          isError = true;
        }
      }

      // Also safely update local admin key
      changeAdminPassword(newPassword);

      if (isError && supabaseMessage) {
        setPasswordStatusMsg({
          text: `Supabase Auth Notice: ${supabaseMessage}`,
          isError: true,
        });
      } else {
        setPasswordStatusMsg({
          text: supabaseMessage || 'Admin password successfully updated (minimum 8 characters)!',
          isError: false,
        });
        setNewPassword('');
        setConfirmPassword('');
        showToast('Admin password updated successfully.');
      }
    } catch (err: any) {
      setPasswordStatusMsg({
        text: err?.message || 'An error occurred while updating the password.',
        isError: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Project save
  const handleSaveProject = async (p: Project) => {
    await saveProject(p);
    const updated = await getProjects();
    setProjects(updated);
    setEditingProject(null);
    setIsAddingProject(false);
    onDataUpdated();
    showToast(`Project "${p.title}" saved.`);
  };

  const safeConfirm = (message: string): boolean => {
    try {
      return window.confirm(message);
    } catch {
      return true;
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!safeConfirm('Are you sure you want to delete this project?')) return;
    await deleteProject(id);
    const updated = await getProjects();
    setProjects(updated);
    onDataUpdated();
    showToast('Project deleted.');
  };

  // Service save
  const handleSaveService = async (s: Service) => {
    await saveService(s);
    const updated = await getServices();
    setServices(updated);
    setEditingService(null);
    setIsAddingService(false);
    onDataUpdated();
    showToast(`Service "${s.title}" saved.`);
  };

  const handleDeleteService = async (id: string) => {
    if (!safeConfirm('Are you sure you want to delete this service?')) return;
    await deleteService(id);
    const updated = await getServices();
    setServices(updated);
    onDataUpdated();
    showToast('Service deleted.');
  };

  // Testimonial save
  const handleSaveTestimonial = async (t: Testimonial) => {
    await saveTestimonial(t);
    const updated = await getTestimonials();
    setTestimonials(updated);
    setEditingTestimonial(null);
    setIsAddingTestimonial(false);
    onDataUpdated();
    showToast('Testimonial saved.');
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!safeConfirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    setTestimonials(await getTestimonials());
    onDataUpdated();
    showToast('Testimonial deleted.');
  };

  // FAQ save
  const handleSaveFAQ = async (f: FAQ) => {
    await saveFAQ(f);
    setFaqs(await getFAQs());
    setEditingFAQ(null);
    setIsAddingFAQ(false);
    onDataUpdated();
    showToast('FAQ saved.');
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!safeConfirm('Delete this FAQ?')) return;
    await deleteFAQ(id);
    setFaqs(await getFAQs());
    onDataUpdated();
    showToast('FAQ deleted.');
  };

  // Lead status update
  const handleLeadStatusChange = async (id: string, status: ContactLead['status']) => {
    await updateLeadStatus(id, status);
    setLeads(await getContactLeads());
    showToast('Lead status updated.');
  };

  const handleDeleteLead = async (id: string) => {
    setLeadPendingDeleteId(null);
    // Instant optimistic removal from list
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead inquiry removed.');
    try {
      await deleteLead(id);
      const updated = await getContactLeads();
      setLeads(updated);
    } catch (err) {
      console.warn('Error deleting lead:', err);
      showToast('Notice: updated lead list.');
      setLeads(await getContactLeads());
    }
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Company', 'Phone', 'Services', 'Budget', 'Timeline', 'Status', 'Date', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.servicesRequested || []).join(', ')}"`,
      `"${l.budget}"`,
      `"${l.timeline}"`,
      l.status,
      l.createdAt,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nova_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await updateSiteSettings(settings);
    onDataUpdated();
    showToast('Website and Brand settings saved successfully.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[94vh] bg-[#080c16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top App Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0a0f1c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={settings?.customLogoUrl || '/assets/nova-logo.webp'}
              alt="Nova Studio"
              className="w-9 h-9 rounded-full border border-cyan-500/40 object-contain shadow-sm shadow-cyan-500/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm font-bold text-white tracking-wide">
                  Nova Studio CMS & Admin Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  v2.6 Enterprise
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>Mode:</span>
                <span
                  className={
                    backendStatus.isSupabaseConfigured
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }
                >
                  {backendStatus.isSupabaseConfigured
                    ? 'Supabase Cloud Connected'
                    : 'Local Reactive Storage Fallback'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white glass-panel flex items-center gap-1.5"
                title="End session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              id="admin-close-btn"
              className="p-2 rounded-full glass-panel text-slate-400 hover:text-white"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="bg-cyan-500/20 border-b border-cyan-500/40 px-6 py-2 text-xs font-mono text-cyan-200 flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Secure Login View */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6">
              <img
                src={settings?.customLogoUrl || '/assets/nova-logo.webp'}
                alt="Nova Studio"
                className="w-16 h-16 rounded-full border-2 border-cyan-500/40 object-contain shadow-xl shadow-cyan-950/60 mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                }}
              />

              <div className="space-y-1">
                <h3 className="font-display text-2xl font-bold text-white">
                  Studio Admin Authorization
                </h3>
                <p className="text-xs text-slate-400">
                  Select your authorization protocol to access portfolio content, client leads, and Supabase cloud.
                </p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('master');
                    setLoginError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    loginMode === 'master'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Master Access Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('supabase');
                    setLoginError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    loginMode === 'supabase'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Supabase Auth
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginMode === 'master' ? (
                  <div>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password (default: admin123)"
                      className="w-full glass-panel px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Supabase User Email
                      </label>
                      <input
                        type="email"
                        required
                        value={supabaseEmail}
                        onChange={(e) => setSupabaseEmail(e.target.value)}
                        placeholder="admin@novawebstudio.com"
                        className="w-full glass-panel px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={supabasePassword}
                        onChange={(e) => setSupabasePassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full glass-panel px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 border border-white/10 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {loginError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 text-left">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  id="admin-login-submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {loginMode === 'master' ? 'Verify & Access Dashboard' : 'Authenticate via Supabase'}
                </button>
              </form>

              <div className="pt-2 text-[11px] font-mono text-slate-500">
                {loginMode === 'master' ? (
                  <>
                    Default Master Key: <code className="text-cyan-400">admin123</code> <br />
                    (Configurable inside the Security & Supabase tab)
                  </>
                ) : (
                  <>
                    Project Ref: <code className="text-cyan-400">{SUPABASE_PROJECT_REF}</code> <br />
                    Connected to: <code className="text-slate-400">{DEFAULT_SUPABASE_URL}</code>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-[#070a12] border-r border-white/10 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'services'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Services</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'leads'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Inquiries (CRM)</span>
                </div>
                {leads.filter((l) => l.status === 'new').length > 0 ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500 text-black font-bold">
                    {leads.filter((l) => l.status === 'new').length} new
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">
                    {leads.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Testimonials</span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'faqs'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQs</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'media'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery & Media</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">
                  {settings?.mediaGallery?.length || 0}
                </span>
              </button>

              <div className="my-2 border-t border-white/5" />

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Studio & Contact</span>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'seo'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Technical SEO</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'security'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security & DB</span>
              </button>
            </aside>

            {/* Main Tab Views */}
            <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#080c16]">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Dashboard Command Center
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time overview of your studio assets, active inquiries, and backend state.
                    </p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Total Projects</span>
                        <FolderGit2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-display text-3xl font-bold text-white">
                        {projects.length}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-1">
                        {projects.filter((p) => p.projectType === 'real').length} Real • {projects.filter((p) => p.projectType === 'concept').length} Concepts • {projects.filter((p) => p.projectType === 'demo').length} Demos
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Client Leads (CRM)</span>
                        <Inbox className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-display text-3xl font-bold text-white">
                        {leads.length}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-1">
                        {leads.filter((l) => l.status === 'new').length} New Uncontacted
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Disciplines & Services</span>
                        <Layers className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-display text-3xl font-bold text-white">
                        {services.length}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Published on Frontend
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>Database Architecture</span>
                        <Database className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-display text-xl font-bold text-white">
                        {backendStatus.isSupabaseConfigured ? 'Supabase' : 'Local Fallback'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                        {backendStatus.isSupabaseConfigured ? 'Live Cloud Storage' : 'Persistent localStorage'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries List */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-bold text-white">
                        Recent Inbound Project Leads
                      </h4>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs text-cyan-300 hover:underline"
                      >
                        View All Inquiries →
                      </button>
                    </div>

                    {leads.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">
                        No contact submissions recorded yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {leads.slice(0, 3).map((lead) => (
                          <div
                            key={lead.id}
                            className="py-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{lead.name}</span>
                                {lead.company && (
                                  <span className="text-slate-400 font-normal">
                                    ({lead.company})
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                    lead.status === 'new'
                                      ? 'bg-cyan-500/20 text-cyan-300'
                                      : 'bg-white/5 text-slate-400'
                                  }`}
                                >
                                  {lead.status}
                                </span>
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                {lead.email} • Budget: {lead.budget} • Timeline: {lead.timeline}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS MANAGER */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Project & Case Study Management
                      </h3>
                      <p className="text-xs text-slate-400">
                        Create, edit, toggle featured projects, and classify projects as Real, Concept, or Demo.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject({
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
                          metrics: [{ metric: '100%', label: 'Metric' }],
                          techStack: ['React', 'TypeScript'],
                          liveUrl: '',
                          featured: false,
                          mainImage:
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                          galleryImages: [],
                          order: projects.length + 1,
                          createdAt: new Date().toISOString(),
                        });
                        setIsAddingProject(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {/* Project Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="glass-panel p-4 rounded-2xl border border-white/10 flex gap-4 items-start justify-between"
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.mainImage}
                            alt={p.title}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">
                                {p.title}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                                  p.projectType === 'real'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : p.projectType === 'concept'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-cyan-500/20 text-cyan-300'
                                }`}
                              >
                                {p.projectType}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {p.client} • {p.category}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                              {p.summary}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setIsAddingProject(false);
                            }}
                            className="p-1.5 rounded-lg glass-panel text-slate-300 hover:text-cyan-300"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-rose-400"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit/Add Project Modal */}
                  {(editingProject || isAddingProject) && editingProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#090d16] space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h4 className="font-display text-lg font-bold text-white">
                            {isAddingProject ? 'Add New Project' : `Edit: ${editingProject.title}`}
                          </h4>
                          <button
                            onClick={() => {
                              setEditingProject(null);
                              setIsAddingProject(false);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-slate-300 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingProject.title}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  title: e.target.value,
                                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Client Name</label>
                            <input
                              type="text"
                              value={editingProject.client}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, client: e.target.value })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Category</label>
                            <select
                              value={editingProject.category}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  category: e.target.value as any,
                                })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10 bg-[#090d16]"
                            >
                              <option value="Websites">Websites</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Web Apps">Web Apps</option>
                              <option value="SaaS">SaaS</option>
                              <option value="AI">AI</option>
                              <option value="UI/UX">UI/UX</option>
                              <option value="Branding">Branding</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Project Nature</label>
                            <select
                              value={editingProject.projectType}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  projectType: e.target.value as ProjectType,
                                })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10 bg-[#090d16]"
                            >
                              <option value="real">Real Client Project</option>
                              <option value="concept">Concept Exploration</option>
                              <option value="demo">R&D / Demo Lab</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Year</label>
                            <input
                              type="text"
                              value={editingProject.year}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, year: e.target.value })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Live URL (Demo)</label>
                            <input
                              type="url"
                              value={editingProject.liveUrl}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, liveUrl: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>
                        </div>

                        <div className="text-xs space-y-3">
                          <div>
                            <label className="block text-slate-300 mb-1">
                              Main Image (URL or Supabase Storage Upload)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingProject.mainImage}
                                onChange={(e) =>
                                  setEditingProject({ ...editingProject, mainImage: e.target.value })
                                }
                                placeholder="https://... or upload file"
                                className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                              <label className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      showToast('Uploading image to Supabase storage...');
                                      const res = await uploadMediaToSupabase(file, 'projects');
                                      if (res.url) {
                                        setEditingProject({ ...editingProject, mainImage: res.url });
                                        showToast('Image uploaded to Supabase storage!');
                                      } else {
                                        showToast(`Upload failed: ${res.error}`);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">
                              Project Video / Walkthrough (URL or Supabase Upload)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingProject.videoUrl || ''}
                                onChange={(e) =>
                                  setEditingProject({ ...editingProject, videoUrl: e.target.value })
                                }
                                placeholder="https://... MP4, WebM or YouTube link"
                                className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                              <label className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Video</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      showToast('Uploading video to Supabase storage...');
                                      const res = await uploadMediaToSupabase(file, 'videos');
                                      if (res.url) {
                                        setEditingProject({ ...editingProject, videoUrl: res.url });
                                        showToast('Video uploaded to Supabase storage!');
                                      } else {
                                        showToast(`Upload failed: ${res.error}`);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Short Summary</label>
                            <input
                              type="text"
                              value={editingProject.summary}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, summary: e.target.value })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">The Technical Challenge</label>
                            <textarea
                              rows={2}
                              value={editingProject.challenge}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, challenge: e.target.value })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">The Architectural Solution</label>
                            <textarea
                              rows={2}
                              value={editingProject.solution}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, solution: e.target.value })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Full Narrative / Case Study</label>
                            <textarea
                              rows={3}
                              value={editingProject.fullDescription}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  fullDescription: e.target.value,
                                })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">
                              Tech Stack (Comma-separated)
                            </label>
                            <input
                              type="text"
                              value={editingProject.techStack.join(', ')}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  techStack: e.target.value.split(',').map((t) => t.trim()),
                                })
                              }
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(null);
                              setIsAddingProject(false);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProject(editingProject)}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save Project
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Services & Deliverables
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage agency capabilities, pricing benchmarks, and deliverables. All updates sync to Supabase.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingService(createEmptyService());
                        setIsAddingService(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-base">{s.title}</h4>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono text-cyan-300 mr-2">
                                {s.startingPrice}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingService(s);
                                  setIsAddingService(false);
                                }}
                                className="p-1.5 rounded-lg glass-panel text-slate-300 hover:text-cyan-300"
                                title="Edit service"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.id)}
                                className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-rose-400"
                                title="Delete service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300">{s.shortDesc}</p>
                          <div className="flex flex-wrap gap-1">
                            {s.technologies.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {s.turnaround && (
                          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                            Turnaround: <span className="text-white">{s.turnaround}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit Service Modal */}
                  {(editingService || isAddingService) && editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#090d16] space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h4 className="font-display text-lg font-bold text-white">
                            {isAddingService ? 'Add New Service' : `Edit: ${editingService.title}`}
                          </h4>
                          <button
                            onClick={() => {
                              setEditingService(null);
                              setIsAddingService(false);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-slate-300 mb-1">Service Title</label>
                            <input
                              type="text"
                              value={editingService.title}
                              onChange={(e) =>
                                setEditingService({ ...editingService, title: e.target.value })
                              }
                              placeholder="e.g. Next-Gen Web Applications"
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-300 mb-1">Starting Price</label>
                              <input
                                type="text"
                                value={editingService.startingPrice}
                                onChange={(e) =>
                                  setEditingService({ ...editingService, startingPrice: e.target.value })
                                }
                                placeholder="e.g. $2,500"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 mb-1">Turnaround</label>
                              <input
                                type="text"
                                value={editingService.turnaround}
                                onChange={(e) =>
                                  setEditingService({ ...editingService, turnaround: e.target.value })
                                }
                                placeholder="e.g. 2-3 Weeks"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Short Description</label>
                            <textarea
                              rows={2}
                              value={editingService.shortDesc}
                              onChange={(e) =>
                                setEditingService({ ...editingService, shortDesc: e.target.value })
                              }
                              placeholder="Concise overview shown in cards..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Full Description</label>
                            <textarea
                              rows={3}
                              value={editingService.fullDesc}
                              onChange={(e) =>
                                setEditingService({ ...editingService, fullDesc: e.target.value })
                              }
                              placeholder="Detailed capability overview..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">
                              Technologies & Tools (comma separated)
                            </label>
                            <input
                              type="text"
                              value={editingService.technologies.join(', ')}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  technologies: e.target.value.split(',').map((t) => t.trim()),
                                })
                              }
                              placeholder="React, TypeScript, Next.js, Supabase..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">
                              Deliverables (comma separated)
                            </label>
                            <input
                              type="text"
                              value={editingService.deliverables.join(', ')}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  deliverables: e.target.value.split(',').map((d) => d.trim()),
                                })
                              }
                              placeholder="Custom Design, Responsive Build, SEO Optimization..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService(null);
                              setIsAddingService(false);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveService(editingService)}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save Service to Supabase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LEADS / INQUIRIES CRM */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Contact Leads CRM
                      </h3>
                      <p className="text-xs text-slate-400">
                        Inquiries submitted through the website contact form and saved to database.
                      </p>
                    </div>
                    <button
                      onClick={exportLeadsToCSV}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-cyan-300 glass-panel border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-2 self-start"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {leads.length === 0 ? (
                    <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl">
                      No customer leads recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-display text-base font-bold text-white">
                                  {lead.name}
                                </span>
                                {lead.company && (
                                  <span className="text-xs text-slate-400">
                                    at {lead.company}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-cyan-400 font-mono">
                                {lead.email} {lead.phone && `• ${lead.phone}`}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  handleLeadStatusChange(
                                    lead.id,
                                    e.target.value as ContactLead['status']
                                  )
                                }
                                className="glass-panel px-3 py-1 rounded-lg text-xs font-mono text-cyan-300 border border-cyan-500/30 bg-[#0c1220]"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="in_discussion">In Discussion</option>
                                <option value="closed">Closed / Won</option>
                              </select>

                              {leadPendingDeleteId === lead.id ? (
                                <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/50 px-2 py-1 rounded-lg">
                                  <span className="text-[11px] text-rose-300 font-mono">Delete?</span>
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors shadow-sm"
                                    title="Confirm permanent deletion"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setLeadPendingDeleteId(null)}
                                    className="px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-300 hover:text-white glass-panel transition-colors"
                                    title="Cancel"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setLeadPendingDeleteId(lead.id)}
                                  className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                            <div className="text-slate-400">
                              Budget: <span className="text-white font-semibold">{lead.budget}</span>
                            </div>
                            <div className="text-slate-400">
                              Timeline: <span className="text-white font-semibold">{lead.timeline}</span>
                            </div>
                            <div className="text-slate-400">
                              Received:{' '}
                              <span className="text-slate-300">
                                {new Date(lead.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {lead.servicesRequested && lead.servicesRequested.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {lead.servicesRequested.map((srv) => (
                                <span
                                  key={srv}
                                  className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
                                >
                                  {srv}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="p-3 rounded-xl bg-black/30 text-xs text-slate-200 leading-relaxed border border-white/5">
                            {lead.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Client Testimonials
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage client reviews, roles, quotes, and star ratings. All persisted in Supabase.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTestimonial(createEmptyTestimonial());
                        setIsAddingTestimonial(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Testimonial</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={t.clientAvatar}
                                alt={t.clientName}
                                className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-white text-sm">
                                  {t.clientName}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {t.clientRole} • {t.clientCompany}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingTestimonial(t);
                                  setIsAddingTestimonial(false);
                                }}
                                className="p-1.5 rounded-lg glass-panel text-slate-300 hover:text-cyan-300"
                                title="Edit testimonial"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-rose-400"
                                title="Delete testimonial"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 italic leading-relaxed">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{t.projectDelivered || 'Web Studio Project'}</span>
                          <span className="text-amber-400 font-mono">★ {t.rating}.0</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit Testimonial Modal */}
                  {(editingTestimonial || isAddingTestimonial) && editingTestimonial && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#090d16] space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h4 className="font-display text-lg font-bold text-white">
                            {isAddingTestimonial ? 'Add New Testimonial' : `Edit Testimonial: ${editingTestimonial.clientName}`}
                          </h4>
                          <button
                            onClick={() => {
                              setEditingTestimonial(null);
                              setIsAddingTestimonial(false);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-300 mb-1">Client Full Name</label>
                              <input
                                type="text"
                                value={editingTestimonial.clientName}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    clientName: e.target.value,
                                  })
                                }
                                placeholder="e.g. Marcus Vance"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 mb-1">Company / Organization</label>
                              <input
                                type="text"
                                value={editingTestimonial.clientCompany}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    clientCompany: e.target.value,
                                  })
                                }
                                placeholder="e.g. Apex Global"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-300 mb-1">Client Role / Title</label>
                              <input
                                type="text"
                                value={editingTestimonial.clientRole}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    clientRole: e.target.value,
                                  })
                                }
                                placeholder="e.g. Chief Executive Officer"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 mb-1">Rating (1-5)</label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={editingTestimonial.rating}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    rating: parseInt(e.target.value) || 5,
                                  })
                                }
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">
                              Client Avatar (URL or Upload)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingTestimonial.clientAvatar}
                                onChange={(e) =>
                                  setEditingTestimonial({
                                    ...editingTestimonial,
                                    clientAvatar: e.target.value,
                                  })
                                }
                                placeholder="https://... or upload photo"
                                className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                              <label className="px-3 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      showToast('Uploading avatar to Supabase...');
                                      const res = await uploadMediaToSupabase(file, 'general');
                                      if (res.url) {
                                        setEditingTestimonial({
                                          ...editingTestimonial,
                                          clientAvatar: res.url,
                                        });
                                        showToast('Avatar uploaded successfully!');
                                      } else {
                                        showToast(`Upload failed: ${res.error}`);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Project Delivered</label>
                            <input
                              type="text"
                              value={editingTestimonial.projectDelivered}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  projectDelivered: e.target.value,
                                })
                              }
                              placeholder="e.g. Enterprise Cloud Platform"
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Quote / Review</label>
                            <textarea
                              rows={4}
                              value={editingTestimonial.quote}
                              onChange={(e) =>
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  quote: e.target.value,
                                })
                              }
                              placeholder="Write client testimonial..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTestimonial(null);
                              setIsAddingTestimonial(false);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveTestimonial(editingTestimonial)}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save Testimonial to Supabase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Frequently Asked Questions
                      </h3>
                      <p className="text-xs text-slate-400">
                        Update questions, answers, and categorization. Stored in Supabase.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFAQ(createEmptyFAQ());
                        setIsAddingFAQ(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((f) => (
                      <div
                        key={f.id}
                        className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">
                              {f.question}
                            </h4>
                            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                              {f.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{f.answer}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingFAQ(f);
                              setIsAddingFAQ(false);
                            }}
                            className="p-1.5 rounded-lg glass-panel text-slate-300 hover:text-cyan-300"
                            title="Edit FAQ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFAQ(f.id)}
                            className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-rose-400"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit FAQ Modal */}
                  {(editingFAQ || isAddingFAQ) && editingFAQ && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#090d16] space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h4 className="font-display text-lg font-bold text-white">
                            {isAddingFAQ ? 'Add New FAQ' : 'Edit FAQ'}
                          </h4>
                          <button
                            onClick={() => {
                              setEditingFAQ(null);
                              setIsAddingFAQ(false);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-slate-300 mb-1">Question</label>
                            <input
                              type="text"
                              value={editingFAQ.question}
                              onChange={(e) =>
                                setEditingFAQ({ ...editingFAQ, question: e.target.value })
                              }
                              placeholder="e.g. What is the typical turnaround time for a custom web studio project?"
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-300 mb-1">Category</label>
                              <input
                                type="text"
                                value={editingFAQ.category}
                                onChange={(e) =>
                                  setEditingFAQ({ ...editingFAQ, category: e.target.value })
                                }
                                placeholder="General, Process, Pricing, Tech"
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 mb-1">Display Order</label>
                              <input
                                type="number"
                                value={editingFAQ.order}
                                onChange={(e) =>
                                  setEditingFAQ({
                                    ...editingFAQ,
                                    order: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 mb-1">Answer</label>
                            <textarea
                              rows={4}
                              value={editingFAQ.answer}
                              onChange={(e) =>
                                setEditingFAQ({ ...editingFAQ, answer: e.target.value })
                              }
                              placeholder="Comprehensive, clear answer..."
                              className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFAQ(null);
                              setIsAddingFAQ(false);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveFAQ(editingFAQ)}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            Save FAQ to Supabase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: GALLERY & MEDIA */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Studio Media Library & Assets
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload and manage media files (Photos, Logos, Hero Videos). Persisted directly to Supabase storage.
                      </p>
                    </div>

                    {/* Upload button */}
                    <label className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center gap-2 cursor-pointer self-start">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingMedia ? 'Uploading...' : 'Upload Media Asset'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        disabled={isUploadingMedia}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingMedia(true);
                          showToast(`Uploading ${file.name} to Supabase...`);
                          const category = file.type.startsWith('video') ? 'hero' : 'branding';
                          const res = await uploadMediaToSupabase(file, category as any);
                          setIsUploadingMedia(false);
                          if (res.url) {
                            showToast(`Uploaded ${file.name} successfully!`);
                            await loadAllData();
                            onDataUpdated();
                          } else {
                            showToast(`Upload failed: ${res.error}`);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {['all', 'branding', 'hero', 'portfolio', 'founder', 'general'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMediaCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all ${
                          mediaCategoryFilter === cat
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'glass-panel text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Media Grid */}
                  {(!settings?.mediaGallery || settings.mediaGallery.length === 0) ? (
                    <div className="glass-panel p-12 text-center text-slate-400 rounded-3xl border border-white/10 space-y-3">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm">No media assets in library yet.</p>
                      <p className="text-xs text-slate-500">
                        Upload images (PNG, JPG, SVG, WebP) or video files (MP4, WebM) to store them in Supabase.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {settings.mediaGallery
                        .filter((asset) => mediaCategoryFilter === 'all' || asset.category === mediaCategoryFilter)
                        .map((asset) => (
                          <div
                            key={asset.id}
                            className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between group"
                          >
                            <div className="space-y-2">
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                                {asset.type === 'video' ? (
                                  <video
                                    src={asset.url}
                                    controls
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={asset.url}
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                                  {asset.category}
                                </span>
                              </div>

                              <div>
                                <div className="font-semibold text-white text-xs truncate" title={asset.name}>
                                  {asset.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                                  <span>{asset.size || 'Web Asset'}</span>
                                  <span>•</span>
                                  <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quick Assignment Actions */}
                            <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px]">
                              {asset.type === 'image' && (
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    onClick={async () => {
                                      if (!settings) return;
                                      const updated = { ...settings, founderAvatar: asset.url };
                                      setSettings(updated);
                                      await updateSiteSettings(updated);
                                      showToast('Updated Founder Photo in Supabase!');
                                      onDataUpdated();
                                    }}
                                    className="px-2 py-1 rounded-lg glass-panel hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-center transition-colors text-[10px]"
                                  >
                                    Set Founder Photo
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!settings) return;
                                      const updated = { ...settings, customLogoUrl: asset.url };
                                      setSettings(updated);
                                      await updateSiteSettings(updated);
                                      showToast('Updated Studio Logo in Supabase!');
                                      onDataUpdated();
                                    }}
                                    className="px-2 py-1 rounded-lg glass-panel hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-center transition-colors text-[10px]"
                                  >
                                    Set Studio Logo
                                  </button>
                                </div>
                              )}

                              {asset.type === 'video' && (
                                <button
                                  onClick={async () => {
                                    if (!settings) return;
                                    const updated = { ...settings, heroVideoUrl: asset.url };
                                    setSettings(updated);
                                    await updateSiteSettings(updated);
                                    showToast('Updated Hero Background Video in Supabase!');
                                    onDataUpdated();
                                  }}
                                  className="w-full px-2 py-1 rounded-lg glass-panel hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-center transition-colors text-[10px]"
                                >
                                  Set as Hero Background Video
                                </button>
                              )}

                              <div className="flex items-center justify-between pt-1">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(asset.url);
                                    showToast('Copied media URL to clipboard!');
                                  }}
                                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                  <Link2 className="w-3 h-3" />
                                  <span>Copy URL</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this media asset?')) {
                                      await deleteMediaAsset(asset.id);
                                      showToast('Media asset removed from Supabase');
                                      await loadAllData();
                                      onDataUpdated();
                                    }
                                  }}
                                  className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: STUDIO & CONTACT SETTINGS */}
              {activeTab === 'settings' && settings && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Website & Brand Settings
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure studio identity, founder details, direct phone, and WhatsApp numbers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1">Studio Name</label>
                      <input
                        type="text"
                        value={settings.studioName}
                        onChange={(e) =>
                          setSettings({ ...settings, studioName: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) =>
                          setSettings({ ...settings, tagline: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Founder Name</label>
                      <input
                        type="text"
                        value={settings.founderName}
                        onChange={(e) =>
                          setSettings({ ...settings, founderName: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Founder Title</label>
                      <input
                        type="text"
                        value={settings.founderTitle}
                        onChange={(e) =>
                          setSettings({ ...settings, founderTitle: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Direct Call Phone</label>
                      <input
                        type="text"
                        value={settings.contactPhone}
                        onChange={(e) =>
                          setSettings({ ...settings, contactPhone: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) =>
                          setSettings({ ...settings, whatsappNumber: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Studio Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, contactEmail: e.target.value })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Project Availability</label>
                      <input
                        type="text"
                        value={settings.projectAvailability}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            projectAvailability: e.target.value,
                          })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-300 mb-1">
                      Founder Photo (Syed Ehtisham Gillani — Active on Website)
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-cyan-500/40 bg-[#0c1424] shrink-0">
                        <img
                          src={
                            settings.founderAvatar && !settings.founderAvatar.startsWith('blob:')
                              ? settings.founderAvatar
                              : '/assets/founder-photo.jpg'
                          }
                          alt="Founder Preview"
                          className="w-full h-full object-cover object-[center_15%]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/founder-photo.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste image URL or asset link for founder photo..."
                            value={settings.founderAvatar}
                            onChange={(e) =>
                              setSettings({ ...settings, founderAvatar: e.target.value })
                            }
                            className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                          />
                          <label className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  showToast('Uploading founder photo to Supabase storage...');
                                  const res = await uploadMediaToSupabase(file, 'branding');
                                  if (res.url) {
                                    setSettings({ ...settings, founderAvatar: res.url });
                                    showToast('Founder photo updated & uploaded to Supabase!');
                                  } else {
                                    showToast(`Upload failed: ${res.error}`);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                          <span>Original high-resolution photo is active at /assets/founder-photo.jpg</span>
                          {settings.founderAvatar !== '/assets/founder-photo.jpg' && (
                            <button
                              type="button"
                              onClick={() =>
                                setSettings({ ...settings, founderAvatar: '/assets/founder-photo.jpg' })
                              }
                              className="text-cyan-400 hover:underline"
                            >
                              Reset to Original Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-300 mb-1">Custom Logo Image (URL or Supabase Upload)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste custom logo image URL or upload to Supabase..."
                        value={settings.customLogoUrl || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, customLogoUrl: e.target.value })
                        }
                        className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                      <label className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              showToast('Uploading logo to Supabase storage...');
                              const res = await uploadMediaToSupabase(file, 'branding');
                              if (res.url) {
                                setSettings({ ...settings, customLogoUrl: res.url });
                                showToast('Logo uploaded to Supabase storage!');
                              } else {
                                showToast(`Upload failed: ${res.error}`);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* HERO CINEMATIC VIDEO SETTINGS */}
                  <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <h4 className="font-display font-bold text-white text-sm">
                        Hero Cinematic Video / 3D Canvas Background
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1">Hero Background Mode</label>
                        <select
                          value={settings.heroBackgroundMode || '3d-canvas'}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              heroBackgroundMode: e.target.value as any,
                            })
                          }
                          className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10 bg-[#090d16]"
                        >
                          <option value="3d-canvas">Interactive 3D Kinetic Canvas</option>
                          <option value="cinematic-video">Cinematic Video Background</option>
                          <option value="hybrid">Hybrid (Cinematic Video + 3D Canvas)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1">Ambient Playback Speed</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="2.0"
                          value={settings.heroVideoPlaybackRate || 0.6}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              heroVideoPlaybackRate: parseFloat(e.target.value) || 0.6,
                            })
                          }
                          className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-slate-300 mb-1">
                        Hero Video URL / Frame Sequence (URL or Supabase Upload)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste MP4/WebM video URL or upload to Supabase..."
                          value={settings.heroVideoUrl || ''}
                          onChange={(e) =>
                            setSettings({ ...settings, heroVideoUrl: e.target.value })
                          }
                          className="flex-1 glass-panel px-3 py-2 rounded-xl text-white border border-white/10 font-mono"
                        />
                        <label className="px-3.5 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5 hover:bg-cyan-500/10 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Video</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                showToast('Uploading hero video to Supabase storage...');
                                const res = await uploadMediaToSupabase(file, 'hero');
                                if (res.url) {
                                  setSettings({ ...settings, heroVideoUrl: res.url });
                                  showToast('Hero video uploaded to Supabase storage!');
                                } else {
                                  showToast(`Upload failed: ${res.error}`);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Scrolling will control video progression smoothly with interpolation and mobile-friendly fallback.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <input
                        type="checkbox"
                        id="scrubToggle"
                        checked={settings.heroVideoScrubEnabled ?? true}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            heroVideoScrubEnabled: e.target.checked,
                          })
                        }
                        className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="scrubToggle" className="text-slate-300">
                        Enable smooth scroll-driven video scrubbing / progression
                      </label>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-300 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                      className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-300 mb-1">Founder Biography</label>
                    <textarea
                      rows={3}
                      value={settings.founderBio}
                      onChange={(e) =>
                        setSettings({ ...settings, founderBio: e.target.value })
                      }
                      className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                    >
                      Save Studio Settings
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 8: TECHNICAL SEO */}
              {activeTab === 'seo' && settings && (
                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Technical SEO & Open Graph
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage metadata, canonical URLs, search schema, and inspect dynamic sitemap/robots.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1">Meta Page Title</label>
                      <input
                        type="text"
                        value={settings.seo.metaTitle}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, metaTitle: e.target.value },
                          })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={settings.seo.metaDescription}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, metaDescription: e.target.value },
                          })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Canonical Base URL</label>
                      <input
                        type="url"
                        value={settings.seo.canonicalUrl}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, canonicalUrl: e.target.value },
                          })
                        }
                        className="w-full glass-panel px-3 py-2 rounded-xl text-white border border-white/10"
                      />
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                    >
                      Save SEO Metadata
                    </button>
                  </div>

                  {/* Sitemap & Robots.txt Links */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="font-bold text-white text-sm">
                      Generated Search Artifacts
                    </h4>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        className="px-4 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>View live sitemap.xml</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="/robots.txt"
                        target="_blank"
                        className="px-4 py-2 rounded-xl glass-panel text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>View live robots.txt</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: SECURITY & SUPABASE ARCHITECTURE */}
              {activeTab === 'security' && (
                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      Supabase Cloud Architecture & Security
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage your Supabase production database, cloud storage bucket, initial data seeding, and master credentials.
                    </p>
                  </div>

                  {/* SUPABASE CLOUD COMMAND CENTER */}
                  <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-cyan-400" />
                          <h4 className="font-bold text-white text-base">
                            Supabase Cloud Project
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            PostgreSQL + RLS
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Project Ref: <code className="text-cyan-300 font-mono">{SUPABASE_PROJECT_REF}</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={runHealthCheck}
                          disabled={isCheckingHealth}
                          className="px-3.5 py-2 rounded-xl text-xs font-mono text-cyan-300 glass-panel border border-cyan-500/30 hover:bg-cyan-500/10 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                          <span>{isCheckingHealth ? 'Testing...' : 'Test Connection'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSyncToSupabase}
                          disabled={isSeedingData}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          <Upload className={`w-3.5 h-3.5 ${isSeedingData ? 'animate-bounce' : ''}`} />
                          <span>{isSeedingData ? 'Seeding Cloud...' : 'Seed Data to Supabase'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Connection Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-slate-500 text-[10px] uppercase">Supabase Endpoint URL</div>
                        <div className="text-cyan-300 truncate select-all">{DEFAULT_SUPABASE_URL}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="text-slate-500 text-[10px] uppercase">Client Anon Key Status</div>
                        <div className="flex items-center gap-2">
                          <span className={backendStatus.hasAnonKey ? 'text-emerald-400' : 'text-rose-400'}>
                            {backendStatus.hasAnonKey ? '● Configured in Environment' : '○ Not Detected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Health Status Banner */}
                    {healthStatus && (
                      <div
                        className={`p-4 rounded-xl text-xs flex flex-col gap-2 ${
                          healthStatus.hasTables
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                            : healthStatus.connected
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          {healthStatus.hasTables ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                          )}
                          <span>{healthStatus.message}</span>
                        </div>

                        {healthStatus.tableDetails && (
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                            {Object.entries(healthStatus.tableDetails).map(([tbl, ok]) => (
                              <div key={tbl} className="flex items-center gap-1.5">
                                <span className={ok ? 'text-emerald-400' : 'text-slate-500'}>
                                  {ok ? '✓' : '✗'}
                                </span>
                                <span className="text-slate-300">{tbl}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SQL Migration Instructions Card */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <Server className="w-4 h-4 text-cyan-400" />
                          Database Schema Migration Script
                        </span>
                        <a
                          href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>Open Supabase SQL Editor</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <p className="text-xs text-slate-300">
                        The full PostgreSQL migration is generated at <code className="text-cyan-300 font-mono">/supabase_schema.sql</code>. It creates all tables (<span className="text-slate-200 font-mono">projects, services, testimonials, faqs, leads, site_settings</span>), enables Row Level Security (RLS), sets up the public storage bucket <span className="text-cyan-300 font-mono">portfolio-assets</span>, and configures policies.
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('/supabase_schema.sql');
                            setSchemaCopied(true);
                            setTimeout(() => setSchemaCopied(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg glass-panel text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 hover:bg-cyan-500/10"
                        >
                          {schemaCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{schemaCopied ? 'Path Copied!' : 'Copy Schema Path'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Supabase Storage Details */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>Cloud Storage Bucket: <code className="text-cyan-300 font-mono">portfolio-assets</code></span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Used for project screenshots, agency logos, client avatars, and background videos. File size limit: 50MB. Allowed types: JPEG, PNG, WebP, SVG, MP4, WebM.
                      </p>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Change Admin Password (Supabase Auth & Master Access)</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Min. 8 Characters
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Securely updates your administrative password using <code className="text-cyan-300 font-mono">supabase.auth.updateUser</code>. Passwords are never stored in plain text in any database.
                    </p>

                    {passwordStatusMsg && (
                      <div
                        className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                          passwordStatusMsg.isError
                            ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                        }`}
                      >
                        {passwordStatusMsg.isError ? (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        ) : (
                          <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        )}
                        <span className="leading-relaxed">{passwordStatusMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-slate-300 font-medium">New Password</label>
                          {newPassword && (
                            <span className={`text-[11px] font-mono font-semibold ${calculatePasswordStrength(newPassword).color}`}>
                              Strength: {calculatePasswordStrength(newPassword).label}
                            </span>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter at least 8 characters"
                          className="w-full glass-panel px-3.5 py-2.5 rounded-xl text-white border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-slate-500"
                        />
                        {/* Password strength bar */}
                        {newPassword && (
                          <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden flex gap-1">
                            <div
                              className={`h-full transition-all ${
                                calculatePasswordStrength(newPassword).score >= 1
                                  ? calculatePasswordStrength(newPassword).score === 1
                                    ? 'w-1/3 bg-rose-500'
                                    : calculatePasswordStrength(newPassword).score === 2
                                    ? 'w-2/3 bg-amber-500'
                                    : 'w-full bg-emerald-500'
                                  : 'w-0'
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your new password"
                          className="w-full glass-panel px-3.5 py-2.5 rounded-xl text-white border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-slate-500"
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-rose-400 text-[11px] font-mono mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Passwords do not match
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isChangingPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                        className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 transition-all cursor-pointer"
                      >
                        {isChangingPassword ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Updating Securely...</span>
                          </>
                        ) : (
                          <>
                            <Key className="w-3.5 h-3.5" />
                            <span>Update Password via Supabase Auth</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
