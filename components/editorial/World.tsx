"use client";

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export function World() {
  const t = useTranslations('World');

  const items = [
    { cls: 'world-1', caption: t('caption1') },
    { cls: 'world-2', caption: t('caption2') },
    { cls: 'world-3', caption: t('caption3') },
    { cls: 'world-4', caption: t('caption4') },
  ];

  return (
    <section className="world overflow-hidden" aria-labelledby="world-heading">
      <div className="header container mx-auto px-6 sm:px-8 md:px-12 mb-12 md:mb-16">
        <span className="label text-ink-soft mb-6 md:mb-8 block uppercase tracking-[0.14em] text-xs">
          {t('label')}
        </span>
        <h2
          id="world-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight"
          style={{ fontFamily: 'var(--font-fraunces), serif' }}
        >
          {t('headline')}
        </h2>
      </div>

      <div
        className="relative w-full overflow-hidden flex py-8 md:py-10"
        style={{ backgroundColor: 'var(--canvas-warm)' }}
      >
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex gap-6 md:gap-8 whitespace-nowrap px-4"
          style={{ width: 'max-content' }}
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[70vw] sm:w-[55vw] md:w-[40vw] lg:w-[25vw]"
            >
              <div
                className={`ph ${item.cls} w-full aspect-[16/10] mb-3 md:mb-4`}
                style={{ backgroundColor: 'var(--canvas-warmer)' }}
                role="img"
                aria-label={item.caption}
              ></div>
              <div className="caption text-[13px] text-ink-soft tracking-[0.02em] whitespace-normal">
                {item.caption}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
