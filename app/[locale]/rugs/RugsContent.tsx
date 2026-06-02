'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { RugCard } from '@/components/rugs/RugCard';
import { RugFilters } from '@/components/rugs/RugFilters';
import { debounce } from '@/lib/url';
import {
  getAllRugs,
  filterAndSort,
  emptyFilters,
  hasActiveFilters,
  parseFiltersFromParams,
  serializeFilters,
  priceBounds,
  availableMaterials,
  availableMakes,
  collectionCount,
  type RugFilters as Filters,
} from '@/lib/rugs';

const PAGE = 24;
const ALL_FILTER_KEYS = [
  'collection',
  'material',
  'make',
  'size',
  'color',
  'price',
  'sort',
];

// Merge filter params into the existing URL (preserving e.g. ?shortlist=).
function writeFiltersToUrl(filters: Filters) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  ALL_FILTER_KEYS.forEach((k) => url.searchParams.delete(k));
  const qs = new URLSearchParams(serializeFilters(filters));
  qs.forEach((v, k) => url.searchParams.set(k, v));
  window.history.replaceState(window.history.state, '', url);
}

export function RugsContent() {
  const t = useTranslations('RugsPage');
  
  const allRugs = useMemo(() => getAllRugs(), []);
  const bounds = useMemo(() => priceBounds(), []);
  const materials = useMemo(() => availableMaterials(), []);
  const makes = useMemo(() => availableMakes(), []);

  const [filters, setFilters] = useState<Filters>(() => emptyFilters());
  const [visible, setVisible] = useState(PAGE);

  // Hydrate from URL on mount + adopt back/forward.
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

  // Debounced shallow URL writes (150ms).
  const writeUrl = useRef(
    debounce((f: Filters) => writeFiltersToUrl(f), 150)
  ).current;
  useEffect(() => () => writeUrl.cancel(), [writeUrl]);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        writeUrl(next);
        return next;
      });
      setVisible(PAGE); // reset infinite scroll on any filter change
    },
    [writeUrl]
  );

  const clearAll = useCallback(() => {
    const cleared = emptyFilters();
    setFilters(cleared);
    writeUrl(cleared);
    setVisible(PAGE);
  }, [writeUrl]);

  const filtered = useMemo(
    () => filterAndSort(allRugs, filters),
    [allRugs, filters]
  );
  const shown = filtered.slice(0, visible);
  const animate = filtered.length <= 50; // cap layout animation cost

  // Infinite scroll via IntersectionObserver.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (visible >= filtered.length) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting)
          setVisible((v) => Math.min(v + PAGE, filtered.length));
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, filtered.length]);

  const total = allRugs.length;
  const active = hasActiveFilters(filters);

  return (
    <>
      {/* Compact hero strip */}
      <header className="rugx-hero">
        <span className="rugx-hero-label">{t('eyebrow')}</span>
        <h1 className="rugx-hero-title">{t('title')}</h1>
        <p className="rugx-hero-sub">
          {t('subtitle', { total, count: collectionCount })}
        </p>
      </header>

      {/* Sticky filter bar */}
      <div className="rugx-filterwrap">
        <RugFilters
          filters={filters}
          update={update}
          matchingCount={filtered.length}
          onClearAll={clearAll}
          bounds={bounds}
          materials={materials}
          makes={makes}
        />
      </div>

      <div className="rugx-results">
        <p className="rugx-count">
          {t('showing', { shown: Math.min(shown.length, filtered.length), total })}
        </p>
        {active && (
          <button type="button" className="rugx-clear" onClick={clearAll}>
            {t('clearFilters')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rugx-empty" role="status">
          <p>{t('noRugs')}</p>
          <button type="button" className="rugx-empty-btn" onClick={clearAll}>
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <motion.div
          layout={animate ? 'position' : undefined}
          className="rugx-grid"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((rug, i) => (
              <motion.div
                key={rug.id}
                layout={animate ? 'position' : undefined}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  delay: animate ? (i % 3) * 0.03 : 0,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <RugCard rug={rug} index={i} eager={i < 6} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {visible < filtered.length && (
        <div ref={sentinel} className="rugx-sentinel" aria-hidden="true">
          <span className="rugx-spinner" />
        </div>
      )}
    </>
  );
}
