'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { RangeSlider } from './RangeSlider';
import {
  COLLECTION_OPTIONS,
  COLOR_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  type Material,
  type Make,
  type RugFilters as Filters,
  activeFilterCount,
} from '@/lib/rugs';

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
  } = props;
  const [openFacet, setOpenFacet] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Desktop popover: close on outside click / ESC.
  useEffect(() => {
    if (!openFacet) return;
    const onDown = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenFacet(null);
    };
    const onEsc = (e: KeyboardEvent) =>
      e.key === 'Escape' && setOpenFacet(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [openFacet]);

  // Mobile sheet: body scroll lock + ESC.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) =>
      e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onEsc);
    };
  }, [sheetOpen]);

  const priceValue: [number, number] = filters.price ?? [
    bounds.min,
    bounds.max,
  ];
  const setPrice = (v: [number, number]) =>
    update({ price: v[0] <= bounds.min && v[1] >= bounds.max ? null : v });

  // ── Facet bodies (shared by desktop popovers + mobile sheet) ───────────────
  const Collections = (
    <div className="filx-chips">
      {COLLECTION_OPTIONS.map((c) => (
        <button
          key={c.slug}
          type="button"
          aria-pressed={filters.collection.includes(c.slug)}
          className={`filx-chip${filters.collection.includes(c.slug) ? ' is-on' : ''}`}
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
          className={`filx-chip${filters.material.includes(m) ? ' is-on' : ''}`}
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
          className={`filx-chip${filters.make === m ? ' is-on' : ''}`}
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
          className={`filx-chip${filters.size.includes(s) ? ' is-on' : ''}`}
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
          className={`filx-swatch${filters.color.includes(c.id) ? ' is-on' : ''}`}
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
    { id: 'make', label: t('make'), count: filters.make ? 1 : 0, body: MakeBody },
    { id: 'size', label: t('size'), count: filters.size.length, body: Sizes },
    { id: 'price', label: t('price'), count: filters.price ? 1 : 0, body: Price },
    { id: 'color', label: t('color'), count: filters.color.length, body: Colors },
  ].filter((f) => !hideFacets?.includes(f.id));

  const totalActive = activeFilterCount(filters);

  return (
    <>
      {/* ── Desktop filter bar ─────────────────────────────────────────── */}
      <div className="filx-bar" ref={barRef}>
        <div className="filx-facets">
          {FACETS.map((f) => (
            <div key={f.id} className="filx-facet">
              <button
                type="button"
                className={`filx-facet-btn${openFacet === f.id ? ' is-open' : ''}`}
                aria-expanded={openFacet === f.id}
                onClick={() => setOpenFacet((o) => (o === f.id ? null : f.id))}
              >
                {f.label}
                {f.count > 0 && <span className="filx-badge">{f.count}</span>}
              </button>
              {openFacet === f.id && (
                <div className="filx-pop" role="group" aria-label={f.label}>
                  {f.body}
                </div>
              )}
            </div>
          ))}
        </div>

        {!hideFacets?.includes('sort') && (
          <label className="filx-sort">
            <span className="filx-sort-label">{t('sort')}</span>
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
          <label className="filx-sort filx-sort--mobile">
            <span className="filx-sort-label">{t('sort')}</span>
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
      </div>

      {/* ── Mobile bottom sheet (backdrop + 90vh sheet) ─────────────────── */}
      {sheetOpen && (
        <>
        <div
          className="filx-sheet-backdrop"
          aria-hidden="true"
          onClick={() => setSheetOpen(false)}
        />
        <div
          className="filx-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t('trigger')}
          data-lenis-prevent
        >
          <div className="filx-sheet-head">
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
            {FACETS.map((f) => (
              <section key={f.id} className="filx-sheet-group">
                <h3 className="filx-sheet-legend">{f.label}</h3>
                {f.body}
              </section>
            ))}
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
        </div>
        </>
      )}
    </>
  );
}
