// Inspired by: https://slicker.me/javascript/particles.htm

"use client";
import { useEffect, useRef } from 'react';

interface ConstellationBackgroundProps {
  customWidth?: boolean;
}

const ConstellationBackground = ({ customWidth = false }: ConstellationBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate optimal number of particles based on screen size
    const calculateParticleCount = (width: number, height: number) => {
      const area = width * height;
      const baseDensity = area / 8000;
      const minParticles = Math.min(35, Math.floor(baseDensity));
      const maxParticles = Math.min(90, Math.floor(baseDensity * 1.5));
      return Math.max(minParticles, Math.min(maxParticles, Math.floor(baseDensity)));
    };

    const createParticles = (width: number, height: number) => {
      const particleCount = calculateParticleCount(width, height);
      particlesRef.current = [];
      
      const cols = Math.ceil(Math.sqrt(particleCount));
      const rows = Math.ceil(particleCount / cols);
      const cellWidth = width / cols;
      const cellHeight = height / rows;

      for (let i = 0; i < particleCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = (col * cellWidth) + (Math.random() * cellWidth);
        const y = (row * cellHeight) + (Math.random() * cellHeight);
        
        const speedFactor = Math.min(width, height) / 1000;
        const velocity = 0.4 * speedFactor;

        particlesRef.current.push({
          x: Math.min(Math.max(x, 0), width),
          y: Math.min(Math.max(y, 0), height),
          vx: (Math.random() - 0.5) * velocity,
          vy: (Math.random() - 0.5) * velocity,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.2
        });
      }
    };

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = customWidth ? window.innerWidth / 2 : window.innerWidth;
      const displayHeight = window.innerHeight;

      // Set the canvas size in pixels
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      // Set the display size
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // Scale the context
      ctx.scale(dpr, dpr);

      // Recreate particles with the new dimensions
      createParticles(displayWidth, displayHeight);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCanvasSize, 250);
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      const connectionDistance = Math.min(150, displayWidth / 8);

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary checking with the scaled dimensions
        if (particle.x <= 0 || particle.x >= displayWidth) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(displayWidth, particle.x));
        }
        if (particle.y <= 0 || particle.y >= displayHeight) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(displayHeight, particle.y));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = particlesRef.current.indexOf(particle) + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Add zoom change detection
    const mediaQuery = window.matchMedia('(resolution)');
    mediaQuery.addListener(handleResize);

    // Initial setup
    updateCanvasSize();
    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      mediaQuery.removeListener(handleResize);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [customWidth]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${customWidth ? 'w-full' : ''}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default ConstellationBackground; 