import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Layers,
  Bot,
  Laptop,
  Code2,
  Video,
  Monitor,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onOpenContact: () => void;
  onExploreWork: () => void;
  onToggleHeroVideoMode?: (mode: '3d-canvas' | 'cinematic-video' | 'hybrid') => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenContact,
  onExploreWork,
  onToggleHeroVideoMode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth Scroll-driven video scrubbing logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !settings.heroVideoUrl || isMobile || !settings.heroVideoScrubEnabled) {
      return;
    }

    let targetTime = 0;
    let animationFrameId: number;
    let isUserScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Map first 1.5 screen heights of scroll to video duration
      const maxScroll = windowHeight * 1.5;
      const scrollFraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      if (video.duration && !isNaN(video.duration)) {
        targetTime = scrollFraction * video.duration;
      }

      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 150);
    };

    // Smooth interpolation loop
    const interpolateVideo = () => {
      if (isUserScrolling && video.duration && !isNaN(video.duration)) {
        if (!video.paused) {
          video.pause();
        }
        // Smoothly interpolate current time towards targetTime
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.04) {
          video.currentTime += diff * 0.15;
        }
      } else if (!isUserScrolling && video.paused) {
        // Slow continuous ambient playback when user stops scrolling
        video.playbackRate = settings.heroVideoPlaybackRate || 0.6;
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      }
      animationFrameId = requestAnimationFrame(interpolateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(interpolateVideo);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout);
    };
  }, [settings.heroVideoUrl, isMobile, settings.heroVideoScrubEnabled, settings.heroVideoPlaybackRate]);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Syed Ehtisham Gillani, I am contacting Nova Web Studio regarding a new digital project.'
  )}`;

  const pills = [
    { label: 'Websites', icon: Monitor },
    { label: 'Web Apps', icon: Laptop },
    { label: 'SaaS Platforms', icon: Layers },
    { label: 'AI Chatbots', icon: Bot },
    { label: 'Business Automation', icon: Sparkles },
  ];

  const hasActiveVideo = Boolean(settings.heroVideoUrl && settings.heroVideoUrl.trim() !== '');

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Layer: Cinematic Video (if enabled and provided) */}
      {hasActiveVideo && (settings.heroBackgroundMode === 'cinematic-video' || settings.heroBackgroundMode === 'hybrid') && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={settings.heroVideoUrl}
            muted
            playsInline
            loop
            autoPlay
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover opacity-35 filter contrast-125 saturate-110"
          />
          {/* Dark gradient overlay to preserve legibility and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/70 to-[#05070c]/90" />
        </div>
      )}

      {/* Decorative Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8 shadow-lg shadow-cyan-950/40 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{settings.projectAvailability || 'ACCEPTING NEW PROJECTS & FREE CONSULTATIONS'}</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08]">
            Nova Web Studio <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 bg-clip-text text-transparent">
              Modern Digital Technology
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed pt-2">
            We help businesses, startups, and ambitious brands build modern digital products:
            high-speed websites, scalable web applications, SaaS platforms, AI chatbots, and automated workflows.
          </p>
        </div>

        {/* Modern Agency Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-8 max-w-2xl mx-auto">
          {pills.map((pill, idx) => {
            const IconComponent = pill.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-200 glass-panel border border-white/10 hover:border-cyan-400/40 transition-all"
              >
                <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                <span>{pill.label}</span>
              </div>
            );
          })}
        </div>

        {/* High-Conversion CTAs: 4 Essential Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Primary: Book Free Consultation */}
          <button
            onClick={onOpenContact}
            className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2 group"
          >
            <span>Book a Free Consultation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary: View Our Work */}
          <button
            onClick={onExploreWork}
            className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-slate-200 glass-panel hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all"
          >
            View Our Work
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-300 glass-panel border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Direct Phone Call CTA */}
          <a
            href={`tel:${settings.contactPhone}`}
            className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 glass-panel border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>Call: {settings.contactPhone}</span>
          </a>
        </div>

        {/* Direct Founder Trust Tag */}
        <div className="mt-8 text-xs font-mono text-slate-400">
          Founder & Technology Lead: <span className="text-white font-semibold">{settings.founderName}</span>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-16 sm:pt-20 flex flex-col items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            Scroll to Explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
