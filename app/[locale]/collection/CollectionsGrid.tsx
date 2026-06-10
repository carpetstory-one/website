'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import type { Collection } from '@/lib/collections';
import { analytics } from '@/lib/analytics';
import { debounce } from '@/lib/url';
import { RugFilters } from '@/components/rugs/RugFilters';
import {
  getAllRugs,
  getCollectionOptions,
  filterAndSort,
  emptyFilters,
  hasActiveFilters,
  parseFiltersFromParams,
  serializeFilters,
  priceBounds,
  availableMaterials,
  availableMakes,
  type RugFilters as Filters,
} from '@/lib/rugs';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function CollectionsGrid({ collections = [] }: { collections?: Collection[] }) {
  const t = useTranslations('CollectionsPage');

  const [filters, setFilters] = useState<Filters>(() => emptyFilters());

  // Hydrate from URL on mount + adopt back/forward popstate
  useEffect(() => {
    setFilters(
      parseFiltersFromParams(new URLSearchParams(window.location.search))
    );
    const onPop = () =>
      setFilters(
        parseFiltersFromParams(new URLSearchParams(window.location.search))
      );
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const writeUrl = useRef(
    debounce((f: Filters) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const ALL_FILTER_KEYS = [
        'collection',
        'material',
        'make',
        'size',
        'color',
        'price',
        'sort',
      ];
      ALL_FILTER_KEYS.forEach((k) => url.searchParams.delete(k));
      const qs = new URLSearchParams(serializeFilters(f));
      qs.forEach((v, k) => url.searchParams.set(k, v));
      window.history.replaceState(window.history.state, '', url);
    }, 150)
  ).current;
  useEffect(() => () => writeUrl.cancel(), [writeUrl]);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        writeUrl(next);
        return next;
      });
    },
    [writeUrl]
  );

  const clearAll = useCallback(() => {
    const cleared = emptyFilters();
    setFilters(cleared);
    writeUrl(cleared);
  }, [writeUrl]);

  const allRugs = useMemo(() => getAllRugs(collections), [collections]);
  const bounds = useMemo(() => priceBounds(allRugs), [allRugs]);
  const materials = useMemo(() => availableMaterials(allRugs), [allRugs]);
  const makes = useMemo(() => availableMakes(allRugs), [allRugs]);
  const collectionOpts = useMemo(() => getCollectionOptions(collections), [collections]);

  const visible = useMemo(() => {
    if (!hasActiveFilters(filters)) return collections;
    return collections.filter((col) => {
      const colRugs = allRugs.filter((r) => r.collectionSlug === col.slug);
      const matchingRugs = filterAndSort(colRugs, filters);
      return matchingRugs.length > 0;
    });
  }, [filters, allRugs, collections]);

  return (
    <main className="flex-1 px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-24 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        {/* Page header */}
        <motion.header
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
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
            {t('eyebrow')}
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
            {t('headline')}
          </h1>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--ink-soft)',
              maxWidth: '38ch',
              margin: '0 auto',
            }}
          >
            {t('description')}
          </p>
        </motion.header>

        {/* Grid / empty state */}
        {visible.length === 0 ? (
          <div className="py-20 text-center" role="status">
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
              {t('noCollections')}
            </p>
            <button
              onClick={clearAll}
              className="text-accent mt-3 text-[12px] tracking-[0.16em] uppercase underline-offset-4 hover:underline"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <motion.div layout="position" className="col-grid">
            <AnimatePresence mode="popLayout">
              {visible.map((col, vi) => {
                const idx = vi;
                const eyebrow = `${String(idx + 1).padStart(2, '0')} — ${col.name.toUpperCase()}`;
                const isEager = vi < 6;

                return (
                  <motion.article
                    key={col.slug}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{
                      duration: 0.8,
                      delay: (vi % 3) * 0.12,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                  >
                    <Link
                      href={`/collection/${col.slug}`}
                      aria-label={`${col.name} — ${col.tagline}`}
                      className="feat-link"
                      onClick={() => {
                        if (
                          typeof window !== 'undefined' &&
                          (window as any).gtag
                        ) {
                          (window as any).gtag(
                            'event',
                            'collection_card_clicked',
                            {
                              collection_slug: col.slug,
                              source: 'index',
                            }
                          );
                        }
                      }}
                    >
                      <div className="feat-img">
                        {col.heroImage ? (
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
                        ) : null}
                      </div>

                      <div className="feat-scrim" aria-hidden="true" />

                      <div className="feat-caption">
                        <span className="feat-eyebrow">{eyebrow}</span>
                        <h2 className="feat-name">{col.name}</h2>
                        <p className="feat-tag">{col.tagline}</p>
                        <span className="feat-explore">
                          {t('explore')}
                        </span>
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
