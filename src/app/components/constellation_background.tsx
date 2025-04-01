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
      // Base density: 1 particle per 8000 pixels
      const baseDensity = area / 8000;
      
      // Minimum and maximum particles based on screen size
      const minParticles = Math.min(35, Math.floor(baseDensity));
      const maxParticles = Math.min(90, Math.floor(baseDensity * 1.5));
      
      return Math.max(minParticles, Math.min(maxParticles, Math.floor(baseDensity)));
    };

    // Create particles with better distribution
    const createParticles = () => {
      const width = canvas.width;
      const height = canvas.height;
      const particleCount = calculateParticleCount(width, height);
      
      particlesRef.current = [];
      
      // Create grid for even distribution
      const cols = Math.ceil(Math.sqrt(particleCount));
      const rows = Math.ceil(particleCount / cols);
      const cellWidth = width / cols;
      const cellHeight = height / rows;

      for (let i = 0; i < particleCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Add some randomness within each cell
        const x = (col * cellWidth) + (Math.random() * cellWidth);
        const y = (row * cellHeight) + (Math.random() * cellHeight);
        
        // Scale velocity based on screen size
        const speedFactor = Math.min(width, height) / 1000;
        const velocity = 0.4 * speedFactor;

        particlesRef.current.push({
          x: Math.min(Math.max(x, 0), width),
          y: Math.min(Math.max(y, 0), height),
          vx: (Math.random() - 0.5) * velocity,
          vy: (Math.random() - 0.5) * velocity,
          size: Math.random() * 2 + 1, // Smaller particles for better resolution
          opacity: Math.random() * 0.3 + 0.2 // Adjusted opacity range
        });
      }
    };

    // Improved resize handler with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = customWidth ? window.innerWidth / 2 : window.innerWidth;
        const displayHeight = window.innerHeight;

        // Set canvas size with device pixel ratio for better resolution
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Scale context for retina displays
        ctx.scale(dpr, dpr);
        
        createParticles();
      }, 250);
    };

    // Animation loop with improved performance
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate connection distance based on canvas size
      const connectionDistance = Math.min(150, canvas.width / 8);

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Improved edge handling
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle with anti-aliasing
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections with improved performance
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

    // Initial setup (probably when fullscreen or when the page is loaded)
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup (whenever nodejs is resized, the animation is stopped and adjusts based on the new size)
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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