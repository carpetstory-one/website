'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CountUp } from './CountUp';

const COLS = 80;
const ROWS = 40;
const TOTAL_DOTS = COLS * ROWS;

function hexToRgb(hex: string): string {
  const rgbFallback = '110, 31, 35';
  if (!hex) return rgbFallback;
  const clean = hex.trim();
  if (!clean.startsWith('#')) {
    const match = clean.match(/\d+,\s*\d+,\s*\d+/);
    return match ? match[0] : rgbFallback;
  }
  try {
    const sanitized = clean.replace('#', '');
    if (sanitized.length === 3) {
      const r = parseInt(sanitized[0] + sanitized[0], 16);
      const g = parseInt(sanitized[1] + sanitized[1], 16);
      const b = parseInt(sanitized[2] + sanitized[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    const r = parseInt(sanitized.substring(0, 2), 16);
    const g = parseInt(sanitized.substring(2, 4), 16);
    const b = parseInt(sanitized.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  } catch {
    return rgbFallback;
  }
}

function AnimatedDotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dpr = window.devicePixelRatio || 1;
    let dotSize = 4;
    let gap = 3;
    let width = 557;
    let height = 277;
    let accentColor = '#6e1f23';
    let accentRgb = '110, 31, 35';

    const updateDimensions = () => {
      const style = getComputedStyle(el);
      dotSize = parseFloat(style.getPropertyValue('--dot-size')) || 4;
      gap = parseFloat(style.getPropertyValue('--grid-gap')) || 3;
      accentColor = style.getPropertyValue('--accent').trim() || '#6e1f23';
      accentRgb = hexToRgb(accentColor);
      width = COLS * dotSize + (COLS - 1) * gap;
      height = ROWS * dotSize + (ROWS - 1) * gap;

      dpr = window.devicePixelRatio || 1;
      el.width = width * dpr;
      el.height = height * dpr;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;

      const ctx = el.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
        ctx.scale(dpr, dpr);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    let startTimestamp: number | null = null;
    let animationFrameId: number;
    let animating = false;

    const drawFinalState = () => {
      const ctx = el.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${accentRgb}, 0.75)`;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = c * (dotSize + gap) + dotSize / 2;
          const y = r * (dotSize + gap) + dotSize / 2;
          ctx.beginPath();
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const ctx = el.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const delay = ((r + c) / (ROWS + COLS)) * 800;
          let opacity = 0;
          if (elapsed >= delay) {
            const transitionTime = 150;
            opacity = Math.min(0.75, ((elapsed - delay) / transitionTime) * 0.75);
          }
          if (opacity > 0) {
            const x = c * (dotSize + gap) + dotSize / 2;
            const y = r * (dotSize + gap) + dotSize / 2;
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRgb}, ${opacity})`;
            ctx.fill();
          }
        }
      }

      if (elapsed < 800 + 150) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animating = false;
        drawFinalState();
      }
    };

    const startAnimation = () => {
      if (animating) return;
      animating = true;
      startTimestamp = null;
      animationFrameId = requestAnimationFrame(animate);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="knot-dot-grid"
      aria-hidden="true"
      style={{
        display: 'block',
        maxWidth: '100%',
      }}
    />
  );
}

export function KnotCount() {
  const t = useTranslations('Knot');

  return (
    <section className="knot-section knot-single" aria-labelledby="knot-heading">
      <div
        className="knot-container"
        style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}
      >
        <span
          className="label"
          style={{ display: 'block', marginBottom: '48px' }}
        >
          {t('label')}
        </span>

        <div className="knot-row">
          <div className="knot-number-col">
            <h2
              id="knot-heading"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(56px, 10vw, 120px)',
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                margin: '0 0 24px',
              }}
            >
              <CountUp target={1152000} duration={2500} />
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--ink)',
                marginBottom: '16px',
              }}
            >
              {t('rugSub')}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--ink-soft)',
                letterSpacing: '0.02em',
              }}
            >
              {t('finalUpTo')} <CountUp target={2257920} duration={2800} />{' '}
              {t('finalSuffix')}
            </p>
          </div>

          <div className="knot-grid-col">
            <AnimatedDotGrid />
          </div>
        </div>

        <div
          className="knot-foot"
          style={{
            marginTop: '64px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(26,24,23,0.12)',
            display: 'flex',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="label">{t('density')}</div>
            <div className="val" style={{ marginTop: '6px', fontSize: '16px' }}>
              {t('densityValue')}
            </div>
          </div>
          <div>
            <div className="label">{t('weaveTime')}</div>
            <div className="val" style={{ marginTop: '6px', fontSize: '16px' }}>
              {t('weaveTimeValue')}
            </div>
          </div>
          <div>
            <div className="label">{t('madeBy')}</div>
            <div className="val" style={{ marginTop: '6px', fontSize: '16px' }}>
              {t('madeByValue')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
