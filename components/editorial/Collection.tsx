'use client';

/**
 * Collection — premium bento mosaic with a tall hero card.
 *
 * A compact 2-row mosaic: one tall card spans both rows on the left,
 * two cards stack on the right, and two wider cards fill the bottom.
 * Premium hover effects with image zoom, caption slide-up, and a
 * subtle border-beam accent.
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import type { Collection as CollectionType } from '@/lib/collections';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// Mosaic placement classes
const PLACE = [
  'bm-hero',     // tall, left, spans 2 rows
  'bm-top-r1',   // top-right first
  'bm-top-r2',   // top-right second
  'bm-bot-1',    // bottom-left
  'bm-bot-2',    // bottom-right
] as const;

const ROMAN = ['I', 'II', 'III', 'IV', 'V'] as const;

export function Collection({ collections = [] }: { collections?: CollectionType[] }) {
  const feats = collections.filter((c) => c.featured);
  const others = collections.filter((c) => !c.featured);
  const subset = [...feats, ...others].slice(0, 5);

  return (
    <section
      className="collection"
      id="collection"
      aria-labelledby="collection-heading"
    >
      <div className="container">
        <div className="header">
          <motion.span
            className="label"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
          >
            I — The collection
          </motion.span>
          <motion.h2
            id="collection-heading"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0.15}
          >
            Many houses. One workshop.
          </motion.h2>
          <motion.div
            className="view-all"
            style={{ fontSize: '13px' }}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            custom={0.3}
          >
            <Link href="/collection" className="link">
              View all collections →
            </Link>
          </motion.div>
        </div>

        <div className="bm-grid" data-count={subset.length}>
          {subset.map((col, i) => {
            const place = PLACE[i] || '';
            const numeral = ROMAN[i] || `${i + 1}`;

            return (
              <motion.article
                key={col.slug}
                className={`bm-card ${place}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: (i % 3) * 0.1,
                  ease: [0.16, 1, 0.3, 1] as any,
                }}
                viewport={{ once: true, margin: '-80px' }}
              >
                <Link
                  href={`/collection/${col.slug}`}
                  aria-label={`${col.name} — ${col.tagline}`}
                  className="bm-link"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'collection_card_clicked', {
                        collection_slug: col.slug,
                        source: 'home',
                      });
                    }
                  }}
                >
                  <div className="bm-img">
                    {col.heroImage ? (
                      <Image
                        src={col.heroImage}
                        alt={`${col.name} collection — ${col.tagline}`}
                        fill
                        loading="lazy"
                        sizes={
                          i === 0
                            ? '(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 42vw'
                            : '(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 30vw'
                        }
                        placeholder="blur"
                        blurDataURL={blurDataURL()}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : null}
                  </div>

                  {/* Shimmer line on hover */}
                  <div className="bm-shimmer" aria-hidden="true" />

                  <div className="bm-scrim" aria-hidden="true" />

                  <div className="bm-caption">
                    <span className="bm-eyebrow">
                      {numeral} — {col.name.toUpperCase()}
                    </span>
                    <h3 className="bm-name">{col.name}</h3>
                    <p className="bm-tag">{col.tagline}</p>
                    <span className="bm-explore">
                      Explore
                      <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true">
                        <path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
