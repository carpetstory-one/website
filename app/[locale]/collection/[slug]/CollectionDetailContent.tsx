'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import type { Collection, Rug } from '@/lib/collections';
import { ShortlistToggleButton } from '@/components/shortlist/ShortlistToggleButton';
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

// Asymmetric rug grid — every 3rd card is larger
const rugSizes = ['medium', 'small', 'large'] as const;
type RugSize = typeof rugSizes[number];

const rugSizeStyle: Record<RugSize, React.CSSProperties> = {
  large:  { gridColumn: 'span 1', aspectRatio: '3/4' },
  medium: { gridColumn: 'span 1', aspectRatio: '4/5' },
  small:  { gridColumn: 'span 1', aspectRatio: '1/1' },
};

// ── Helpers for rug filter URL state ──────────────────────────────────────────

function parseRugFilter(raw: string | null, validSlugs: Set<string>): string[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => validSlugs.has(s))
    )
  );
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((x) => set.has(x));
}

/** Read the ?rugs= param directly from the browser URL (SSR-safe — returns [] on server). */
function readRugsFromUrl(validSlugs: Set<string>): string[] {
  if (typeof window === 'undefined') return [];
  return parseRugFilter(
    new URLSearchParams(window.location.search).get('rugs'),
    validSlugs,
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function CollectionDetailContent({
  col,
  locale,
  others,
}: {
  col: Collection;
  locale: string;
  others: Collection[];
}) {
  const validSlugs = useMemo(() => new Set(col.rugs.map((r) => r.slug)), [col.rugs]);

  // Start empty on server; hydrate from URL on mount (avoids useSearchParams
  // which forces the SSG page into dynamic rendering and breaks on Netlify).
  const [active, setActive] = useState<string[]>([]);

  // Hydrate on mount + listen for back/forward via popstate.
  useEffect(() => {
    setActive(readRugsFromUrl(validSlugs));

    const onPopState = () => {
      const fromUrl = readRugsFromUrl(validSlugs);
      setActive((prev) => (sameSet(prev, fromUrl) ? prev : fromUrl));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [validSlugs]);

  // Debounced shallow URL write (150ms, same as the collection index).
  const writeUrl = useRef(
    debounce((value: string) => replaceUrlParam('rugs', value || null), 150)
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
        ? col.rugs
        : col.rugs.filter((r) => active.includes(r.slug)),
    [active, col.rugs]
  );

  // Analytics event helper
  function trackView(eventName: string, props: Record<string, string>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, props);
    }
  }

  // Fire collection_viewed on mount
  React.useEffect(() => {
    trackView('collection_viewed', { collection_slug: col.slug });
  }, [col.slug]);

  return (
    <>
      {/* ── Description block ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '72px 24px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
        className="coll-desc-grid"
      >
        {/* Left: name + description */}
        <motion.div
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
              marginBottom: '18px',
            }}
          >
            {col.name}
          </span>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '46ch' }}>
            {col.description}
          </p>
        </motion.div>

        {/* Right: meta strip */}
        {col.meta && (
          <motion.dl
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '28px',
              borderLeft: '1px solid var(--ink-faint)',
              paddingLeft: '48px',
            }}
          >
            {col.meta.origin && (
              <div>
                <dt style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '6px' }}>Origin</dt>
                <dd style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500 }}>{col.meta.origin}</dd>
              </div>
            )}
            {col.meta.materials && (
              <div>
                <dt style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '6px' }}>Materials</dt>
                <dd style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500 }}>{col.meta.materials}</dd>
              </div>
            )}
            {col.meta.knotDensity && (
              <div>
                <dt style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '6px' }}>Knot Density</dt>
                <dd style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500 }}>{col.meta.knotDensity}</dd>
              </div>
            )}
            {col.meta.leadTime && (
              <div>
                <dt style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '6px' }}>Lead Time</dt>
                <dd style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 500 }}>{col.meta.leadTime}</dd>
              </div>
            )}
          </motion.dl>
        )}
      </div>

      {/* ── Rugs grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          style={{ marginBottom: '24px' }}
        >
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
            }}
          >
            Pieces in this collection
          </span>
        </motion.div>

        {/* ── Rug filter chips ────────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Filter pieces"
          className={
            'mb-8 flex gap-2 pb-1 ' +
            (col.rugs.length > 6
              ? 'snap-x overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-start sm:overflow-visible'
              : 'flex-wrap justify-start')
          }
        >
          <RugFilterChip label="All" active={active.length === 0} onClick={selectAll} />
          {col.rugs.map((rug) => (
            <RugFilterChip
              key={rug.slug}
              label={rug.name}
              active={active.includes(rug.slug)}
              onClick={() => toggleChip(rug.slug)}
            />
          ))}
        </div>

        {/* Grid / empty state */}
        {visible.length === 0 ? (
          <div className="text-center py-20" role="status">
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
              No pieces match this filter.
            </p>
            <button
              onClick={selectAll}
              className="mt-3 text-[12px] uppercase tracking-[0.16em] text-accent underline-offset-4 hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <motion.div layout="position" className="rug-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}>
            <AnimatePresence mode="popLayout">
              {visible.map((rug, vi) => {
                const globalIdx = col.rugs.indexOf(rug);
                const size = rugSizes[globalIdx % rugSizes.length] as RugSize;
                const sty = rugSizeStyle[size];

                return (
                  <motion.article
                    key={rug.slug}
                    style={{ position: 'relative' }}
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
                    <ShortlistToggleButton
                      collectionSlug={col.slug}
                      rugSlug={rug.slug}
                      rugName={`${col.name} ${rug.name}`}
                    />
                    <Link
                      href={`/collection/${col.slug}/${rug.slug}`}
                      className="group block"
                      onClick={() => trackView('rug_inquiry_initiated', { rug_slug: rug.slug, collection_slug: col.slug })}
                    >
                      <div
                        style={{
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'var(--canvas-muted, #f0ece3)',
                          marginBottom: '20px',
                          ...sty,
                        }}
                      >
                        <Image
                          src={rug.image}
                          alt={rug.name}
                          fill
                          loading={globalIdx < 3 ? 'eager' : 'lazy'}
                          fetchPriority={globalIdx < 3 ? 'high' : undefined}
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                          placeholder="blur"
                          blurDataURL={blurDataURL()}
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 1.2s ease',
                          }}
                          className="group-hover:scale-[1.04]"
                        />
                      </div>

                      <span
                        style={{
                          display: 'block',
                          fontSize: '11px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--ink-soft)',
                          marginBottom: '6px',
                        }}
                      >
                        {String(globalIdx + 1).padStart(2, '0')}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 300,
                          fontSize: '26px',
                          letterSpacing: '-0.01em',
                          color: 'var(--ink)',
                          marginBottom: '6px',
                        }}
                      >
                        {rug.name}
                      </h3>
                      {rug.description && (
                        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '10px', maxWidth: '34ch' }}>
                          {rug.description}
                        </p>
                      )}
                      {rug.price && (
                        <span style={{ fontSize: '13px', color: 'var(--ink-soft)', letterSpacing: '0.06em' }}>
                          {rug.price}
                        </span>
                      )}
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 64px',
          borderTop: '1px solid var(--ink-faint)',
          paddingTop: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <Link
          href="/inquiry"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 32px',
            background: 'var(--ink)',
            color: 'var(--canvas)',
            fontSize: '13px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Begin an inquiry →
        </Link>
      </div>

      {/* ── Other collections horizontal strip ────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--ink-faint)',
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              marginBottom: '28px',
            }}
          >
            Other collections
          </span>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
            }}
          >
            {others.slice(0, 11).map((other) => (
              <Link
                key={other.slug}
                href={`/collection/${other.slug}`}
                style={{ textDecoration: 'none', flexShrink: 0 }}
                onClick={() => trackView('collection_card_clicked', { collection_slug: other.slug, source: 'index' })}
              >
                <div
                  style={{
                    width: '200px',
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    marginBottom: '12px',
                  }}
                >
                  <Image
                    src={other.heroImage}
                    alt={other.name}
                    fill
                    loading="lazy"
                    sizes="200px"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--ink)',
                    marginBottom: '2px',
                  }}
                >
                  {other.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive style overrides */}
      <style>{`
        @media (max-width: 768px) {
          .coll-desc-grid { grid-template-columns: 1fr !important; }
          .rug-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .rug-grid { grid-template-columns: 1fr !important; }
        }
        .group-hover\\:scale-\\[1\\.04\\]:hover { transform: scale(1.04); }
      `}</style>
    </>
  );
}

// ── Rug filter chip (same styling as the collection index filter chips) ──────

function RugFilterChip({
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
