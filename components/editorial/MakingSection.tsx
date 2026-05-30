'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ImmersiveVideo } from './ImmersiveVideo';

export function MakingSection() {
  const t = useTranslations('Making');

  return (
    <section className="making" id="making" aria-labelledby="making-heading">
      <div className="making-intro">
        <motion.span
          className="label"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {t('label')}
        </motion.span>
        <motion.h2
          id="making-heading"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as any,
          }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {t('headline')}
        </motion.h2>
      </div>

      <ImmersiveVideo />
    </section>
  );
}
