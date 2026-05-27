"use client";

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export function Heritage() {
  const t = useTranslations('Heritage');

  const archive = [
    { cls: 'archive-1', label: t('archive1'), beamHost: true, beamDelay: '0s' },
    { cls: 'archive-2', label: t('archive2'), beamHost: false, beamDelay: undefined as string | undefined },
    { cls: 'archive-3', label: t('archive3'), beamHost: false, beamDelay: undefined as string | undefined },
  ];

  return (
    <section className="heritage" id="heritage" aria-labelledby="heritage-heading">
      <div className="container">
        <div className="heritage-grid">
          <motion.div
            className="heritage-text"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as any }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="label">{t('label')}</span>
            <h2 id="heritage-heading">{t('headline')}</h2>
            <p><strong>{t('p1Year')}</strong> {t('p1Body')}</p>
            <p><strong>{t('p2Year')}</strong> {t('p2Body')}</p>
            <p><strong>{t('p3Year')}</strong> {t('p3Body')}</p>
          </motion.div>
          <motion.div
            className="heritage-archive"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {archive.map((item, i) => (
              <motion.div
                className="archive-item"
                key={item.cls}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true }}
              >
                <div
                  className={`ph ${item.cls} ${item.beamHost ? 'beam-host' : ''}`}
                  style={item.beamDelay ? ({ '--beam-delay': item.beamDelay } as React.CSSProperties) : undefined}
                  role="img"
                  aria-label={item.label}
                ></div>
                <div className="archive-label">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
