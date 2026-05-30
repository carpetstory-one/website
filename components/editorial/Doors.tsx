'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Doors() {
  const t = useTranslations('Doors');

  return (
    <section
      className="doors"
      id="doors"
      style={{ padding: 0 } as React.CSSProperties}
    >
      <motion.div
        className="door door-left"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <span className="label">{t('leftLabel')}</span>
        <div>
          <h2 className="door-heading">{t('leftHeadline')}</h2>
          <p>{t('leftBody')}</p>
        </div>
        <Link
          href="/inquiry"
          className="door-cta link magnetic"
          suppressHydrationWarning
        >
          {t('leftCta')}
        </Link>
      </motion.div>
      <motion.div
        className="door door-right"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1] as any,
        }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <span className="label">{t('rightLabel')}</span>
        <div>
          <h2 className="door-heading">{t('rightHeadline')}</h2>
          <p>{t('rightBody')}</p>
        </div>
        <Link
          href="/trade"
          className="door-cta link magnetic"
          suppressHydrationWarning
        >
          {t('rightCta')}
        </Link>
      </motion.div>
    </section>
  );
}
