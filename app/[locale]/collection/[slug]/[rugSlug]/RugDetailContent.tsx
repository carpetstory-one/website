'use client';

import React from 'react';
import Image from 'next/image';
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
  // Analytics
  React.useEffect(() => {
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
      {/* ── Main two-column layout ─────────────────────────────────── */}
      <div
        className="rug-detail-grid"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '60% 1fr',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* Left: large rug image (4:5 aspect) */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              overflow: 'hidden',
              background: 'var(--canvas-muted, #f0ece3)',
            }}
          >
            <Image
              src={rug.image}
              alt={`${rug.name} — ${collection.name} collection`}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 60vw"
              placeholder="blur"
              blurDataURL={blurDataURL()}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </motion.div>

        {/* Right: sticky details column */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.15}
          style={{ position: 'sticky', top: '120px' }}
          className="rug-detail-sticky"
        >
          {/* Rug name */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: 'clamp(42px, 5vw, 68px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: '20px',
            }}
          >
            {rug.name}
          </h1>

          {/* Description */}
          {rug.description && (
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                marginBottom: '24px',
                maxWidth: '38ch',
              }}
            >
              {rug.description}
            </p>
          )}

          {/* Price — prominent, product-level (Apple-style) */}
          {rug.price && (
            <div
              style={{
                borderTop: '1px solid var(--ink-faint)',
                paddingTop: '24px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 3vw, 34px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                }}
              >
                {rug.price}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  color: 'var(--ink-soft)',
                  marginTop: '8px',
                }}
              >
                {t('priceNote')}
              </div>
            </div>
          )}

          {/* Spec strip */}
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              borderTop: '1px solid var(--ink-faint)',
              paddingTop: '28px',
              marginBottom: '36px',
            }}
          >
            {rug.materials && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('materials')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {rug.materials}
                </dd>
              </div>
            )}
            {rug.dimensions && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('dimensions')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {rug.dimensions}
                </dd>
              </div>
            )}
            {rug.knotDensity && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('density')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {rug.knotDensity}
                </dd>
              </div>
            )}
            {rug.weaveTime && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('weaveTime')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {rug.weaveTime}
                </dd>
              </div>
            )}
            {/* Fallback from collection meta */}
            {!rug.materials && collection.meta?.materials && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('materials')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {collection.meta.materials}
                </dd>
              </div>
            )}
            {!rug.knotDensity && collection.meta?.knotDensity && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('density')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {collection.meta.knotDensity}
                </dd>
              </div>
            )}
            {!rug.weaveTime && collection.meta?.leadTime && (
              <div>
                <dt
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    marginBottom: '5px',
                  }}
                >
                  {t('leadTime')}
                </dt>
                <dd
                  style={{
                    fontSize: '14px',
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {collection.meta.leadTime}
                </dd>
              </div>
            )}
            <div>
              <dt
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-soft)',
                  marginBottom: '5px',
                }}
              >
                {t('origin')}
              </dt>
              <dd
                style={{
                  fontSize: '14px',
                  color: 'var(--ink)',
                  fontWeight: 500,
                }}
              >
                {collection.meta?.origin || 'Jaipur, Rajasthan'}
              </dd>
            </div>
          </dl>

          {/* CTA buttons */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
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
        </motion.div>
      </div>

      {/* ── Estimate this piece ───────────────────────────────────── */}
      <section className="est-section" aria-labelledby="estimate-heading">
        <div className="est-section-head">
          <span className="est-section-eyebrow">{tRugs('calcEyebrow')}</span>
          <h2 id="estimate-heading" className="est-section-title">
            {tRugs('calcTitle')}
          </h2>
          <p className="est-section-sub">{tRugs('calcDesc')}</p>
        </div>
        <EstimateTool source="piece" />
      </section>

      {/* ── More from this collection ──────────────────────────────── */}
      {siblings.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--ink-faint)',
            padding: '48px 24px 72px',
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
                      style={{
                        width: '220px',
                        position: 'relative',
                        aspectRatio: '4/5',
                        overflow: 'hidden',
                        marginBottom: '14px',
                        background: 'var(--canvas-muted, #f0ece3)',
                      }}
                    >
                      <Image
                        src={sib.image}
                        alt={sib.name}
                        fill
                        loading="lazy"
                        sizes="220px"
                        placeholder="blur"
                        blurDataURL={blurDataURL()}
                        style={{ objectFit: 'cover' }}
                      />
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

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          .rug-detail-grid { grid-template-columns: 1fr !important; }
          .rug-detail-sticky { position: static !important; }
        }
      `}</style>
    </>
  );
}
