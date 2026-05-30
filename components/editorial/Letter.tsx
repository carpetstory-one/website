'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export function Letter() {
  const t = useTranslations('Letter');

  return (
    <section className="letter" aria-label={t('label')}>
      <motion.div
        className="letter-inner"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span
          className="label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t('label')}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1] as any,
          }}
          viewport={{ once: true }}
        >
          {t('p1')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1] as any,
          }}
          viewport={{ once: true }}
        >
          {t('p2')}
        </motion.p>
        <motion.span
          className="signature"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.7,
            ease: [0.16, 1, 0.3, 1] as any,
          }}
          viewport={{ once: true }}
        >
          {t('signature')}
        </motion.span>
        <motion.span
          className="signature-meta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true }}
        >
          {t('signatureMeta')}
        </motion.span>
      </motion.div>
    </section>
  );
}
