import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number; // 1 = distant, 2 = mid, 3 = bright nova
  color: string;
  rgb: string;
  spikeLength?: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
  width: number;
}

export const LightingStarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll parallax tracking
    let scrollY = window.scrollY || 0;
    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Stars collection
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();

    // Color palettes matching Nova Web Studio cyberpunk / cosmic branding
    const starPalettes = [
      { color: '#ffffff', rgb: '255, 255, 255' }, // Pure stellar white
      { color: '#e0f2fe', rgb: '224, 242, 254' }, // Sky white
      { color: '#38bdf8', rgb: '56, 189, 248' },  // Electric Cyan / Sky
      { color: '#22d3ee', rgb: '34, 211, 238' },  // Bright Cyan
      { color: '#93c5fd', rgb: '147, 197, 253' }, // Soft Cosmic Blue
      { color: '#a78bfa', rgb: '167, 139, 250' }, // Ethereal Quantum Violet
    ];

    const initStars = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? 120 : 220;
      stars = [];

      for (let i = 0; i < count; i++) {
        // Distribute layers:
        // ~70% micro distant stars
        // ~20% medium glowing stars
        // ~10% bright Nova stars with 4-point cross diffraction spikes
        const rand = Math.random();
        let layer = 1;
        let size = Math.random() * 0.9 + 0.6;
        let baseAlpha = Math.random() * 0.5 + 0.25;
        let spikeLength: number | undefined;

        if (rand > 0.9) {
          // Nova stars with cross flares
          layer = 3;
          size = Math.random() * 1.6 + 1.8;
          baseAlpha = Math.random() * 0.3 + 0.7;
          spikeLength = size * (Math.random() * 4 + 6);
        } else if (rand > 0.68) {
          // Medium luminous glowing stars
          layer = 2;
          size = Math.random() * 1.2 + 1.2;
          baseAlpha = Math.random() * 0.4 + 0.5;
        }

        const palette = starPalettes[Math.floor(Math.random() * starPalettes.length)];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          color: palette.color,
          rgb: palette.rgb,
          spikeLength,
        });
      }
    };

    const spawnShootingStar = () => {
      if (prefersReducedMotion) return;
      const startX = Math.random() * width * 0.85;
      const startY = Math.random() * (height * 0.45);
      const angle = (Math.PI / 180) * (30 + Math.random() * 20); // 30 - 50 degrees downwards
      const speed = Math.random() * 8 + 12;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 70,
        speed,
        angle,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 35 + 40,
        width: Math.random() * 1.2 + 1.2,
      });
    };

    const resize = () => {
      const parent = canvas.parentElement || document.body;
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initStars(width, height);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Mouse smoothing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render ambient celestial gradient base
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + mouseX * 2,
        height * 0.25 + mouseY * 2,
        0,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, 'rgba(6, 18, 38, 0.45)');
      bgGrad.addColorStop(0.4, 'rgba(4, 11, 24, 0.65)');
      bgGrad.addColorStop(1, 'rgba(2, 4, 9, 0.85)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan atmospheric nebular dust spot
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.8 - mouseX,
        height * 0.15 - mouseY,
        0,
        width * 0.8,
        height * 0.15,
        width * 0.45
      );
      nebulaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      nebulaGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Render each star
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          // Sinusoidal pulse
          const sine = Math.sin(star.twinklePhase);
          star.alpha = Math.max(0.1, star.baseAlpha + sine * 0.35);
        }

        // Multilayer parallax offset
        const parallaxFactor = star.layer === 3 ? 0.04 : star.layer === 2 ? 0.025 : 0.012;
        const scrollFactor = star.layer === 3 ? 0.03 : star.layer === 2 ? 0.018 : 0.008;

        const posX = (star.x + mouseX * parallaxFactor * 10 + width) % width;
        const posY = ((star.y - (scrollY * scrollFactor)) % height + height) % height;

        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, star.alpha));

        // 1. Core star dot
        ctx.beginPath();
        ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = `rgba(${star.rgb}, 0.8)`;
        ctx.shadowBlur = star.layer === 3 ? 12 : star.layer === 2 ? 6 : 2;
        ctx.fill();

        // 2. Glowing Halo for luminous and nova stars
        if (star.layer >= 2) {
          const haloRadius = star.size * (star.layer === 3 ? 4.5 : 3);
          const halo = ctx.createRadialGradient(posX, posY, 0, posX, posY, haloRadius);
          halo.addColorStop(0, `rgba(${star.rgb}, 0.5)`);
          halo.addColorStop(0.4, `rgba(${star.rgb}, 0.15)`);
          halo.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(posX, posY, haloRadius, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.shadowBlur = 0;
          ctx.fill();
        }

        // 3. Four-point optical diffraction spikes / diamond flare on Nova stars
        if (star.layer === 3 && star.spikeLength) {
          const flareLen = star.spikeLength * (0.85 + Math.sin(star.twinklePhase * 1.5) * 0.25);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${star.rgb}, ${Math.min(0.85, star.alpha * 0.9)})`;
          ctx.shadowColor = `rgba(${star.rgb}, 0.9)`;
          ctx.shadowBlur = 8;

          ctx.beginPath();
          // Horizontal diffraction ray
          ctx.moveTo(posX - flareLen, posY);
          ctx.lineTo(posX + flareLen, posY);
          // Vertical diffraction ray
          ctx.moveTo(posX, posY - flareLen);
          ctx.lineTo(posX, posY + flareLen);
          ctx.stroke();

          // Diamond sparkle center
          const diamondSize = star.size * 1.3;
          ctx.beginPath();
          ctx.moveTo(posX, posY - diamondSize);
          ctx.lineTo(posX + diamondSize, posY);
          ctx.lineTo(posX, posY + diamondSize);
          ctx.lineTo(posX - diamondSize, posY);
          ctx.closePath();
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        ctx.restore();
      }

      // Check shooting star spawn
      const now = Date.now();
      if (!prefersReducedMotion && now - lastShootingStarTime > 5000 + Math.random() * 4000) {
        spawnShootingStar();
        lastShootingStarTime = now;
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life += 1;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;

        const progress = ss.life / ss.maxLife;
        // Fade in rapidly, then fade out
        if (progress < 0.2) {
          ss.opacity = progress / 0.2;
        } else {
          ss.opacity = 1 - (progress - 0.2) / 0.8;
        }

        if (ss.life >= ss.maxLife || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, ss.opacity));

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
        grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Luminous comet head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
