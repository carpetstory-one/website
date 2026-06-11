'use client';

/**
 * EstimateTool — "Estimate Your Piece" range estimator.
 *
 * A qualifier, never a quote: the output is always a RANGE and always ends with
 * "begin an inquiry". Reused in two places (same component, local state only):
 *   • /rugs — inside a slide-out drawer (EstimateDrawer below)
 *   • /collection/[slug] — inline section above "Other collections"
 *
 * Pricing lives in lib/estimate.ts (placeholder economics — see note there).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { analytics } from '@/lib/analytics';
import {
  CONSTRUCTION_OPTIONS,
  MATERIAL_OPTIONS,
  KNOT_OPTIONS,
  COMPLEXITY_OPTIONS,
  SIZE_PRESETS,
  computeEstimate,
  type Construction,
  type EstMaterial,
  type KnotDensity,
  type Complexity,
} from '@/lib/estimate';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function useAnimatedNumber(value: number, durationMs = 400): number {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = display;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced, durationMs]);

  return reduced ? value : display;
}

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

export function EstimateTool({
  source,
}: {
  source: 'rugs' | 'collection' | 'piece';
}) {
  const t = useTranslations('Estimate');
  const [construction, setConstruction] = useState<Construction | null>(null);
  const [material, setMaterial] = useState<EstMaterial | null>(null);
  const [preset, setPreset] = useState<string | null>(null);
  const [custom, setCustom] = useState(false);
  const [w, setW] = useState<string>('');
  const [l, setL] = useState<string>('');
  const [knot, setKnot] = useState<KnotDensity>('standard');
  const [complexity, setComplexity] = useState<Complexity>('traditional');

  useEffect(() => {
    analytics.estimateToolOpened(source);
  }, [source]);

  const widthFt = custom
    ? parseFloat(w) || null
    : preset
      ? SIZE_PRESETS.find((p) => p.label === preset)!.w
      : null;
  const lengthFt = custom
    ? parseFloat(l) || null
    : preset
      ? SIZE_PRESETS.find((p) => p.label === preset)!.l
      : null;

  const result = useMemo(
    () =>
      computeEstimate({
        construction,
        material,
        widthFt,
        lengthFt,
        knot,
        complexity,
      }),
    [construction, material, widthFt, lengthFt, knot, complexity]
  );

  // Fire estimate_calculated when a fresh range settles.
  const lastFired = useRef<string>('');
  useEffect(() => {
    if (!result || !construction || !material) return;
    const key = `${result.low}-${result.high}-${result.sqft}`;
    if (key === lastFired.current) return;
    const id = setTimeout(() => {
      lastFired.current = key;
      analytics.estimateCalculated({
        construction,
        material,
        size_sqft: result.sqft,
        low: result.low,
        high: result.high,
      });
    }, 500);
    return () => clearTimeout(id);
  }, [result, construction, material]);

  const animLow = useAnimatedNumber(result?.low ?? 0);
  const animHigh = useAnimatedNumber(result?.high ?? 0);

  const sqftLive =
    widthFt && lengthFt ? t('sqft', { n: Math.round(widthFt * lengthFt) }) : null;

  const inquiryMessage =
    result && construction && material
      ? t('inquiryMessage', {
          sqft: result.sqft,
          construction: t(`constructionOptions.${construction}.label`),
          material: t(`materialOptions.${material}`),
          low: usd(result.low),
          high: usd(result.high),
        })
      : '';

  return (
    <div className="est">
      <div className="est-inputs">
        {/* 1. Construction */}
        <fieldset className="est-group">
          <legend className="est-legend">{t('construction')}</legend>
          <div className="est-cards">
            {CONSTRUCTION_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={construction === o.id}
                className={`est-card${construction === o.id ? ' is-on' : ''}`}
                onClick={() => setConstruction(o.id)}
              >
                <span className="est-card-title">
                  {t(`constructionOptions.${o.id}.label`)}
                </span>
                <span className="est-card-desc">
                  {t(`constructionOptions.${o.id}.desc`)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* 2. Material */}
        <fieldset className="est-group">
          <legend className="est-legend">{t('material')}</legend>
          <div className="est-chips">
            {MATERIAL_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={material === o.id}
                className={`est-chip${material === o.id ? ' is-on' : ''}`}
                onClick={() => setMaterial(o.id)}
              >
                {t(`materialOptions.${o.id}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 3. Size */}
        <fieldset className="est-group">
          <legend className="est-legend">
            {t('size')}{' '}
            {sqftLive && <span className="est-sqft">· {sqftLive}</span>}
          </legend>
          <div className="est-sizes">
            {SIZE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={!custom && preset === p.label}
                className={`est-size${!custom && preset === p.label ? ' is-on' : ''}`}
                onClick={() => {
                  setCustom(false);
                  setPreset(p.label);
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={custom}
              className={`est-size${custom ? ' is-on' : ''}`}
              onClick={() => setCustom(true)}
            >
              {t('custom')}
            </button>
          </div>
          {custom && (
            <div className="est-custom">
              <label className="est-num">
                <span>{t('widthFt')}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={w}
                  onChange={(e) => setW(e.target.value)}
                  placeholder="8"
                />
              </label>
              <span className="est-times" aria-hidden="true">
                ×
              </span>
              <label className="est-num">
                <span>{t('lengthFt')}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={l}
                  onChange={(e) => setL(e.target.value)}
                  placeholder="10"
                />
              </label>
            </div>
          )}
        </fieldset>

        {/* 4. Knot density — hand-knotted only */}
        {construction === 'hand-knotted' && (
          <fieldset className="est-group">
            <legend className="est-legend">{t('knotDensity')}</legend>
            <div className="est-chips">
              {KNOT_OPTIONS.map((o: any) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={knot === o.id}
                  className={`est-chip${knot === o.id ? ' is-on' : ''}`}
                  onClick={() => setKnot(o.id)}
                >
                  {t(`knotOptions.${o.id}.label`)}
                  <span className="est-chip-sub">
                    {' '}
                    {t(`knotOptions.${o.id}.desc`)}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* 5. Complexity */}
        <fieldset className="est-group">
          <legend className="est-legend">{t('complexity')}</legend>
          <div className="est-chips">
            {COMPLEXITY_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={complexity === o.id}
                className={`est-chip${complexity === o.id ? ' is-on' : ''}`}
                onClick={() => setComplexity(o.id)}
              >
                {t(`complexityOptions.${o.id}`)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Output — sticky at the bottom of the viewport on mobile */}
      <div className="est-output" aria-live="polite">
        {!result ? (
          <p className="est-placeholder">{t('placeholder')}</p>
        ) : (
          <>
            <span className="est-out-label">{t('rangeLabel')}</span>
            <p className="est-range">
              {usd(animLow)} <span className="est-dash">—</span> {usd(animHigh)}
            </p>
            <p className="est-out-line">
              {t('outLine', {
                sqft: result.sqft,
                material: material ? t(`materialOptions.${material}`) : '',
                construction: construction
                  ? t(`constructionOptions.${construction}.label`)
                  : '',
              })}
            </p>
            <p className="est-disclaimer">{t('disclaimer')}</p>
            <Link
              href={{
                pathname: '/contact',
                query: { message: inquiryMessage },
              }}
              className="est-cta"
              onClick={() =>
                analytics.estimateInquiryInitiated(result.low, result.high)
              }
            >
              {t('cta')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
