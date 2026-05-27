<script type="module">

// =============================================================
// FEATURE FLAGS
// =============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const isMobile = window.innerWidth < 768;

// =============================================================
// LENIS SMOOTH SCROLL — single rAF loop drives everything
// =============================================================
let lenis = null;
if (!prefersReducedMotion && window.Lenis) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // native touch on mobile feels better
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Hash-link smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      }
    });
  });
}

// Master RAF loop — Lenis + all scroll-driven effects piggyback here
const scrollSubs = []; // callbacks taking (scrollY)
function onScroll(cb) { scrollSubs.push(cb); }
function tick(time) {
  if (lenis) lenis.raf(time);
  const y = window.scrollY;
  for (let i = 0; i < scrollSubs.length; i++) scrollSubs[i](y);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// =============================================================
// CUSTOM CURSOR
// =============================================================
if (!isCoarsePointer && !prefersReducedMotion) {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function cursorLoop() {
    // ring lags behind by ~80ms feel
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // Hover state on interactive elements
  const hoverables = document.querySelectorAll('a, button, .link, .magnetic, input, textarea, select, .marquee-item, .piece, .door, .world-item');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
} else {
  document.body.style.cursor = 'auto';
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
}

// =============================================================
// MAGNETIC BUTTONS
// =============================================================
if (!isCoarsePointer && !prefersReducedMotion) {
  const magnets = document.querySelectorAll('.magnetic');
  const RADIUS = 80;
  const MAX_TRANSLATE = 6;

  document.addEventListener('mousemove', (e) => {
    magnets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const strength = (1 - dist / RADIUS);
        const tx = (dx / RADIUS) * MAX_TRANSLATE * strength * 1.5;
        const ty = (dy / RADIUS) * MAX_TRANSLATE * strength * 1.5;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
  });
}


// =============================================================
// THREAD CANVAS — interactive warp threads
// Light palette: paper background, faint ink threads, accent dot
// =============================================================
class ThreadCanvas {
  constructor(host) {
    this.host = host;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.host.appendChild(this.canvas);

    this.mouse = { x: -1000, y: -1000, lx: 0, ly: 0, sx: -1000, sy: -1000, v: 0, vs: 0, a: 0, set: false };
    this.lines = [];
    this.noiseTime = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.active = false;
    this.rafId = null;

    this.resize();
    this.setupLines();

    window.addEventListener('resize', () => { this.resize(); this.setupLines(); });
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
    // Mobile: skip
    if (isMobile) { this.lines = []; return; }

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

  onMouseMove(e) {
    const rect = this.host.getBoundingClientRect();
    // Only track if mouse is over (or near) the host
    if (e.clientY < rect.top - 100 || e.clientY > rect.bottom + 100) return;

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

  // Simple value noise — avoids needing simplex-noise CDN
  noise(x, y) {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  }
  // Smooth-ish 2D noise — sum of sines is enough for this aesthetic
  flowField(x, y, t) {
    return (
      Math.sin(x * 0.6 + t * 0.5) * 0.5 +
      Math.cos(y * 0.5 + t * 0.4) * 0.5 +
      Math.sin((x + y) * 0.3 + t * 0.3) * 0.3
    );
  }

  step(time) {
    if (!this.active) return;
    this.noiseTime = time * 0.0006;

    // Smooth mouse
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

    // Update points
    for (const points of this.lines) {
      for (const p of points) {
        const move = this.flowField((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002, this.noiseTime) * 8;
        p.wave.x = Math.cos(move) * 10;
        p.wave.y = Math.sin(move) * 5;

        const ddx = p.x - this.mouse.sx;
        const ddy = p.y - this.mouse.sy;
        const d = Math.hypot(ddx, ddy);
        const l = Math.max(175, this.mouse.vs);
        if (d < l) {
          const s = 1 - d / l;
          const f = Math.cos(d * 0.001) * s;
          p.cursor.vx += Math.cos(this.mouse.a) * f * l * this.mouse.vs * 0.00035;
          p.cursor.vy += Math.sin(this.mouse.a) * f * l * this.mouse.vs * 0.00035;
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

    // Render
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.strokeStyle = 'rgba(26, 24, 23, 0.16)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (const points of this.lines) {
      if (points.length < 2) continue;
      ctx.beginPath();
      const first = points[0];
      ctx.moveTo(first.x + first.wave.x, first.y + first.wave.y);
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        ctx.lineTo(p.x + p.wave.x + p.cursor.x, p.y + p.wave.y + p.cursor.y);
      }
      ctx.stroke();
    }

    // Accent dot at smoothed cursor
    if (this.mouse.set) {
      ctx.fillStyle = '#6E1F23';
      ctx.beginPath();
      ctx.arc(this.mouse.sx, this.mouse.sy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  start() { this.active = true; }
  stop()  { this.active = false; this.ctx.clearRect(0, 0, this.w, this.h); }
}

// Instantiate canvases (skip on mobile/reduced-motion)
const threadInstances = [];
if (!isMobile && !prefersReducedMotion) {
  document.querySelectorAll('[data-thread-host]').forEach(host => {
    const tc = new ThreadCanvas(host);
    threadInstances.push({ tc, host });
  });

  // IntersectionObserver — only run canvas when section visible
  const tcObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const inst = threadInstances.find(i => i.host === e.target || i.host.parentElement === e.target || e.target.contains(i.host));
      if (!inst) return;
      if (e.isIntersecting) inst.tc.start(); else inst.tc.stop();
    });
  }, { rootMargin: '100px' });
  threadInstances.forEach(inst => tcObs.observe(inst.host.parentElement));

  // Tick all active canvases via the master loop
  onScroll(() => {});
  let lastTime = 0;
  function threadLoop(time) {
    threadInstances.forEach(inst => inst.tc.step(time));
    requestAnimationFrame(threadLoop);
  }
  requestAnimationFrame(threadLoop);
}


// =============================================================
// NAV SCROLL STATE
// =============================================================
const navEl = document.getElementById('nav');
onScroll((y) => {
  if (y > 80) navEl.classList.add('scrolled');
  else navEl.classList.remove('scrolled');
});

// =============================================================
// REVEAL / SLIDE / WEAVE-IMG OBSERVERS
// =============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const slideObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); slideObs.unobserve(e.target); }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.slide-l, .slide-r, .slide-u, .slide-d').forEach(el => slideObs.observe(el));

const weaveObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); weaveObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.weave-img').forEach(el => weaveObs.observe(el));

// =============================================================
// HERO 2.2M COUNT-UP (formatted)
// =============================================================
function formatM(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return n.toLocaleString();
}
function animateCount(el, target, duration, format) {
  const start = performance.now();
  const startVal = 0;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = format ? format(val) : val.toLocaleString();
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = format ? format(target) : target.toLocaleString();
  }
  requestAnimationFrame(frame);
}

// Hero counter — fires on load
window.addEventListener('load', () => {
  const heroEl = document.getElementById('hero-knot-count');
  if (heroEl) {
    setTimeout(() => animateCount(heroEl, 2200000, 2500, formatM), 800);
  }
});

// Generic count-ups for knot section — fire on viewport entry
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.countup, 10);
      const duration = target > 2000000 ? 3000 : 1800;
      const glow = el.dataset.glow === 'true';
      animateCount(el, target, duration);
      if (glow) setTimeout(() => el.classList.add('glow'), duration - 100);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-countup]').forEach(el => countObs.observe(el));

// =============================================================
// DOT GRIDS — stagger reveals
// =============================================================
const dots100 = document.getElementById('dots-100');
if (dots100) {
  for (let i = 0; i < 100; i++) {
    const d = document.createElement('span');
    d.className = 'd';
    dots100.appendChild(d);
  }
}

const dotObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const stage = e.target;
      const dots = stage.querySelectorAll('.d');
      // Detect stage type for stagger pattern
      if (stage.classList.contains('knot-stage-2')) {
        // Row stagger left-to-right + shimmer
        dots.forEach((d, i) => {
          setTimeout(() => {
            d.classList.add('in');
            setTimeout(() => d.classList.add('shimmer'), 600);
          }, i * 60);
        });
      } else if (stage.classList.contains('knot-stage-3')) {
        // Diagonal sweep from top-left
        const cols = 10;
        dots.forEach((d, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          setTimeout(() => d.classList.add('in'), (row + col) * 35);
        });
      } else {
        dots.forEach((d, i) => setTimeout(() => d.classList.add('in'), i * 18));
      }
      dotObs.unobserve(stage);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.knot-stage').forEach(s => dotObs.observe(s));

// =============================================================
// MAKING-FRAME PARALLAX
// =============================================================
const makingPhs = document.querySelectorAll('.making-frame .ph');
onScroll(() => {
  makingPhs.forEach(ph => {
    const rect = ph.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const pct = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const shift = pct * -30;
      // Combine with weave-in: only apply scale/translate via inner pseudo wouldn't work, use the ph itself
      // but the weave-in uses clip-path so transform is free
      ph.style.transform = `translateY(${shift}px) scale(1.06)`;
    }
  });
});

// =============================================================
// HERO MOUSE PARALLAX + medallion cursor skew
// =============================================================
if (!prefersReducedMotion && !isCoarsePointer) {
  const hero = document.querySelector('.hero');
  const heroLayers = document.querySelectorAll('.hero .parallax-layer');
  const medallion = document.getElementById('hero-medallion');
  let mx = 0, my = 0, tx = 0, ty = 0;
  let mxNorm = 0, myNorm = 0;
  let raf = null;

  hero?.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mxNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    myNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(loop);
  });
  hero?.addEventListener('mouseleave', () => {
    mxNorm = 0; myNorm = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  });

  function loop() {
    tx += (mxNorm - tx) * 0.08;
    ty += (myNorm - ty) * 0.08;

    heroLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0;
      // Medallion gets an extra skew toward cursor
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
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  }
}

// =============================================================
// COLOR STORY SKEINS — scroll parallax
// =============================================================
if (!prefersReducedMotion) {
  const skeins = document.querySelectorAll('.parallax-scroll');
  const stage = document.getElementById('skeins-stage');
  onScroll(() => {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    skeins.forEach(skein => {
      const rate = parseFloat(skein.dataset.rate) || 0.2;
      const offset = (clamped - 0.5) * rate * 400;
      const drift = Math.sin(clamped * Math.PI * 1.2) * rate * 60;
      skein.style.transform = `translate(${drift}px, ${offset}px)`;
    });
  });
}

// =============================================================
// IMMERSIVE VIDEO — scroll-expand
// =============================================================
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
    let p = -rect.top / total;
    p = Math.max(0, Math.min(1, p));

    const sm = isMobile;
    const startW = 320;
    const startH = 440;
    const endW = sm ? window.innerWidth * 0.95 : Math.min(1500, window.innerWidth * 0.92);
    const endH = sm ? window.innerHeight * 0.7 : Math.min(820, window.innerHeight * 0.88);

    const w = startW + (endW - startW) * p;
    const h = startH + (endH - startH) * p;
    immFrame.style.setProperty('--frame-w', `${w}px`);
    immFrame.style.setProperty('--frame-h', `${h}px`);

    // Title splits — words translate outward as scroll progresses
    const split = p * (sm ? 30 : 22);
    if (immW1) immW1.style.transform = `translateX(-${split}vw)`;
    if (immW2) immW2.style.transform = `translateX(${split}vw)`;

    // BG fades as frame expands
    if (immBg) immBg.style.opacity = String(1 - p * 0.5);

    // Cue fades out once fully expanded
    if (immCue) immCue.style.opacity = String(Math.max(0, 1 - p * 1.6));
  });
}

// =============================================================
// TESTIMONIALS — populate three columns
// =============================================================
const testimonials = [
  { quote: "It arrived in a wooden crate that smelled of cedar. The rug smelled of wool and sun. Eight months later, both still do.", name: "Camille Bertin", role: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces" },
  { quote: "We have one Carpetstory in the dining room. Guests always sit on the floor.", name: "Studio Iro", role: "London, UK",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces" },
  { quote: "You don't buy a piece like this. You inherit it forward.", name: "Marcou & Vasilakis", role: "Athens, Greece",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces" },
  { quote: "I asked Aashrit for something the colour of late afternoon. What arrived was exactly that.", name: "Lila Hartwell", role: "Brooklyn, NY",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces" },
  { quote: "The pile is so dense your foot sinks a quarter inch. I notice it every morning.", name: "Quincy Architects", role: "Practice, NYC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces" },
  { quote: "Specified for a client in Geneva. They wrote a year later just to say the rug had aged better than the room around it.", name: "Henrik Vogel", role: "Architect, Zurich",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces" },
  { quote: "It looks like something you'd find in a museum and want to take home. We took it home.", name: "Anya Kapoor", role: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces" },
  { quote: "The corner curls slightly where the loom ended. I love that. A machine wouldn't have left that.", name: "Tom Halloran", role: "Private client, Dublin",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces" },
  { quote: "Eight months is a long time to wait for a floor. Forty years is a long time to keep one. We're betting on the second number.", name: "Studio Marais", role: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces" },
];

function buildColumn(items, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  // Render twice for seamless loop
  const html = [items, items].flat().map(t => `
    <div class="t-card">
      <div class="quote">"${t.quote}"</div>
      <div class="meta">
        <img class="avatar" src="${t.avatar}" alt="${t.name}" loading="lazy" onerror="this.style.background='var(--wool)'; this.style.opacity=0.7"/>
        <div class="who">
          <span class="name">${t.name}</span>
          <span class="role">${t.role}</span>
        </div>
      </div>
    </div>
  `).join('');
  mount.innerHTML = html;
}

buildColumn(testimonials.slice(0, 3), 't-col-a');
buildColumn(testimonials.slice(3, 6), 't-col-b');
buildColumn(testimonials.slice(6, 9), 't-col-c');

// =============================================================
// FOOTER THREADS — draw on scroll
// =============================================================
const footerThreads = document.getElementById('footer-threads');
if (footerThreads) {
  const fobs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); fobs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  fobs.observe(footerThreads);
}
</script>
