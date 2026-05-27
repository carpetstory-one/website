"use client";

import React from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type PieceMeta = {
  slug: string;
  key: string;
  imgClass: string;
  size: 'large' | 'medium' | 'small';
  beamHost?: boolean;
  beamDelay?: string;
};

const pieceMeta: PieceMeta[] = [
  { slug: 'khwab', key: 'khwab', imgClass: 'piece-1', size: 'large', beamHost: true, beamDelay: '0s' },
  { slug: 'saanjh', key: 'saanjh', imgClass: 'piece-2', size: 'small' },
  { slug: 'mehfil', key: 'mehfil', imgClass: 'piece-3', size: 'small', beamHost: true, beamDelay: '-6s' },
  { slug: 'shubh', key: 'shubh', imgClass: 'piece-4', size: 'large', beamHost: true, beamDelay: '-12s' },
  { slug: 'naqsh', key: 'naqsh', imgClass: 'piece-5', size: 'medium' },
  { slug: 'aaraam', key: 'aaraam', imgClass: 'piece-6', size: 'medium' },
];

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

export function Collection() {
  const t = useTranslations('Collection');

  return (
    <section className="collection" id="collection" aria-labelledby="collection-heading">
      <div className="container">
        <div className="header">
          <motion.span
            className="label"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
          >
            {t('label')}
          </motion.span>
          <motion.h2
            id="collection-heading"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.15}
          >
            {t('headline')}
          </motion.h2>
          <motion.div
            className="view-all"
            style={{ fontSize: '13px' }}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.3}
          >
            <Link href="/collection" className="link">
              {t('viewAll')}
            </Link>
          </motion.div>
        </div>

        <div className="collection-grid">
          {pieceMeta.map((piece, i) => {
            const name = t(`${piece.key}Name`);
            const desc = t(`${piece.key}Desc`);
            const price = t(`${piece.key}Price`);
            return (
              <motion.article
                key={piece.slug}
                className={`piece ${piece.size}`}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: (i % 2) * 0.15, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link
                  href={`/collection/${piece.slug}`}
                  aria-label={`${name} — ${desc}`}
                  className="block"
                >
                  <motion.div
                    className={`piece-img ${piece.imgClass} ${piece.beamHost ? 'beam-host' : ''}`}
                    style={piece.beamDelay ? { '--beam-delay': piece.beamDelay } as React.CSSProperties : undefined}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
                    role="img"
                    aria-label={`${name} rug`}
                  />
                </Link>
                <h2 className="piece-name">{name}</h2>
                <p>{desc}</p>
                <div className="price-line">
                  <span className="from">{price}</span>
                  <Link href={`/collection/${piece.slug}`} className="link">
                    {t('viewPiece')}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
