'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * ThreadCanvas — Interactive warp threads for the Hero section.
 *
 * Simulates physical loom threads that react elastically when the cursor
 * passes through them.
 */
export function ThreadCanvas({ hostId }: { hostId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    // Thread configuration
    const THREAD_COUNT = Math.floor(window.innerWidth / 15);
    const THREAD_COLOR = 'rgba(26, 24, 23, 0.05)'; // Very faint ink
    const ELASTICITY = 0.05;
    const DAMPING = 0.9;
    const INFLUENCE_RADIUS = 100;

    class Thread {
      x: number;
      targetX: number;
      vx: number;

      constructor(x: number) {
        this.x = x;
        this.targetX = x;
        this.vx = 0;
      }

      update() {
        // Calculate distance from mouse
        const dx = mouse.x - this.targetX;
        const dy = mouse.y - height / 2; // Approximate Y influence
        const dist = Math.sqrt(dx * dx + Math.abs(dy) * 50); // Elongate influence area

        // Mouse interaction
        if (dist < INFLUENCE_RADIUS && Math.abs(mouse.vx) > 0.5) {
          const force = (INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS;
          this.vx += mouse.vx * force * 0.1;
        }

        // Spring physics
        const force = (this.targetX - this.x) * ELASTICITY;
        this.vx += force;
        this.vx *= DAMPING;
        this.x += this.vx;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.targetX, 0);
        // Curve to current X at middle
        ctx.quadraticCurveTo(this.x, height / 2, this.targetX, height);
        ctx.stroke();
      }
    }

    let threads: Thread[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Recreate threads on resize
      threads = [];
      const spacing = width / THREAD_COUNT;
      for (let i = 0; i < THREAD_COUNT; i++) {
        threads.push(new Thread(i * spacing));
      }
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = THREAD_COLOR;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - lastMouse.x;
      mouse.vy = e.clientY - lastMouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
    };
    
    // Decay mouse velocity when stopped
    const decayMouse = () => {
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      decayMouse();

      for (let i = 0; i < threads.length; i++) {
        threads[i].update();
        threads[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Observers to only animate when in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          init();
          window.addEventListener('resize', init);
          window.addEventListener('mousemove', handleMouseMove);
          animate();
        } else {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', init);
          window.removeEventListener('mousemove', handleMouseMove);
        }
      },
      { threshold: 0 }
    );

    // Assume parent sets data-thread-host
    const hostEl = document.querySelector(`[data-thread-host="${hostId}"]`);
    if (hostEl) observer.observe(hostEl);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion, isMobile, hostId]);

  if (prefersReducedMotion || isMobile) {
    return (
      <div 
        className="thread-canvas-wrap" 
        data-thread-host={hostId}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      />
    );
  }

  return (
    <div 
      className="thread-canvas-wrap" 
      data-thread-host={hostId}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}
