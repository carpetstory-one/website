'use client';

/**
 * Hero — cinematic full-bleed image slider.
 *
 * Auto-advancing slides with a slow Ken Burns push and a per-word headline
 * reveal. Now also touch-swipeable with manual indicators + prev/next controls
 * (mobile-first: the left "consultation" strip is hidden under 768px so it
 * never crowds the headline; controls shrink and reposition — see editorial.css
 * `.cine-*` media queries).
 *
 * Performance: only opacity / transform / clip animate. prefers-reduced-motion
 * => static first slide, no Ken Burns, no auto-advance — but the manual
 * controls still work.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { blurDataURL } from '@/lib/blur';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type SlideDef = {
  img: string;
  eyebrowKey: string;
  headlineKey: string;
  alt: string;
};

const SLIDES: SlideDef[] = [
  {
    img: '/hero/slide1.jpg',
    eyebrowKey: 'slide1Eyebrow',
    headlineKey: 'slide1Headline',
    alt: 'Detail of a hand-knotted Persian rug in deep maroon, caught in dramatic side-light',
  },
  {
    img: '/hero/slide2.jpg',
    eyebrowKey: 'slide2Eyebrow',
    headlineKey: 'slide2Headline',
    alt: 'A warm, low-lit living room grounded by a deep red hand-knotted rug',
  },
  {
    img: '/hero/slide3.jpg',
    eyebrowKey: 'slide3Eyebrow',
    headlineKey: 'slide3Headline',
    alt: 'A refined, dimly lit interior with a rug and softly glowing artwork',
  },
  {
    img: '/hero/slide4.jpg',
    eyebrowKey: 'slide4Eyebrow',
    headlineKey: 'slide4Headline',
    alt: 'A warm, high-end library room with bookshelf walls, a fireplace, and a detailed maroon hand-knotted carpet',
  },
  {
    img: '/hero/slide5.jpg',
    eyebrowKey: 'slide5Eyebrow',
    headlineKey: 'slide5Headline',
    alt: 'A bright, minimalist Japandi penthouse living room grounded by a neutral hand-knotted carpet in soft sunlight',
  },
];

// Per-word headline reveal: eyebrow first, then words stagger, then the button.
const HEADLINE_LEAD = 0.35; // s — eyebrow has settled
const WORD_STAGGER = 0.08; // s between words
const AUTO_ADVANCE_MS = 4000;
const SWIPE_THRESHOLD = 40; // px

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'prev' ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

export function Hero() {
  const t = useTranslations('Hero');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = SLIDES.length;
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setActive(((next % count) + count) % count),
    [count]
  );

  // Auto-advance loop. Re-created whenever `active` changes so a manual
  // interaction restarts the dwell rather than firing immediately after.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % count),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(id);
  }, [count, reduced, active]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(active + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const slide = SLIDES[active];
  const words = t(slide.headlineKey).split(' ');
  const ctaDelay = HEADLINE_LEAD + words.length * WORD_STAGGER + 0.35;

  return (
    <section
      className={`cine-hero${reduced ? 'is-reduced' : ''}`}
      aria-label={t('cta')}
      aria-roledescription="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide stack */}
      <div className="cine-slides">
        {SLIDES.map((s, i) => (
          <div
            key={s.img}
            className={`cine-slide${active === i ? 'is-active' : ''}`}
            aria-hidden={active !== i}
          >
            <div className="cine-ken">
              <Image
                src={s.img}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={blurDataURL('#160c0b')}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
        <div className="cine-veil" aria-hidden="true" />
      </div>

      {/* Left edge — free consultation strip (hidden < 768px in CSS) */}
      <div className="cine-side" aria-hidden="true">
        <span className="cine-side-icon">
          <PhoneIcon />
        </span>
        <span className="cine-side-text">
          {t('consultation')} · {t('phone')}
        </span>
      </div>

      {/* Centered text stack — remounts per slide to replay the reveal */}
      <div className="cine-content">
        <div className="cine-content-inner" key={active}>
          <span className="cine-eyebrow">{t(slide.eyebrowKey)}</span>
          <h1 className="cine-headline">
            {words.map((w, wi) => (
              <span className="cine-word-mask" key={`${active}-${wi}`}>
                <span
                  className="cine-word"
                  style={{
                    animationDelay: `${HEADLINE_LEAD + wi * WORD_STAGGER}s`,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <a
            href="#collection"
            className="cine-cta"
            style={{ animationDelay: `${ctaDelay}s` }}
          >
            {t('cta')}
          </a>
        </div>
      </div>

      {/* Slide indicators (right-middle) */}
      <div className="cine-indicators" role="tablist" aria-label={t('cta')}>
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`${t('goToSlide')} ${i + 1}`}
            className={`cine-dot${active === i ? 'is-active' : ''}`}
            onClick={() => go(i)}
          >
            <span className="cine-dot-num">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="cine-dot-track">
              <span
                className={`cine-dot-fill${active === i ? 'is-full' : ''}`}
              />
            </span>
          </button>
        ))}
      </div>

      {/* Prev / next controls (bottom-right) */}
      <div className="cine-controls">
        <button
          type="button"
          className="cine-arrow"
          aria-label={t('prev')}
          onClick={() => go(active - 1)}
        >
          <Arrow dir="prev" />
        </button>
        <button
          type="button"
          className="cine-arrow"
          aria-label={t('next')}
          onClick={() => go(active + 1)}
        >
          <Arrow dir="next" />
        </button>
      </div>
    </section>
  );
}
