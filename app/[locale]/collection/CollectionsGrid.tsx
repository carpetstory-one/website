'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import { collections } from '@/lib/collections';
import { analytics } from '@/lib/analytics';
import { replaceUrlParam, debounce } from '@/lib/url';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const VALID_SLUGS = new Set(collections.map((c) => c.slug));
const ORDER = new Map(collections.map((c, i) => [c.slug, i]));

function parseFilter(raw: string | null): string[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => VALID_SLUGS.has(s))
    )
  );
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((x) => set.has(x));
}

export function CollectionsGrid() {
  const searchParams = useSearchParams();

  // Local state drives instant UI; the URL write is debounced (150ms) and
  // shallow (history.replaceState) so chip clicks never re-render the server
  // route or flood the back-button history.
  const [active, setActive] = useState<string[]>(() =>
    parseFilter(searchParams.get('filter'))
  );

  // Adopt URL changes coming from outside our own writes (back/forward).
  // Our debounced write resolves to the same value, so this is a no-op then.
  useEffect(() => {
    const fromUrl = parseFilter(searchParams.get('filter'));
    setActive((prev) => (sameSet(prev, fromUrl) ? prev : fromUrl));
  }, [searchParams]);

  const writeUrl = useRef(
    debounce((value: string) => replaceUrlParam('filter', value || null), 150)
  ).current;
  useEffect(() => () => writeUrl.cancel(), [writeUrl]);

  const setFilters = (next: string[]) => {
    setActive(next);
    writeUrl(next.join(','));
  };

  const toggleChip = (slug: string) => {
    const isActive = active.includes(slug);
    analytics.filterChipClicked(slug, isActive ? 'remove' : 'add');
    setFilters(isActive ? active.filter((s) => s !== slug) : [...active, slug]);
  };

  const selectAll = () => {
    if (active.length > 0) analytics.filterCleared(active.length);
    setFilters([]);
  };

  const visible = useMemo(
    () =>
      active.length === 0
        ? collections
        : collections.filter((c) => active.includes(c.slug)),
    [active]
  );

  const scrollable = collections.length > 6;

  return (
    <main className="flex-1 pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Page header */}
        <motion.header
          className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              marginBottom: '20px',
            }}
          >
            The Collections
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(40px, 6vw, 76px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: '22px',
            }}
          >
            Twelve houses. One workshop.
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: '38ch', margin: '0 auto' }}>
            From Persian archive patterns to Moroccan long pile, every collection is woven
            in Jaipur to the same standard of construction.
          </p>
        </motion.header>

        {/* Filter bar */}
        <div
          role="group"
          aria-label="Filter collections"
          className={
            'mb-10 flex gap-2 pb-1 ' +
            (scrollable
              ? 'snap-x overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible'
              : 'flex-wrap justify-center')
          }
        >
          <FilterChip label="All" active={active.length === 0} onClick={selectAll} />
          {collections.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
              active={active.includes(c.slug)}
              onClick={() => toggleChip(c.slug)}
            />
          ))}
        </div>

        {/* Grid / empty state */}
        {visible.length === 0 ? (
          <div className="text-center py-20" role="status">
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
              No collections match this filter.
            </p>
            <button
              onClick={selectAll}
              className="mt-3 text-[12px] uppercase tracking-[0.16em] text-accent underline-offset-4 hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <motion.div layout="position" className="col-grid">
            <AnimatePresence mode="popLayout">
              {visible.map((col, vi) => {
                const idx = ORDER.get(col.slug) ?? vi;
                const eyebrow = `${String(idx + 1).padStart(2, '0')} — ${col.name.toUpperCase()}`;
                const isEager = vi < 6;

                return (
                  <motion.article
                    key={col.slug}
                    id={`collection-card-${col.slug}`}
                    className="feat-card"
                    layout="position"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.35,
                      delay: (vi % 3) * 0.04,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <Link
                      href={`/collection/${col.slug}`}
                      aria-label={`${col.name} — ${col.tagline}`}
                      className="feat-link"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                          (window as any).gtag('event', 'collection_card_clicked', {
                            collection_slug: col.slug,
                            source: 'index',
                          });
                        }
                      }}
                    >
                      <div className="feat-img">
                        <Image
                          src={col.heroImage}
                          alt={`${col.name} collection — ${col.tagline}`}
                          fill
                          loading={isEager ? 'eager' : 'lazy'}
                          fetchPriority={vi < 3 ? 'high' : undefined}
                          sizes="(max-width: 560px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={blurDataURL()}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className="feat-scrim" aria-hidden="true" />

                      <div className="feat-caption">
                        <span className="feat-eyebrow">{eyebrow}</span>
                        <h2 className="feat-name">{col.name}</h2>
                        <p className="feat-tag">{col.tagline}</p>
                        <span className="feat-explore">Explore the collection →</span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        'shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 ' +
        (active
          ? 'border-accent bg-accent text-[var(--canvas)]'
          : 'border-ink bg-transparent text-ink hover:border-accent')
      }
    >
      {label}
    </button>
  );
}
