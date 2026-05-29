"use client";

/**
 * Hero — cinematic full-bleed image slider.
 *
 * Three auto-advancing slides with a slow Ken Burns push, a 1.2s cross-fade
 * (outgoing image scales back for depth), per-word headline reveal, and a
 * maroon progress fill on the active indicator.
 *
 * The dwell, the progress bar, and the auto-advance all run off ONE clock:
 * the progress fill's CSS animation. When it ends we advance; pausing (hover)
 * sets `animation-play-state: paused`, which freezes the bar AND defers the
 * `animationend` — so the bar and the timer can never drift apart.
 *
 * Performance: only opacity / transform / clip animate. All three images live
 * in the DOM from first paint (slide 1 is `priority` => preloaded high; 2 & 3
 * resolve right after). prefers-reduced-motion => static first slide, manual
 * controls only, no Ken Burns, no auto-advance (handled in CSS + the guard
 * around the animated fill).
 *
 * Image sources (Unsplash, free license):
 *   slide1 unsplash.com/photos/SutfL_rMKns
 *   slide2 unsplash.com/photos/o83AwSzOns4
 *   slide3 unsplash.com/photos/hlOpCML8twI
 */

import React, { useEffect, useState } from 'react';
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

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Hero() {
  const t = useTranslations('Hero');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = SLIDES.length;

  // Auto-advance loop every 4 seconds
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setActive((p) => (p + 1) % count);
    }, 4000);
    return () => clearInterval(interval);
  }, [count, reduced]);

  const slide = SLIDES[active];
  const words = t(slide.headlineKey).split(' ');
  const ctaDelay = HEADLINE_LEAD + words.length * WORD_STAGGER + 0.35;

  return (
    <section
      className={`cine-hero${reduced ? ' is-reduced' : ''}`}
      aria-label={t('cta')}
      aria-roledescription="carousel"
    >
      {/* Slide stack */}
      <div className="cine-slides">
        {SLIDES.map((s, i) => (
          <div
            key={s.img}
            className={`cine-slide${active === i ? ' is-active' : ''}`}
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

      {/* Left edge — free consultation strip */}
      <div className="cine-side" aria-hidden="true">
        <span className="cine-side-icon"><PhoneIcon /></span>
        <span className="cine-side-text">{t('consultation')} · {t('phone')}</span>
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
                  style={{ animationDelay: `${HEADLINE_LEAD + wi * WORD_STAGGER}s` }}
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
    </section>
  );
}
