'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { RangeSlider } from './RangeSlider';
import {
  COLOR_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  type Material,
  type Make,
  type RugFilters as Filters,
  activeFilterCount,
} from '@/lib/rugs';

const EASE = [0.32, 0.72, 0, 1] as const;

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

type Props = {
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  matchingCount: number;
  onClearAll: () => void;
  bounds: { min: number; max: number };
  materials: Material[];
  makes: Make[];
  hideFacets?: string[];
  collectionOptions?: Array<{ slug: string; name: string }>;
};

export function RugFilters(props: Props) {
  const t = useTranslations('Filters');

  const {
    filters,
    update,
    matchingCount,
    onClearAll,
    bounds,
    materials,
    makes,
    hideFacets,
    collectionOptions = [],
  } = props;
  const [openFacets, setOpenFacets] = useState<string[]>(['color']);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Portal target is only available on the client.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const toggleFacet = (id: string) => {
    setOpenFacets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const onTouchEnd = (onClose: () => void) => {
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
    dragStartY.current = null;
  };

  // Mobile sheets: body scroll lock + ESC.
  useEffect(() => {
    const active = sheetOpen || sortSheetOpen;
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSheetOpen(false);
        setSortSheetOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onEsc);
    };
  }, [sheetOpen, sortSheetOpen]);

  const priceValue: [number, number] = filters.price ?? [
    bounds.min,
    bounds.max,
  ];
  const setPrice = (v: [number, number]) =>
    update({ price: v[0] <= bounds.min && v[1] >= bounds.max ? null : v });

  // ── Facet bodies (shared by desktop popovers + mobile sheet) ───────────────
  const Collections = (
    <div className="filx-chips">
      {collectionOptions.map((c) => (
        <button
          key={c.slug}
          type="button"
          aria-pressed={filters.collection.includes(c.slug)}
          className={`filx-chip${filters.collection.includes(c.slug) ? 'is-on' : ''}`}
          onClick={() =>
            update({ collection: toggle(filters.collection, c.slug) })
          }
        >
          {c.name}
        </button>
      ))}
    </div>
  );

  const Materials = (
    <div className="filx-chips">
      {materials.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={filters.material.includes(m)}
          className={`filx-chip${filters.material.includes(m) ? 'is-on' : ''}`}
          onClick={() => update({ material: toggle(filters.material, m) })}
        >
          {t(`materials.${m}`)}
        </button>
      ))}
    </div>
  );

  const MakeBody = (
    <div className="filx-chips">
      {makes.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={filters.make === m}
          className={`filx-chip${filters.make === m ? 'is-on' : ''}`}
          onClick={() => update({ make: filters.make === m ? '' : m })}
        >
          {t(`makes.${m}`)}
        </button>
      ))}
    </div>
  );

  const Sizes = (
    <div className="filx-chips">
      {SIZE_OPTIONS.map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={filters.size.includes(s)}
          className={`filx-chip${filters.size.includes(s) ? 'is-on' : ''}`}
          onClick={() => update({ size: toggle(filters.size, s) })}
        >
          {t(`sizes.${s}`)}
        </button>
      ))}
    </div>
  );

  const Price = (
    <div className="filx-price">
      <RangeSlider
        min={bounds.min}
        max={bounds.max}
        step={500}
        value={priceValue}
        onChange={setPrice}
        format={usd}
      />
    </div>
  );

  const Colors = (
    <div className="filx-swatches">
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={filters.color.includes(c.id)}
          aria-label={t(`colors.${c.id}`)}
          title={t(`colors.${c.id}`)}
          className={`filx-swatch${filters.color.includes(c.id) ? 'is-on' : ''}`}
          onClick={() => update({ color: toggle(filters.color, c.id) })}
        >
          <span className="filx-swatch-dot" style={{ background: c.swatch }} />
          <span className="filx-swatch-label">{t(`colors.${c.id}`)}</span>
        </button>
      ))}
    </div>
  );

  const FACETS: Array<{
    id: string;
    label: string;
    count: number;
    body: React.ReactNode;
  }> = [
    {
      id: 'collection',
      label: t('collection'),
      count: filters.collection.length,
      body: Collections,
    },
    {
      id: 'material',
      label: t('material'),
      count: filters.material.length,
      body: Materials,
    },
    {
      id: 'make',
      label: t('make'),
      count: filters.make ? 1 : 0,
      body: MakeBody,
    },
    { id: 'size', label: t('size'), count: filters.size.length, body: Sizes },
    {
      id: 'price',
      label: t('price'),
      count: filters.price ? 1 : 0,
      body: Price,
    },
    {
      id: 'color',
      label: t('color'),
      count: filters.color.length,
      body: Colors,
    },
  ].filter((f) => !hideFacets?.includes(f.id));

  const totalActive = activeFilterCount(filters);

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <div className="filx-sidebar" ref={barRef}>
        {!hideFacets?.includes('sort') && (
          <label className="filx-sidebar-sort">
            <span className="filx-sidebar-sort-label">{t('sort')}</span>
            <select
              value={filters.sort}
              onChange={(e) =>
                update({ sort: e.target.value as Filters['sort'] })
              }
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(`sortOptions.${s.id}`)}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="filx-sidebar-facets">
          {FACETS.map((f) => {
            const isOpen = openFacets.includes(f.id);
            return (
              <div key={f.id} className="filx-sidebar-facet">
                <button
                  type="button"
                  className={`filx-sidebar-btn${isOpen ? 'is-open' : ''}`}
                  aria-expanded={isOpen}
                  onClick={() => toggleFacet(f.id)}
                >
                  <span className="filx-sidebar-btn-text">
                    {f.label}
                    {f.count > 0 && (
                      <span className="filx-badge">{f.count}</span>
                    )}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="filx-sidebar-icon"
                  >
                    <path
                      d={isOpen ? 'M2 6h8' : 'M6 2v8M2 6h8'}
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <div
                    className="filx-sidebar-body"
                    role="group"
                    aria-label={f.label}
                  >
                    {f.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile trigger ─────────────────────────────────────────────── */}
      <div className="filx-mobile-bar">
        <button
          type="button"
          className="filx-mobile-trigger"
          onClick={() => setSheetOpen(true)}
        >
          {t('trigger')}
          {totalActive > 0 && <span className="filx-badge">{totalActive}</span>}
        </button>
        {!hideFacets?.includes('sort') && (
          <button
            type="button"
            className="filx-mobile-sort-trigger"
            onClick={() => setSortSheetOpen(true)}
          >
            {t('sort')} — {t(`sortOptions.${filters.sort}`)}
          </button>
        )}
      </div>

      {/* ── Mobile bottom sheets (portaled) ──────────────────────────────── */}
      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {sheetOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="filx-sheet-backdrop"
                    aria-hidden="true"
                    onClick={() => setSheetOpen(false)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('trigger')}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={
                      dragOffset > 0
                        ? {
                            transform: `translateY(${dragOffset}px)`,
                            transition: 'none',
                          }
                        : undefined
                    }
                    className="filx-sheet"
                    data-lenis-prevent
                  >
                    <div
                      className="filx-sheet-head"
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={() => onTouchEnd(() => setSheetOpen(false))}
                      style={{ cursor: 'grab' }}
                    >
                      <span className="filx-sheet-title">{t('trigger')}</span>
                      <button
                        type="button"
                        className="filx-sheet-close"
                        aria-label={t('close')}
                        onClick={() => setSheetOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="filx-sheet-body">
                      <div className="filx-sheet-accordion">
                        {FACETS.map((f) => {
                          const isOpen = openFacets.includes(f.id);
                          return (
                            <div key={f.id} className="filx-sheet-facet">
                              <button
                                type="button"
                                className={`filx-sheet-facet-btn${isOpen ? 'is-open' : ''}`}
                                aria-expanded={isOpen}
                                onClick={() => toggleFacet(f.id)}
                              >
                                <span className="filx-sheet-facet-label">
                                  {f.label}
                                  {f.count > 0 && (
                                    <span className="filx-badge">
                                      {f.count}
                                    </span>
                                  )}
                                </span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  className="filx-sheet-facet-icon"
                                >
                                  <line
                                    x1="2"
                                    y1="6"
                                    x2="10"
                                    y2="6"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                  />
                                  <line
                                    x1="6"
                                    y1="2"
                                    x2="6"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    style={{
                                      transform: isOpen
                                        ? 'rotate(90deg)'
                                        : 'rotate(0deg)',
                                      transformOrigin: 'center',
                                      opacity: isOpen ? 0 : 1,
                                      transition:
                                        'transform 0.3s var(--ease), opacity 0.3s var(--ease)',
                                    }}
                                  />
                                </svg>
                              </button>
                              {isOpen && (
                                <div className="filx-sheet-facet-body">
                                  {f.body}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="filx-sheet-foot">
                      <button
                        type="button"
                        className="filx-sheet-clear"
                        onClick={onClearAll}
                      >
                        {t('clearAll')}
                      </button>
                      <button
                        type="button"
                        className="filx-sheet-apply"
                        onClick={() => setSheetOpen(false)}
                      >
                        {t('showCount', { count: matchingCount })}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {sortSheetOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="filx-sheet-backdrop"
                    aria-hidden="true"
                    onClick={() => setSortSheetOpen(false)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('sort')}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={
                      dragOffset > 0
                        ? {
                            transform: `translateY(${dragOffset}px)`,
                            transition: 'none',
                          }
                        : undefined
                    }
                    className="filx-sheet"
                    data-lenis-prevent
                  >
                    <div
                      className="filx-sheet-head"
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={() =>
                        onTouchEnd(() => setSortSheetOpen(false))
                      }
                      style={{ cursor: 'grab' }}
                    >
                      <span className="filx-sheet-title">{t('sort')}</span>
                      <button
                        type="button"
                        className="filx-sheet-close"
                        aria-label={t('close')}
                        onClick={() => setSortSheetOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="filx-sheet-body">
                      <div className="filx-sort-list">
                        {SORT_OPTIONS.map((s) => {
                          const isSelected = filters.sort === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              className={`filx-sort-item${isSelected ? 'is-selected' : ''}`}
                              onClick={() => {
                                update({ sort: s.id });
                                setSortSheetOpen(false);
                              }}
                            >
                              <span>{t(`sortOptions.${s.id}`)}</span>
                              {isSelected && (
                                <span className="filx-sort-checkmark" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}
    </>
  );
}
