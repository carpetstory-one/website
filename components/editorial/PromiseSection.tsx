'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

const slideIn = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

export function PromiseSection() {
  const t = useTranslations('Promise');
  const headline = t('headline', { italic: t('italic') });
  const parts = headline.split(t('italic'));

  return (
    <section className="promise" aria-label={t('label')}>
      <div className="container">
        <div className="grid-12">
          <motion.h2
            variants={slideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            custom={0}
          >
            {parts[0]}
            <span className="it">{t('italic')}</span>
            {parts[1]}
          </motion.h2>
          <motion.div
            className="aside"
            variants={slideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            custom={0.2}
          >
            <span className="label">{t('label')}</span>
            <p>{t('body')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
