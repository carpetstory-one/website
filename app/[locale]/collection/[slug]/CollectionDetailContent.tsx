'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import type { Collection, Rug } from '@/lib/collections';

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

export function CollectionDetailContent({
  col,
  locale,
  others,
}: {
  col: Collection;
  locale: string;
  others: Collection[];
}) {
  // Analytics event helper
  function trackView(eventName: string, props: Record<string, string>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, props);
    }
  }

  // Fire rug_viewed on mount
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
          style={{ marginBottom: '40px' }}
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
          className="rug-grid"
        >
          {col.rugs.map((rug, i) => {
            const size = rugSizes[i % rugSizes.length] as RugSize;
            const sty = rugSizeStyle[size];

            return (
              <motion.article
                key={rug.slug}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true, margin: '-60px' }}
              >
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
                      loading={i < 3 ? 'eager' : 'lazy'}
                      fetchPriority={i < 3 ? 'high' : undefined}
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
                    {String(i + 1).padStart(2, '0')}
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
        </div>
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
