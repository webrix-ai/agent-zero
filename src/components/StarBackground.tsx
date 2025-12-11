'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }

      // Initialize shooting stars pool (more stars for a livelier effect)
      shootingStarsRef.current = [];
      for (let i = 0; i < 8; i++) {
        shootingStarsRef.current.push({
          x: 0,
          y: 0,
          length: 0,
          speed: 0,
          angle: 0,
          opacity: 0,
          active: false,
        });
      }
    };

    const spawnShootingStar = () => {
      const inactiveStar = shootingStarsRef.current.find(s => !s.active);
      if (!inactiveStar) return;

      inactiveStar.x = Math.random() * canvas.width * 0.8;
      inactiveStar.y = Math.random() * canvas.height * 0.3;
      inactiveStar.length = Math.random() * 80 + 40;
      inactiveStar.speed = Math.random() * 15 + 10;
      inactiveStar.angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15); // ~45 degrees with variation
      inactiveStar.opacity = 1;
      inactiveStar.active = true;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear fully for clean redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw and update stars
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;
        
        // EGA color palette stars - cyan, white, light blue
        const colors = ['#00AAAA', '#FFFFFF', '#5555FF', '#55FFFF'];
        const colorIndex = Math.floor(star.twinklePhase * 10) % colors.length;
        
        ctx.beginPath();
        ctx.fillStyle = colors[colorIndex];
        ctx.globalAlpha = currentOpacity;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Slow drift
        star.y += star.speed * 0.1;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw and update shooting stars
      shootingStarsRef.current.forEach(star => {
        if (!star.active) return;

        ctx.beginPath();
        ctx.strokeStyle = '#FFFF55'; // keen-yellow
        ctx.globalAlpha = star.opacity;
        ctx.lineWidth = 2;
        
        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;
        
        // Create gradient for tail effect
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, '#FFFF55');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw bright head
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = star.opacity;
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.01;

        // Deactivate if off screen or faded
        if (star.x > canvas.width || star.y > canvas.height || star.opacity <= 0) {
          star.active = false;
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Spawn shooting stars more frequently for a livelier space feel
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnShootingStar();
      }
    }, 800);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      clearInterval(shootingStarInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
