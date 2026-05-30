'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import { featuredCollections } from '@/lib/collections';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// Mosaic placement classes — one lead card, two stacked, two below.
const place = [
  'feat-lead',
  'feat-side-1',
  'feat-side-2',
  'feat-bottom-1',
  'feat-bottom-2',
] as const;
const roman = ['I', 'II', 'III', 'IV', 'V'] as const;

export function Collection() {
  // The home page shows the first five featured collections as a mosaic.
  const featured = featuredCollections.slice(0, 5);

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
            Twelve houses. One workshop.
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
              View all 12 collections →
            </Link>
          </motion.div>
        </div>

        <div className="feat-mosaic">
          {featured.map((col, i) => {
            const eyebrow = `${roman[i]} — ${col.name.toUpperCase()}`;

            return (
              <motion.article
                key={col.slug}
                className={`feat-card ${place[i]}`}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: (i % 3) * 0.12,
                  ease: [0.16, 1, 0.3, 1] as any,
                }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <Link
                  href={`/collection/${col.slug}`}
                  aria-label={`${col.name} — ${col.tagline}`}
                  className="feat-link"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'collection_card_clicked', {
                        collection_slug: col.slug,
                        source: 'home',
                      });
                    }
                  }}
                >
                  <div className="feat-img">
                    <Image
                      src={col.heroImage}
                      alt={`${col.name} collection — ${col.tagline}`}
                      fill
                      loading="lazy"
                      sizes={
                        i === 0
                          ? '(max-width: 640px) 90vw, (max-width: 1024px) 92vw, 58vw'
                          : '(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 40vw'
                      }
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="feat-scrim" aria-hidden="true" />

                  <div className="feat-caption">
                    <span className="feat-eyebrow">{eyebrow}</span>
                    <h3 className="feat-name">{col.name}</h3>
                    <p className="feat-tag">{col.tagline}</p>
                    <span className="feat-explore">
                      Explore the collection →
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
