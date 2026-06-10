'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import type { Collection } from '@/lib/collections';
import { ShortlistToggleButton } from '@/components/shortlist/ShortlistToggleButton';
import { RugFilters } from '@/components/rugs/RugFilters';
import { Pagination } from '@/components/rugs/Pagination';
import { debounce } from '@/lib/url';
import {
  emptyFilters,
  serializeFilters,
  type RugFilters as Filters,
  type FlatRug,
  type Material,
  type Make,
} from '@/lib/rugs';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

type Gtag = (
  type: 'event',
  event: string,
  params: Record<string, string>
) => void;

function track(event: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.('event', event, params);
}

type Facets = {
  bounds: { min: number; max: number };
  materials: Material[];
  makes: Make[];
  collectionOptions: Array<{ slug: string; name: string }>;
};

type Props = {
  col: Collection;
  locale: string;
  others: Collection[];
  /** The current page's rugs — filtered, sorted and sliced server-side. */
  pageRugs: FlatRug[];
  filters: Filters;
  page: number;
  totalPages: number;
  matchingTotal: number;
  facets: Facets;
};

export function CollectionDetailContent({
  col,
  others,
  pageRugs,
  filters: serverFilters,
  page,
  totalPages,
  matchingTotal,
  facets,
}: Props) {
  const tRugs = useTranslations('RugsPage');
  const tPiece = useTranslations('PiecePage');

  const router = useRouter();
  const pathname = usePathname(); // locale-less, e.g. "/collection/persian"
  const searchParams = useSearchParams();

  // Local mirror of the URL filters for instant sidebar feedback, re-synced
  // from the server (render-phase reset pattern, not an effect).
  const [filters, setFilters] = useState<Filters>(serverFilters);
  const serverKey = serializeFilters(serverFilters);
  const [syncedKey, setSyncedKey] = useState(serverKey);
  if (serverKey !== syncedKey) {
    setSyncedKey(serverKey);
    setFilters(serverFilters);
  }

  const buildHref = useCallback(
    (f: Filters, targetPage: number) => {
      const qs = new URLSearchParams(serializeFilters(f));
      const sl = searchParams.get('shortlist');
      if (sl) qs.set('shortlist', sl);
      if (targetPage > 1) qs.set('page', String(targetPage));
      const q = qs.toString();
      return q ? `${pathname}?${q}` : pathname;
    },
    [pathname, searchParams]
  );

  const hrefForPage = useCallback(
    (targetPage: number) => buildHref(serverFilters, targetPage),
    [buildHref, serverFilters]
  );

  // Filter changes reset to page 1; debounced replace() avoids history spam.
  const navigate = useMemo(
    () =>
      debounce((href: string) => {
        router.replace(href, { scroll: false });
      }, 150),
    [router]
  );
  useEffect(() => () => navigate.cancel(), [navigate]);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        navigate(buildHref(next, 1));
        return next;
      });
    },
    [navigate, buildHref]
  );

  const clearAll = useCallback(() => {
    const cleared = emptyFilters();
    setFilters(cleared);
    navigate(buildHref(cleared, 1));
  }, [navigate, buildHref]);

  // Analytics: fire collection_viewed on mount.
  useEffect(() => {
    track('collection_viewed', { collection_slug: col.slug });
  }, [col.slug]);

  const trackInquiry = (rugSlug: string) =>
    track('rug_inquiry_initiated', {
      rug_slug: rugSlug,
      collection_slug: col.slug,
    });

  const trackCollectionClick = (otherSlug: string) =>
    track('collection_card_clicked', {
      collection_slug: otherSlug,
      source: 'index',
    });

  // Stable "piece number" = the rug's index in the full collection catalogue.
  const indexInCollection = useMemo(() => {
    const map = new Map<string, number>();
    col.rugs.forEach((r, i) => map.set(r.slug, i));
    return map;
  }, [col.rugs]);

  return (
    <>
      {/* ── Description block ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '72px 24px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 2.2fr',
          gap: '64px',
          alignItems: 'start',
        }}
        className="coll-desc-grid"
      >
        {/* Left Column: Collection Name + Metadata Sidebar */}
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
              marginBottom: '20px',
            }}
          >
            {col.name}
          </span>

          {col.meta && (col.meta.origin || col.meta.materials || col.meta.knotDensity || col.meta.leadTime) && (
            <dl
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderTop: '1px solid var(--ink-faint)',
                paddingTop: '20px',
              }}
            >
              {col.meta.origin && (
                <div>
                  <dt
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      marginBottom: '4px',
                    }}
                  >
                    {tPiece('origin')}
                  </dt>
                  <dd
                    style={{
                      fontSize: '15px',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    {col.meta.origin}
                  </dd>
                </div>
              )}
              {col.meta.materials && (
                <div>
                  <dt
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      marginBottom: '4px',
                    }}
                  >
                    {tPiece('materials')}
                  </dt>
                  <dd
                    style={{
                      fontSize: '15px',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    {col.meta.materials}
                  </dd>
                </div>
              )}
              {col.meta.knotDensity && (
                <div>
                  <dt
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      marginBottom: '4px',
                    }}
                  >
                    {tPiece('density')}
                  </dt>
                  <dd
                    style={{
                      fontSize: '15px',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    {col.meta.knotDensity}
                  </dd>
                </div>
              )}
              {col.meta.leadTime && (
                <div>
                  <dt
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-soft)',
                      marginBottom: '4px',
                    }}
                  >
                    {tPiece('leadTime')}
                  </dt>
                  <dd
                    style={{
                      fontSize: '15px',
                      color: 'var(--ink)',
                      fontWeight: 500,
                    }}
                  >
                    {col.meta.leadTime}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </motion.div>

        {/* Right Column: Narrative Description */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.15}
        >
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--ink-soft)',
              maxWidth: '65ch',
            }}
          >
            {col.description}
          </p>
        </motion.div>
      </div>


      {/* ── Rugs grid (server-paginated) ──────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 40px',
        }}
      >
        <div className="rugx-layout">
          {/* Left Sidebar */}
          <aside className="rugx-sidebar">
            <div className="rugx-filterwrap mb-8">
              <RugFilters
                filters={filters}
                update={update}
                matchingCount={matchingTotal}
                onClearAll={clearAll}
                bounds={facets.bounds}
                materials={facets.materials}
                makes={facets.makes}
                hideFacets={['collection']}
                collectionOptions={facets.collectionOptions}
              />
            </div>
          </aside>

          {/* Main Content (Grid) */}
          <main className="rugx-main">
            {pageRugs.length === 0 ? (
              <div className="py-20 text-center" role="status">
                <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
                  {tRugs('noRugs')}
                </p>
                <button
                  onClick={clearAll}
                  className="text-accent mt-3 text-[12px] tracking-[0.16em] uppercase underline-offset-4 hover:underline"
                >
                  {tRugs('clearFilters')}
                </button>
              </div>
            ) : (
              <div
                className="rug-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '32px',
                }}
              >
                {pageRugs.map((rug, vi) => {
                  const globalIdx = indexInCollection.get(rug.rugSlug) ?? vi;
                  return (
                    <article key={rug.id} style={{ position: 'relative' }}>
                      <ShortlistToggleButton
                        collectionSlug={col.slug}
                        rugSlug={rug.rugSlug}
                        rugName={`${col.name} ${rug.name}`}
                      />
                      <Link
                        href={rug.href}
                        className="group block"
                        onClick={() => trackInquiry(rug.rugSlug)}
                      >
                        <div
                          className="coll-rug-frame"
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            background: '#ffffff',
                            marginBottom: '20px',
                            aspectRatio: '3 / 4',
                          }}
                        >
                          {rug.image ? (
                            <Image
                              src={rug.image}
                              alt={rug.name}
                              fill
                              loading={vi < 3 ? 'eager' : 'lazy'}
                              fetchPriority={vi < 3 ? 'high' : undefined}
                              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="coll-rug-img"
                            />
                          ) : null}
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
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Pagination sits full-width below the grid, where the products end. */}
      {pageRugs.length > 0 && (
        <Pagination page={page} totalPages={totalPages} hrefFor={hrefForPage} />
      )}



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
            {tRugs('otherCollections')}
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
                onClick={() => trackCollectionClick(other.slug)}
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
                  {other.heroImage ? (
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
                  ) : null}
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
                  {tRugs('explore')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive style overrides */}
      <style>{`
        @media (max-width: 768px) {
          .coll-desc-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .rug-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .rug-grid { grid-template-columns: 1fr !important; }
        }
        .coll-rug-img {
          object-fit: contain;
          padding: clamp(10px, 5%, 26px);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .group:hover .coll-rug-img {
          transform: scale(1.05) translateZ(0);
        }
        .coll-rug-frame {
          transition: box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .group:hover .coll-rug-frame {
          box-shadow: 0 18px 42px -18px rgba(26, 24, 23, 0.34);
        }
      `}</style>
    </>
  );
}
