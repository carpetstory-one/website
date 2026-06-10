'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

declare global {
  interface Window {
    __carpetstory_rebind?: () => void;
  }
}

export function GlobalAnimations() {
  const pathname = usePathname();

  /**
   * Re-bind dynamic DOM elements after every client-side navigation.
   * The main initAnimations() useEffect runs once and persists across routes
   * (the layout never unmounts), so freshly mounted hero counters, thread
   * canvases, and intersection observers would otherwise stay inert.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Wait one tick so the new route's DOM is mounted.
    const t = setTimeout(() => {
      window.__carpetstory_rebind?.();
    }, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    initAnimations();

    function initAnimations() {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isMobile = window.innerWidth < 768;

      let lenis: any = null;
      if (!prefersReducedMotion) {
        lenis = new Lenis({
          // lerp mode (not duration mode): each frame moves a fraction of the
          // remaining distance toward the target. This reacts to wheel input
          // immediately and settles quickly — smooth but fast/snappy — instead
          // of gliding to a stop over a fixed duration (the old "slow" feel).
          lerp: 0.10,
          smoothWheel: true,
          // Each wheel notch travels a touch further so the page covers ground
          // faster without losing smoothness.
          wheelMultiplier: 1.15,
          // syncTouch:false === smoothTouch:false — keep native momentum on
          // mobile, where smoothed touch scrolling feels worse than the OS.
          syncTouch: false,
          touchMultiplier: 2.0,
        });

        document.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id || id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: 0, duration: 0.9 });
            }
          });
        });
      }

      const scrollSubs: ((y: number) => void)[] = [];
      function onScroll(cb: (y: number) => void) {
        scrollSubs.push(cb);
      }
      let tickRaf: number | null = null;
      let lastY = -1;
      function tick(time: number) {
        if (lenis) lenis.raf(time);
        const y = window.scrollY;
        // Only run scroll subscribers when the position actually changed —
        // avoids per-frame layout reads while the page is idle.
        if (y !== lastY) {
          lastY = y;
          for (let i = 0; i < scrollSubs.length; i++) scrollSubs[i](y);
        }
        tickRaf = requestAnimationFrame(tick);
      }
      tickRaf = requestAnimationFrame(tick);

      // MAGNETIC BUTTONS — rAF-throttled so layout reads/writes happen at
      // most once per frame instead of on every mousemove event.
      if (!isCoarsePointer && !prefersReducedMotion) {
        const magnets = document.querySelectorAll('.magnetic');
        const RADIUS = 80;
        const MAX_TRANSLATE = 6;
        let mx = 0,
          my = 0;
        let magRaf: number | null = null;

        const applyMagnets = () => {
          magRaf = null;
          magnets.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const rect = htmlEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mx - cx;
            const dy = my - cy;
            const dist = Math.hypot(dx, dy);
            if (dist < RADIUS) {
              const strength = 1 - dist / RADIUS;
              const tx = (dx / RADIUS) * MAX_TRANSLATE * strength * 1.5;
              const ty = (dy / RADIUS) * MAX_TRANSLATE * strength * 1.5;
              htmlEl.style.transform = `translate(${tx}px, ${ty}px)`;
            } else {
              htmlEl.style.transform = 'translate(0, 0)';
            }
          });
        };

        document.addEventListener('mousemove', (e: MouseEvent) => {
          mx = e.clientX;
          my = e.clientY;
          if (!magRaf) magRaf = requestAnimationFrame(applyMagnets);
        });
      }

      // THREAD CANVAS
      class ThreadCanvas {
        host: HTMLElement;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        mouse: any;
        lines: any[];
        noiseTime: number;
        dpr: number;
        active: boolean;
        w: number = 0;
        h: number = 0;

        constructor(host: HTMLElement) {
          this.host = host;
          this.canvas = document.createElement('canvas');
          this.ctx = this.canvas.getContext('2d')!;
          this.host.appendChild(this.canvas);

          this.mouse = {
            x: -1000,
            y: -1000,
            lx: 0,
            ly: 0,
            sx: -1000,
            sy: -1000,
            v: 0,
            vs: 0,
            a: 0,
            set: false,
          };
          this.lines = [];
          this.noiseTime = 0;
          this.dpr = Math.min(window.devicePixelRatio || 1, 2);
          this.active = false;

          this.resize();
          this.setupLines();

          window.addEventListener('resize', () => {
            this.resize();
            this.setupLines();
          });
          window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        }

        resize() {
          const rect = this.host.getBoundingClientRect();
          this.w = rect.width;
          this.h = rect.height;
          this.canvas.width = this.w * this.dpr;
          this.canvas.height = this.h * this.dpr;
          this.canvas.style.width = this.w + 'px';
          this.canvas.style.height = this.h + 'px';
          this.ctx.scale(this.dpr, this.dpr);
        }

        setupLines() {
          if (isMobile) {
            this.lines = [];
            return;
          }
          const xGap = 22;
          const yGap = 22;
          const totalX = Math.ceil(this.w / xGap) + 2;
          const totalY = Math.ceil(this.h / yGap) + 2;
          const xStart = (this.w - xGap * (totalX - 1)) / 2;
          const yStart = (this.h - yGap * (totalY - 1)) / 2;

          this.lines = [];
          for (let i = 0; i < totalX; i++) {
            const points = [];
            for (let j = 0; j < totalY; j++) {
              points.push({
                x: xStart + xGap * i,
                y: yStart + yGap * j,
                wave: { x: 0, y: 0 },
                cursor: { x: 0, y: 0, vx: 0, vy: 0 },
              });
            }
            this.lines.push(points);
          }
        }

        onMouseMove(e: MouseEvent) {
          const rect = this.host.getBoundingClientRect();
          if (e.clientY < rect.top - 100 || e.clientY > rect.bottom + 100)
            return;

          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
          if (!this.mouse.set) {
            this.mouse.sx = this.mouse.x;
            this.mouse.sy = this.mouse.y;
            this.mouse.lx = this.mouse.x;
            this.mouse.ly = this.mouse.y;
            this.mouse.set = true;
          }
        }

        flowField(x: number, y: number, t: number) {
          return (
            Math.sin(x * 0.6 + t * 0.5) * 0.5 +
            Math.cos(y * 0.5 + t * 0.4) * 0.5 +
            Math.sin((x + y) * 0.3 + t * 0.3) * 0.3
          );
        }

        step(time: number) {
          if (!this.active) return;
          this.noiseTime = time * 0.0006;

          this.mouse.sx += (this.mouse.x - this.mouse.sx) * 0.1;
          this.mouse.sy += (this.mouse.y - this.mouse.sy) * 0.1;
          const dx = this.mouse.x - this.mouse.lx;
          const dy = this.mouse.y - this.mouse.ly;
          this.mouse.v = Math.hypot(dx, dy);
          this.mouse.vs += (this.mouse.v - this.mouse.vs) * 0.1;
          this.mouse.vs = Math.min(100, this.mouse.vs);
          this.mouse.lx = this.mouse.x;
          this.mouse.ly = this.mouse.y;
          this.mouse.a = Math.atan2(dy, dx);

          for (const points of this.lines) {
            for (const p of points) {
              const move =
                this.flowField(
                  (p.x + time * 0.008) * 0.003,
                  (p.y + time * 0.003) * 0.002,
                  this.noiseTime
                ) * 8;
              p.wave.x = Math.cos(move) * 10;
              p.wave.y = Math.sin(move) * 5;

              const ddx = p.x - this.mouse.sx;
              const ddy = p.y - this.mouse.sy;
              const d = Math.hypot(ddx, ddy);
              const l = Math.max(175, this.mouse.vs);
              if (d < l) {
                const s = 1 - d / l;
                const f = Math.cos(d * 0.001) * s;
                p.cursor.vx +=
                  Math.cos(this.mouse.a) * f * l * this.mouse.vs * 0.00035;
                p.cursor.vy +=
                  Math.sin(this.mouse.a) * f * l * this.mouse.vs * 0.00035;
              }
              p.cursor.vx += (0 - p.cursor.x) * 0.01;
              p.cursor.vy += (0 - p.cursor.y) * 0.01;
              p.cursor.vx *= 0.95;
              p.cursor.vy *= 0.95;
              p.cursor.x += p.cursor.vx;
              p.cursor.y += p.cursor.vy;
              p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
              p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
            }
          }

          const ctx = this.ctx;
          ctx.clearRect(0, 0, this.w, this.h);
          ctx.strokeStyle = 'rgba(26, 24, 23, 0.4)';
          ctx.lineWidth = 1;
          ctx.lineCap = 'round';

          for (const points of this.lines) {
            if (points.length < 2) continue;
            ctx.beginPath();
            const first = points[0];
            ctx.moveTo(first.x + first.wave.x, first.y + first.wave.y);
            for (let i = 1; i < points.length; i++) {
              const p = points[i];
              ctx.lineTo(
                p.x + p.wave.x + p.cursor.x,
                p.y + p.wave.y + p.cursor.y
              );
            }
            ctx.stroke();
          }

          if (this.mouse.set) {
            ctx.fillStyle = '#6E1F23';
            ctx.beginPath();
            ctx.arc(this.mouse.sx, this.mouse.sy, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        start() {
          this.active = true;
        }
        stop() {
          this.active = false;
          this.ctx.clearRect(0, 0, this.w, this.h);
        }
      }

      const threadInstances: { tc: ThreadCanvas; host: HTMLElement }[] = [];
      let threadRaf: number | null = null;
      let tcObs: IntersectionObserver | null = null;

      function bindThreadHosts() {
        if (isMobile || prefersReducedMotion) return;
        document.querySelectorAll('[data-thread-host]').forEach((el) => {
          const host = el as HTMLElement;
          if (threadInstances.some((i) => i.host === host)) return;
          // Skip if the host already has a child canvas (defensive).
          if (host.querySelector('canvas')) return;
          const tc = new ThreadCanvas(host);
          threadInstances.push({ tc, host });
          if (tcObs && host.parentElement) tcObs.observe(host.parentElement);
        });
      }

      if (!isMobile && !prefersReducedMotion) {
        tcObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const inst = threadInstances.find(
                (i) =>
                  i.host === e.target ||
                  i.host.parentElement === e.target ||
                  e.target.contains(i.host)
              );
              if (!inst) return;
              if (e.isIntersecting) inst.tc.start();
              else inst.tc.stop();
            });
          },
          { rootMargin: '100px' }
        );

        bindThreadHosts();

        function threadLoop(time: number) {
          threadInstances.forEach((inst) => inst.tc.step(time));
          threadRaf = requestAnimationFrame(threadLoop);
        }
        threadRaf = requestAnimationFrame(threadLoop);
      }

      // NAV SCROLL STATE is owned by the Nav component (React state), which
      // knows whether it's over the dark hero (home) vs. a light page.

      // REVEAL / SLIDE / WEAVE-IMG OBSERVERS
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              revealObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      document
        .querySelectorAll('.reveal')
        .forEach((el) => revealObs.observe(el));

      const slideObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              slideObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
      );
      document
        .querySelectorAll('.slide-l, .slide-r, .slide-u, .slide-d')
        .forEach((el) => slideObs.observe(el));

      const weaveObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              weaveObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      document
        .querySelectorAll('.weave-img-clip')
        .forEach((el) => weaveObs.observe(el));

      // COUNT-UPS
      function formatM(n: number) {
        if (n >= 1000000)
          return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        return n.toLocaleString();
      }
      function animateCount(
        el: HTMLElement,
        target: number,
        duration: number,
        format?: (n: number) => string
      ) {
        const start = performance.now();
        const startVal = 0;
        function frame(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.floor(startVal + (target - startVal) * eased);
          el.textContent = format ? format(val) : val.toLocaleString();
          if (t < 1) requestAnimationFrame(frame);
          else
            el.textContent = format ? format(target) : target.toLocaleString();
        }
        requestAnimationFrame(frame);
      }

      function startHeroCounter() {
        const heroEl = document.getElementById('hero-knot-count');
        if (heroEl && heroEl.dataset.counted !== '1') {
          heroEl.dataset.counted = '1';
          setTimeout(() => animateCount(heroEl, 2200000, 2500, formatM), 800);
        }
      }
      startHeroCounter();

      // Expose a rebind hook so the route-change effect can re-attach
      // dynamic visual elements (hero counter, thread canvas) when the
      // home page is revisited via SPA navigation.
      window.__carpetstory_rebind = () => {
        startHeroCounter();
        bindThreadHosts();
      };

      const countObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const el = e.target as HTMLElement;
              const target = parseInt(el.dataset.countup || '0', 10);
              const duration = target > 2000000 ? 3000 : 1800;
              const glow = el.dataset.glow === 'true';
              animateCount(el, target, duration);
              if (glow)
                setTimeout(() => el.classList.add('glow'), duration - 100);
              countObs.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );
      document
        .querySelectorAll('[data-countup]')
        .forEach((el) => countObs.observe(el));

      // DOT GRIDS
      const dots10 = document.getElementById('dots-10');
      if (dots10 && dots10.children.length === 0) {
        for (let i = 0; i < 10; i++) {
          const d = document.createElement('span');
          d.className = 'd';
          dots10.appendChild(d);
        }
      }

      const dots100 = document.getElementById('dots-100');
      if (dots100 && dots100.children.length === 0) {
        for (let i = 0; i < 100; i++) {
          const d = document.createElement('span');
          d.className = 'd';
          dots100.appendChild(d);
        }
      }

      const dots10k = document.getElementById('dots-10k');
      if (dots10k && dots10k.children.length === 0) {
        for (let i = 0; i < 400; i++) {
          const d = document.createElement('span');
          d.className = 'd';
          dots10k.appendChild(d);
        }
      }

      const dotObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const stage = e.target as HTMLElement;
              const dots = stage.querySelectorAll('.d');
              if (stage.classList.contains('knot-stage-1')) {
                // Single dot: appear + heartbeat is already in CSS
                dots.forEach((d, i) => {
                  setTimeout(() => {
                    d.classList.add('in');
                    setTimeout(() => d.classList.add('shimmer'), 400);
                  }, i * 60);
                });
              } else if (stage.classList.contains('knot-stage-2')) {
                // Row stagger left-to-right + shimmer
                dots.forEach((d, i) => {
                  setTimeout(() => {
                    d.classList.add('in');
                    setTimeout(() => d.classList.add('shimmer'), 600);
                  }, i * 60);
                });
              } else if (stage.classList.contains('knot-stage-3')) {
                // Diagonal sweep from top-left + cascading glow pulse
                const cols = 10;
                dots.forEach((d, i) => {
                  const row = Math.floor(i / cols);
                  const col = i % cols;
                  const delay = (row + col) * 35;
                  setTimeout(() => d.classList.add('in'), delay);
                  // After all dots appear, add a cascading glow pulse
                  setTimeout(() => d.classList.add('glow-pulse'), delay + 800);
                });
              } else {
                dots.forEach((d, i) =>
                  setTimeout(() => d.classList.add('in'), i * 18)
                );
              }
              dotObs.unobserve(stage);
            }
          });
        },
        { threshold: 0.25 }
      );
      document
        .querySelectorAll('.knot-stage')
        .forEach((s) => dotObs.observe(s));

      // MAKING-FRAME PARALLAX
      const makingPhs = document.querySelectorAll('.making-frame .ph');
      onScroll(() => {
        makingPhs.forEach((el) => {
          const ph = el as HTMLElement;
          const rect = ph.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const pct =
              (rect.top + rect.height / 2 - window.innerHeight / 2) /
              window.innerHeight;
            const shift = pct * -30;
            ph.style.transform = `translateY(${shift}px) scale(1.06)`;
          }
        });
      });

      // HERO MOUSE PARALLAX
      if (!prefersReducedMotion && !isCoarsePointer) {
        const hero = document.querySelector('.hero') as HTMLElement | null;
        const heroLayers = document.querySelectorAll('.hero .parallax-layer');
        const medallion = document.getElementById('hero-medallion');
        let tx = 0,
          ty = 0;
        let mxNorm = 0,
          myNorm = 0;
        let pRaf: number | null = null;

        hero?.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          mxNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          myNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          if (!pRaf) pRaf = requestAnimationFrame(pLoop);
        });
        hero?.addEventListener('mouseleave', () => {
          mxNorm = 0;
          myNorm = 0;
          if (!pRaf) pRaf = requestAnimationFrame(pLoop);
        });

        function pLoop() {
          tx += (mxNorm - tx) * 0.08;
          ty += (myNorm - ty) * 0.08;

          heroLayers.forEach((el) => {
            const layer = el as HTMLElement;
            const depth = parseFloat(layer.getAttribute('data-depth') || '0');
            if (layer === medallion) {
              const skewX = tx * 1.5;
              const skewY = ty * 1.5;
              const transX = tx * depth * 100;
              const transY = ty * depth * 100;
              layer.style.transform = `translate(${transX}px, ${transY}px) skew(${skewX}deg, ${skewY}deg)`;
            } else {
              layer.style.transform = `translate(${tx * depth * 100}px, ${ty * depth * 100}px)`;
            }
          });

          if (Math.abs(mxNorm - tx) > 0.001 || Math.abs(myNorm - ty) > 0.001) {
            pRaf = requestAnimationFrame(pLoop);
          } else {
            pRaf = null;
          }
        }
      }

      // COLOR STORY SKEINS
      if (!prefersReducedMotion) {
        const skeins = document.querySelectorAll('.parallax-scroll');
        const stage = document.getElementById('skeins-stage');
        onScroll(() => {
          if (!stage) return;
          const rect = stage.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
          const progress =
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);
          const clamped = Math.max(0, Math.min(1, progress));
          skeins.forEach((el) => {
            const skein = el as HTMLElement;
            const rate = parseFloat(skein.getAttribute('data-rate') || '0.2');
            const offset = (clamped - 0.5) * rate * 400;
            const drift = Math.sin(clamped * Math.PI * 1.2) * rate * 60;
            skein.style.transform = `translate(${drift}px, ${offset}px)`;
          });
        });
      }

      // IMMERSIVE VIDEO
      const immSection = document.getElementById('immersive');
      const immFrame = document.getElementById('immersive-frame');
      const immBg = document.getElementById('immersive-bg');
      const immW1 = document.getElementById('imm-word-1');
      const immW2 = document.getElementById('imm-word-2');
      const immCue = document.getElementById('imm-cue');

      if (immSection && immFrame) {
        onScroll(() => {
          const rect = immSection.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const triggerOffset = window.innerHeight * 0.25; // start zoom 25% earlier
          let p = (triggerOffset - rect.top) / (total + triggerOffset);
          p = Math.max(0, Math.min(1, p));

          const sm = isMobile;
          const startW = 320;
          const startH = 440;
          const endW = sm
            ? window.innerWidth * 0.95
            : Math.min(1500, window.innerWidth * 0.92);
          const endH = sm
            ? window.innerHeight * 0.7
            : Math.min(820, window.innerHeight * 0.88);

          const w = startW + (endW - startW) * p;
          const h = startH + (endH - startH) * p;
          immFrame.style.setProperty('--frame-w', `${w}px`);
          immFrame.style.setProperty('--frame-h', `${h}px`);

          const split = p * (sm ? 30 : 22);
          if (immW1) immW1.style.transform = `translateX(-${split}vw)`;
          if (immW2) immW2.style.transform = `translateX(${split}vw)`;
          if (immBg) immBg.style.opacity = String(1 - p * 0.5);
          if (immCue) immCue.style.opacity = String(Math.max(0, 1 - p * 1.6));
        });
      }

      // FOOTER THREADS
      const footerThreads = document.getElementById('footer-threads');
      if (footerThreads) {
        const fobs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('in');
                fobs.unobserve(e.target);
              }
            });
          },
          { threshold: 0.3 }
        );
        fobs.observe(footerThreads);
      }

      // Cleanup
      return () => {
        if (tickRaf) cancelAnimationFrame(tickRaf);
        if (threadRaf) cancelAnimationFrame(threadRaf);
        revealObs.disconnect();
        slideObs.disconnect();
        weaveObs.disconnect();
        countObs.disconnect();
        dotObs.disconnect();
        if (lenis) lenis.destroy();
      };
    }
  }, []);

  return <></>;
}
