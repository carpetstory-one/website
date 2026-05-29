'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import { collections } from '@/lib/collections';

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function CollectionsGrid() {
  return (
    <main className="flex-1 pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Page header */}
        <motion.header
          className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto"
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
            The Collections
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
            Twelve houses. One workshop.
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: '38ch', margin: '0 auto' }}>
            From Persian archive patterns to Moroccan long pile, every collection is woven
            in Jaipur to the same standard of construction.
          </p>
        </motion.header>

        {/* Compact 3-up overlay-tile grid */}
        <div className="col-grid">
          {collections.map((col, i) => {
            const eyebrow = `${String(i + 1).padStart(2, '0')} — ${col.name.toUpperCase()}`;
            const isEager = i < 6;

            return (
              <motion.article
                key={col.slug}
                id={`collection-card-${col.slug}`}
                className="feat-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true, margin: '-60px' }}
              >
                <Link
                  href={`/collection/${col.slug}`}
                  aria-label={`${col.name} — ${col.tagline}`}
                  className="feat-link"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'collection_card_clicked', {
                        collection_slug: col.slug,
                        source: 'index',
                      });
                    }
                  }}
                >
                  <div className="feat-img">
                    <Image
                      src={col.heroImage}
                      alt={`${col.name} collection — ${col.tagline}`}
                      fill
                      loading={isEager ? 'eager' : 'lazy'}
                      fetchPriority={i < 3 ? 'high' : undefined}
                      sizes="(max-width: 560px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL()}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="feat-scrim" aria-hidden="true" />

                  <div className="feat-caption">
                    <span className="feat-eyebrow">{eyebrow}</span>
                    <h2 className="feat-name">{col.name}</h2>
                    <p className="feat-tag">{col.tagline}</p>
                    <span className="feat-explore">Explore the collection →</span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
