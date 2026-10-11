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
import { SiteSettings, formatWhatsAppUrl } from '../types';

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

  // Ensure initial video playback at smooth speed
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = settings.heroVideoPlaybackRate || 0.5;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback
        });
      }
    }
  }, [settings.heroVideoUrl, settings.heroVideoPlaybackRate]);

  // Smooth Scroll & mouse-wheel driven video scrubbing logic
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
      const maxScroll = windowHeight * 1.8;
      const scrollFraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        targetTime = scrollFraction * video.duration;
      }

      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 180);
    };

    const interpolateVideo = () => {
      if (isUserScrolling && video.duration && !isNaN(video.duration)) {
        if (!video.paused) {
          video.pause();
        }
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.02) {
          video.currentTime += diff * 0.2;
        }
      } else if (!isUserScrolling && video.paused) {
        video.playbackRate = settings.heroVideoPlaybackRate || 0.5;
        video.play().catch(() => {});
      }
      animationFrameId = requestAnimationFrame(interpolateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(interpolateVideo);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout);
    };
  }, [settings.heroVideoUrl, isMobile, settings.heroVideoScrubEnabled, settings.heroVideoPlaybackRate]);

  const whatsappUrl = formatWhatsAppUrl(
    settings.whatsappNumber,
    'Hello Syed Ehtisham Gillani, I am contacting Nova Web Studio regarding a new digital project.'
  );

  const keyCapabilities = [
    'Websites',
    'Web Apps',
    'SaaS Platforms',
    'AI Solutions',
    'Business Automation',
  ];

  const hasActiveVideo = Boolean(settings.heroVideoUrl && settings.heroVideoUrl.trim() !== '');

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/75 to-[#05070c]/90" />
        </div>
      )}

      {/* Decorative Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Availability Status */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8 shadow-lg shadow-cyan-950/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{settings.projectAvailability || 'Accepting New Projects & Free Consultations'}</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08]">
            Nova Web Studio <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 bg-clip-text text-transparent">
              Modern Digital Technology
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed pt-2">
            We help businesses, startups, and brands build high-performance digital products:
            fast websites, web applications, SaaS platforms, AI chatbots, and automated workflows.
          </p>
        </div>

        {/* Clean Editorial Capabilities */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-slate-300 my-8 max-w-2xl mx-auto">
          {keyCapabilities.map((cap, idx) => (
            <React.Fragment key={cap}>
              {idx > 0 && <span className="text-slate-500 select-none">·</span>}
              <span className="text-slate-300">{cap}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Primary Contact CTAs - WhatsApp is Primary */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Primary: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/50 flex items-center gap-2.5 group hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Secondary: Book Free Consultation */}
          <button
            onClick={onOpenContact}
            className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <span>Book Free Consultation</span>
          </button>

          {/* Direct Phone Call CTA */}
          <a
            href={`tel:${settings.contactPhone}`}
            className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 glass-panel border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>Call: {settings.contactPhone}</span>
          </a>

          {/* View Our Work */}
          <button
            onClick={onExploreWork}
            className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            View Work
          </button>
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
