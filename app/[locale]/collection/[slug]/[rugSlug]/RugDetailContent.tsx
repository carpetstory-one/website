'use client';

import React, { useEffect, useState } from 'react';
import { SanityImage } from '@/components/SanityImage';
import { sanityImageUrl, isSanityImageUrl } from '@/lib/sanity-image';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { blurDataURL } from '@/lib/blur';
import type { Collection, Rug } from '@/lib/collections';
import { ShortlistToggleButton } from '@/components/shortlist/ShortlistToggleButton';
import { EstimateTool } from '@/components/estimate/EstimateTool';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const specDt: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
  marginBottom: '5px',
};
const specDd: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--ink)',
  fontWeight: 500,
};

function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt style={specDt}>{label}</dt>
      <dd style={specDd}>{value}</dd>
    </div>
  );
}

export function RugDetailContent({
  rug,
  collection,
  siblings,
  collectionSlug,
  locale,
  inquiryMessage,
}: {
  rug: Rug;
  collection: Collection;
  siblings: Rug[];
  collectionSlug: string;
  locale: string;
  inquiryMessage: string;
}) {
  const t = useTranslations('PiecePage');
  const tRugs = useTranslations('RugsPage');

  // Lightbox (enlarge / zoom the carpet)
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const closeLightbox = () => {
    setLightbox(false);
    setZoomed(false);
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  // Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'rug_viewed', {
        rug_slug: rug.slug,
        collection_slug: collectionSlug,
      });
    }
  }, [rug.slug, collectionSlug]);

  function handleInquiryClick() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'rug_inquiry_initiated', {
        rug_slug: rug.slug,
        collection_slug: collectionSlug,
      });
    }
  }

  return (
    <>
      {/* ── Title + price header ───────────────────────────────────── */}
      <header
        className="rug-detail-head"
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px 0' }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            marginBottom: '14px',
          }}
        >
          {collection.name}
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            fontSize: 'clamp(42px, 5vw, 68px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}
        >
          {rug.name}
        </h1>
        {rug.price && (
          <div style={{ marginTop: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(24px, 3vw, 30px)',
                color: 'var(--ink)',
              }}
            >
              {rug.price}
            </span>
            <span
              style={{
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: 'var(--ink-soft)',
                marginLeft: '12px',
              }}
            >
              {t('priceNote')}
            </span>
          </div>
        )}
      </header>

      {/* ── Image (left) + estimate configurator (right) ───────────── */}
      <div
        className="rug-detail-grid"
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '20px var(--gutter) 24px',
          display: 'grid',
          gridTemplateColumns: '60% 1fr',
          gap: '44px',
          alignItems: 'start',
        }}
      >
        {/* Left: large rug image — click to enlarge / zoom */}
        <div className="rug-detail-media">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <button
              type="button"
              className="rug-zoom-trigger"
              onClick={() => setLightbox(true)}
              aria-label={`Enlarge ${rug.name}`}
            >
              <div
                className="rug-detail-frame"
                style={{
                  position: 'relative',
                  height: 'calc(100vh - 200px)',
                  minHeight: '400px',
                  maxHeight: '800px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '0 34px 70px -34px rgba(26, 24, 23, 0.32)',
                }}
              >
                {rug.image ? (
                  <SanityImage
                    src={rug.image}
                    alt={`${rug.name} — ${collection.name} collection`}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="rug-detail-image"
                  />
                ) : null}
              </div>
              <span className="rug-zoom-hint" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
                {t('zoomHint')}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right: compact estimate configurator */}
        <motion.div
          className="rug-detail-info"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.15}
        >
          {/* <div className="rug-est">
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                marginBottom: '8px',
              }}
            >
              {tRugs('calcEyebrow')}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(22px, 2vw, 27px)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: '14px',
              }}
            >
              {tRugs('calcTitle')}
            </h2>
            <EstimateTool source="piece" />
          </div> */}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Description */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-soft)',
                  marginBottom: '16px',
                }}
              >
                {t('aboutHeading')}
              </span>
              {rug.description && (
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: 'var(--ink-soft)',
                    maxWidth: '52ch',
                    marginBottom: '28px',
                  }}
                >
                  {rug.description}
                </p>
              )}

              {/* Spec strip */}
              <dl className="rug-spec-list" style={{ marginTop: 0 }}>
                <Spec
                  label={t('materials')}
                  value={rug.materials || collection.meta?.materials}
                />
                <Spec label={t('dimensions')} value={rug.dimensions} />
                <Spec
                  label={t('density')}
                  value={rug.knotDensity || collection.meta?.knotDensity}
                />
                <Spec
                  label={rug.weaveTime ? t('weaveTime') : t('leadTime')}
                  value={rug.weaveTime || collection.meta?.leadTime}
                />
                <Spec
                  label={t('origin')}
                  value={collection.meta?.origin || 'Jaipur, Rajasthan'}
                />
              </dl>
            </div>

            {/* Actions */}
            <div className="rug-detail-actions">
              <Link
                href={`/inquiry?message=${inquiryMessage}&collection=${encodeURIComponent(collection.name)}&rug=${encodeURIComponent(rug.name)}`}
                onClick={handleInquiryClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 28px',
                  background: 'var(--accent, #6e1f23)',
                  color: '#fff',
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.4s',
                }}
              >
                {t('inquireCTA')}
              </Link>

              <ShortlistToggleButton
                variant="button"
                collectionSlug={collectionSlug}
                rugSlug={rug.slug}
                rugName={`${collection.name} ${rug.name}`}
              />

              <a
                href={`https://wa.me/919602492022?text=${inquiryMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--ink-soft)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('whatsappCTA')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Description · specs · actions (below) ──────────────────── */}
      {/* <section
        className="rug-detail-bottom"
        style={{
          maxWidth: '1400px',
          margin: '48px auto 0',
          padding: '52px 24px 72px',
          borderTop: '1px solid var(--ink-faint)',
        }}
      >
        <div className="rug-detail-bottom-grid">
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                marginBottom: '16px',
              }}
            >
              {t('aboutHeading')}
            </span>
            {rug.description && (
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: 'var(--ink-soft)',
                  maxWidth: '52ch',
                  marginBottom: '28px',
                }}
              >
                {rug.description}
              </p>
            )}

            <dl className="rug-spec-list">
              <Spec
                label={t('materials')}
                value={rug.materials || collection.meta?.materials}
              />
              <Spec label={t('dimensions')} value={rug.dimensions} />
              <Spec
                label={t('density')}
                value={rug.knotDensity || collection.meta?.knotDensity}
              />
              <Spec
                label={rug.weaveTime ? t('weaveTime') : t('leadTime')}
                value={rug.weaveTime || collection.meta?.leadTime}
              />
              <Spec
                label={t('origin')}
                value={collection.meta?.origin || 'Jaipur, Rajasthan'}
              />
            </dl>
          </div>

          <div className="rug-detail-actions">
            <Link
              href={`/inquiry?message=${inquiryMessage}&collection=${encodeURIComponent(collection.name)}&rug=${encodeURIComponent(rug.name)}`}
              onClick={handleInquiryClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 28px',
                background: 'var(--accent, #6e1f23)',
                color: '#fff',
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.4s',
              }}
            >
              {t('inquireCTA')}
            </Link>

            <ShortlistToggleButton
              variant="button"
              collectionSlug={collectionSlug}
              rugSlug={rug.slug}
              rugName={`${collection.name} ${rug.name}`}
            />

            <a
              href={`https://wa.me/919602492022?text=${inquiryMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--ink-soft)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('whatsappCTA')}
            </a>
          </div>
        </div>
      </section> */}

      {/* ── More from this collection ──────────────────────────────── */}
      {siblings.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--ink-faint)',
            padding: 'var(--pad-frame) var(--gutter) var(--section-y)',
          }}
        >
          <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
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
              {t('moreFromCollection', { collection: collection.name })}
            </span>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: '8px',
              }}
            >
              {siblings.map((sib) => (
                <div
                  key={sib.slug}
                  style={{ position: 'relative', flexShrink: 0 }}
                >
                  <ShortlistToggleButton
                    collectionSlug={collectionSlug}
                    rugSlug={sib.slug}
                    rugName={`${collection.name} ${sib.name}`}
                  />
                  <Link
                    href={`/collection/${collectionSlug}/${sib.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="rug-detail-frame"
                      style={{
                        width: '220px',
                        position: 'relative',
                        aspectRatio: '4/5',
                        overflow: 'hidden',
                        marginBottom: '14px',
                        background: '#ffffff',
                      }}
                    >
                      {sib.image ? (
                        <SanityImage
                          src={sib.image}
                          alt={sib.name}
                          fill
                          loading="lazy"
                          sizes="220px"
                          placeholder="blur"
                          blurDataURL={blurDataURL()}
                          className="rug-detail-image"
                        />
                      ) : null}
                    </div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        color: 'var(--ink)',
                        marginBottom: '4px',
                      }}
                    >
                      {sib.name}
                    </span>
                    {sib.price && (
                      <span
                        style={{ fontSize: '12px', color: 'var(--ink-soft)' }}
                      >
                        {sib.price}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {lightbox && rug.image && (
        <div
          className="rug-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${rug.name} — enlarged view`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="rug-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className={`rug-lightbox-stage${zoomed ? ' is-zoomed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                // rug.image is a bare CDN URL now; size the lightbox copy so
                // zooming doesn't pull the full-resolution original.
                isSanityImageUrl(rug.image)
                  ? sanityImageUrl(rug.image, 1200)
                  : rug.image
              }
              alt={`${rug.name} — ${collection.name} collection`}
              draggable={false}
            />
          </div>
          <span className="rug-lightbox-hint" aria-hidden="true">
            {zoomed ? t('zoomFit') : t('zoomIn')}
          </span>
        </div>
      )}

      {/* Image framing, compact calculator + responsive overrides */}
      <style>{`
        .rug-zoom-trigger {
          display: block;
          width: 100%;
          padding: 0;
          border: none;
          background: none;
          cursor: zoom-in;
          position: relative;
        }
        .rug-detail-image {
          object-fit: contain;
          padding: clamp(8px, 2.5%, 22px);
        }
        .rug-zoom-hint {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink);
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid var(--ink-faint);
          opacity: 0;
          transition: opacity 0.3s var(--ease-out);
          pointer-events: none;
        }
        .rug-zoom-trigger:hover .rug-zoom-hint,
        .rug-zoom-trigger:focus-visible .rug-zoom-hint {
          opacity: 1;
        }
        @media (hover: none) {
          .rug-zoom-hint { opacity: 1; }
        }

        /* Compact, wide estimate tool — output stays within the fold */
        .rug-est .est-inputs { gap: 14px; }
        .rug-est .est-group:not(:last-of-type) { padding-bottom: 12px; }
        .rug-est .est-legend { margin-bottom: 7px; }
        .rug-est .est-cards { gap: 8px; }
        .rug-est .est-card { padding: 10px 12px; min-height: 0; }
        .rug-est .est-chips { gap: 6px; }
        .rug-est .est-sizes { grid-template-columns: repeat(5, 1fr); gap: 6px; }
        .rug-est .est-size { padding: 9px 6px; min-height: 0; }
        .rug-est .est-output { margin-top: 16px; padding-top: 16px; }
        .rug-est .est-range { font-size: clamp(30px, 4vw, 42px); }

        .rug-detail-bottom-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 56px;
          align-items: start;
        }
        .rug-spec-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 24px;
          margin-top: 28px;
        }
        .rug-detail-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Lightbox */
        .rug-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(12, 10, 9, 0.93);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: rugLbFade 0.25s ease;
        }
        @keyframes rugLbFade { from { opacity: 0; } to { opacity: 1; } }
        .rug-lightbox-stage {
          max-width: 94vw;
          max-height: 92vh;
          overflow: auto;
          cursor: zoom-in;
          -webkit-overflow-scrolling: touch;
        }
        .rug-lightbox-stage img {
          display: block;
          margin: 0 auto;
          max-width: 94vw;
          max-height: 92vh;
          object-fit: contain;
          user-select: none;
        }
        .rug-lightbox-stage.is-zoomed { cursor: zoom-out; }
        .rug-lightbox-stage.is-zoomed img {
          max-width: none;
          max-height: none;
          width: auto;
          height: 165vh;
        }
        .rug-lightbox-close {
          position: fixed;
          top: 16px;
          right: 22px;
          z-index: 1001;
          width: 44px;
          height: 44px;
          font-size: 32px;
          line-height: 1;
          color: #f4eedf;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .rug-lightbox-hint {
          position: fixed;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(244, 238, 223, 0.7);
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .rug-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .rug-detail-media { position: static !important; }
          .rug-detail-bottom-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 480px) {
          .rug-spec-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
