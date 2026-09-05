import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type VisualStyle = 'cyber' | 'quantum' | 'nebula';

interface ThreeCanvasProps {
  visualStyle?: VisualStyle;
  onStyleChange?: (style: VisualStyle) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  visualStyle = 'cyber',
  onStyleChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animFrameId = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scrollRef = useRef<number>(0);
  const [currentStyle, setCurrentStyle] = useState<VisualStyle>(visualStyle);
  const [isInteracting, setIsInteracting] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Sync external prop if changed
  useEffect(() => {
    setCurrentStyle(visualStyle);
  }, [visualStyle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const isMobile = window.innerWidth < 768;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // 3. Renderer setup (optimized pixel ratio)
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Create 3D Objects based on visual style
    const group = new THREE.Group();
    scene.add(group);

    // Style colors
    let primaryColor = 0x06b6d4; // Cyan
    let secondaryColor = 0x3b82f6; // Blue
    let particleColor = 0x38bdf8; // Sky

    if (currentStyle === 'quantum') {
      primaryColor = 0x8b5cf6; // Violet
      secondaryColor = 0xec4899; // Pink
      particleColor = 0xa855f7;
    } else if (currentStyle === 'nebula') {
      primaryColor = 0x10b981; // Emerald
      secondaryColor = 0x06b6d4; // Cyan
      particleColor = 0x34d399;
    }

    // Main Torus Knot / Cyber Geometry
    const knotGeometry = new THREE.TorusKnotGeometry(1.8, 0.45, isMobile ? 80 : 128, isMobile ? 24 : 32, 2, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, wireframeMaterial);
    group.add(knotMesh);

    // Inner Glowing Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.1, isMobile ? 1 : 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(coreMesh);

    // Ambient floating particle field (optimized particle count for mobile)
    const particleCount = isMobile ? 240 : 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: isMobile ? 0.05 : 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Orbiting cyber rings
    const ringGeo = new THREE.RingGeometry(2.7, 2.75, isMobile ? 40 : 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColor, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(secondaryColor, 2, 20);
    pointLight2.position.set(-4, -3, -2);
    scene.add(pointLight2);

    // 5. Mouse Interaction & Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle touch
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.targetX = x * 0.5;
        mouseRef.current.targetY = y * 0.5;
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 6. Intersection Observer: Pause rendering when scrolled out of view to save massive CPU/GPU
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animFrameId.current) {
            clock.start();
            animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        animFrameId.current = null;
        return;
      }
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const scrollProgress = scrollRef.current;

      // Rotate group smoothly
      group.rotation.x = elapsedTime * 0.15 + mouseRef.current.y * 0.4 + scrollProgress * Math.PI;
      group.rotation.y = elapsedTime * 0.25 + mouseRef.current.x * 0.4 + scrollProgress * Math.PI * 0.5;
      group.rotation.z = Math.sin(elapsedTime * 0.1) * 0.1;

      // Pulse core mesh
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.06;
      coreMesh.scale.set(scale, scale, scale);

      // Rotate rings opposite direction
      ring1.rotation.z = -elapsedTime * 0.2;
      ring2.rotation.z = elapsedTime * 0.15;

      // Rotate particle cloud gently
      particles.rotation.y = -elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      // Camera subtle position sway based on scroll
      camera.position.y = -scrollProgress * 2;
      camera.position.z = 8 + scrollProgress * 1.5;
      camera.lookAt(0, -scrollProgress * 1.2, 0);

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      knotGeometry.dispose();
      wireframeMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentStyle]);

  const switchStyle = (style: VisualStyle) => {
    setCurrentStyle(style);
    onStyleChange?.(style);
  };

  if (!webGlSupported) {
    return (
      <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Three.js Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
        onMouseDown={() => setIsInteracting(true)}
        onMouseUp={() => setIsInteracting(false)}
      />

      {/* Floating 3D Scene Controls */}
      <div className="absolute top-28 right-6 z-20 pointer-events-auto hidden md:flex flex-col items-end gap-2 text-xs">
        <div className="glass-panel px-3 py-2 rounded-xl flex items-center gap-2 border border-cyan-500/20 shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest">
            3D Engine: Active
          </span>
        </div>

        <div className="glass-panel p-1.5 rounded-lg flex items-center gap-1 border border-white/10">
          <button
            id="style-cyber-btn"
            onClick={() => switchStyle('cyber')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
              currentStyle === 'cyber'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CYBER
          </button>
          <button
            id="style-quantum-btn"
            onClick={() => switchStyle('quantum')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
              currentStyle === 'quantum'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            QUANTUM
          </button>
          <button
            id="style-nebula-btn"
            onClick={() => switchStyle('nebula')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
              currentStyle === 'nebula'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NEBULA
          </button>
        </div>
      </div>
    </div>
  );
};
