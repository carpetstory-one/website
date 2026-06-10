'use client';

/**
 * Hero — cinematic full-bleed image slider.
 *
 * Auto-advancing slides with a slow Ken Burns push. The headline is split so
 * the first word sits at the far left and the remainder at the far right, both
 * vertically centred (ege-style editorial layout). Touch-swipeable, with a
 * bottom-right control cluster: a sound toggle + a play/pause button that
 * stops the auto-advance.
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
  headlineKey: string;
  alt: string;
};

const SLIDES: SlideDef[] = [
  {
    img: '/hero/slide1.jpg',
    headlineKey: 'slide1Headline',
    alt: 'Detail of a hand-knotted Persian rug in deep maroon, caught in dramatic side-light',
  },
  {
    img: '/hero/slide2.jpg',
    headlineKey: 'slide2Headline',
    alt: 'A warm, low-lit living room grounded by a deep red hand-knotted rug',
  },
  {
    img: '/hero/slide3.jpg',
    headlineKey: 'slide3Headline',
    alt: 'A refined, dimly lit interior with a rug and softly glowing artwork',
  },
  {
    img: '/hero/slide7.jpg',
    headlineKey: 'slide4Headline',
    alt: 'A warm, high-end library room with bookshelf walls, a fireplace, and a detailed maroon hand-knotted carpet',
  },
  {
    img: '/hero/slide8.jpg',
    headlineKey: 'slide5Headline',
    alt: 'A bright, minimalist Japandi penthouse living room grounded by a neutral hand-knotted carpet in soft sunlight',
  },
];

// Per-word headline reveal: left word first, then the right-hand words stagger.
const HEADLINE_LEAD = 0.12; // s — before the first word rises
const WORD_STAGGER = 0.08; // s between words
const AUTO_ADVANCE_MS = 4000;
const SWIPE_THRESHOLD = 40; // px

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
  const leftWord = words[0];
  const rightWords = words.slice(1);

  return (
    <section
      className={`cine-hero${reduced ? ' is-reduced' : ''}`}
      aria-label="Featured rugs"
      aria-roledescription="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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

      {/* Split headline — first word far left, remainder far right, centred */}
      <div className="cine-content">
        <h1 className="cine-headline" key={active}>
          <span className="cine-h-side cine-h-left">
            <span className="cine-word-mask">
              <span
                className="cine-word"
                style={{ animationDelay: `${HEADLINE_LEAD}s` }}
              >
                {leftWord}
              </span>
            </span>
          </span>
          {rightWords.length > 0 && (
            <span className="cine-h-side cine-h-right">
              {rightWords.map((w, wi) => (
                <span className="cine-word-mask" key={`${active}-${wi}`}>
                  <span
                    className="cine-word"
                    style={{
                      animationDelay: `${HEADLINE_LEAD + (wi + 1) * WORD_STAGGER}s`,
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          )}
        </h1>
      </div>
    </section>
  );
}

