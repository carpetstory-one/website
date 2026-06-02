'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { blurDataURL } from '@/lib/blur';

export function Heritage() {
  const t = useTranslations('Heritage');

  const archive = [
    {
      cls: 'archive-1',
      label: t('archive1'),
      beamHost: true,
      beamDelay: '0s',
      src: 'https://images.unsplash.com/photo-1646092646542-6404620730d2?w=700&q=80&auto=format&fit=crop',
      filter: undefined,
    },
    {
      cls: 'archive-2',
      label: t('archive2'),
      beamHost: false,
      beamDelay: undefined as string | undefined,
      src: 'https://i.pinimg.com/1200x/63/5e/fd/635efdfe1eb120e2b2a5a1948bfe528e.jpg',
      filter: undefined,
    },
    {
      cls: 'archive-3',
      label: t('archive3'),
      beamHost: false,
      beamDelay: undefined as string | undefined,
      src: 'https://i.pinimg.com/1200x/06/7b/41/067b419bd9ca18a793db2e2dbd71a376.jpg',
      filter: 'sepia(0.3) contrast(0.95)',
    },
  ];

  return (
    <section
      className="heritage"
      id="heritage"
      aria-labelledby="heritage-heading"
    >
      <div className="container">
        <div className="heritage-grid">
          <motion.div
            className="heritage-text"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as any }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="label">{t('label')}</span>
            <h2 id="heritage-heading">{t('headline')}</h2>
            <p>
              <strong>{t('p1Year')}</strong> {t('p1Body')}
            </p>
            <p>
              <strong>{t('p2Year')}</strong> {t('p2Body')}
            </p>
            <p>
              <strong>{t('p3Year')}</strong> {t('p3Body')}
            </p>
          </motion.div>
          <motion.div
            className="heritage-archive"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1] as any,
            }}
            viewport={{ once: true, margin: '-100px' }}
          >
            {archive.map((item, i) => (
              <motion.div
                className="archive-item"
                key={item.cls}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1] as any,
                }}
                viewport={{ once: true }}
              >
                <div
                  className={`ph ${item.cls} ${item.beamHost ? 'beam-host' : ''}`}
                  style={{
                    ...(item.beamDelay
                      ? ({
                          '--beam-delay': item.beamDelay,
                        } as React.CSSProperties)
                      : {}),
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 90vw, 420px"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    style={{ objectFit: 'cover', filter: item.filter }}
                  />
                </div>
                <div className="archive-label">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
