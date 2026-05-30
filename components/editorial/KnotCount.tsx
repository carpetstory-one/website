'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CountUp } from './CountUp';

const COLS = 40;
const ROWS = 40;
const TOTAL_DOTS = COLS * ROWS;

function AnimatedDotGrid() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="knot-dot-grid"
      aria-hidden="true"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: '3px',
        width: '100%',
        maxWidth: '280px',
      }}
    >
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            opacity: visible ? 0.75 : 0,
            transition: `opacity 0.15s ease ${(i / TOTAL_DOTS) * 2000}ms`,
          }}
        />
      ))}
    </div>
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
