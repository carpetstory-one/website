"use client";

import Image from 'next/image';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { blurDataURL } from '@/lib/blur';

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

export function Materials() {
  const t = useTranslations('Materials');

  const materials = [
    {
      swatchClass: 'swatch-wool',
      name: t('woolName'),
      desc: t('woolDesc'),
      origin: t('woolOrigin'),
      imgSrc: 'https://i.pinimg.com/control1/736x/bb/42/3f/bb423fa2cfb4bf90b3eb12ee569bb1ea.jpg',
      imgAlt: 'Close-up of raw wool fibers',
    },
    {
      swatchClass: 'swatch-silk',
      name: t('silkName'),
      desc: t('silkDesc'),
      origin: t('silkOrigin'),
      imgSrc: 'https://i.pinimg.com/736x/62/6e/91/626e914beaba64dfff06cf99eb1fc8da.jpg',
      imgAlt: 'Lustrous silk threads catching light',
    },
    {
      swatchClass: 'swatch-cotton',
      name: t('cottonName'),
      desc: t('cottonDesc'),
      origin: t('cottonOrigin'),
      imgSrc: 'https://i.pinimg.com/control1/736x/1e/d3/a9/1ed3a9b808f6feacca284cf3c1b69d5d.jpg',
      imgAlt: 'Raw cotton fibers and bolls',
    },
  ];

  const dyes: Array<{ key: 'madder' | 'indigo' | 'walnut'; cls: string }> = [
    { key: 'madder', cls: 'dye-madder' },
    { key: 'indigo', cls: 'dye-indigo' },
    { key: 'walnut', cls: 'dye-walnut' },
  ];

  return (
    <section className="materials" aria-labelledby="materials-heading">
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
            id="materials-heading"
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.15}
          >
            {t('headline')}
          </motion.h2>
        </div>

        <div className="materials-grid">
          {materials.map((mat, i) => (
            <motion.div
              className="material"
              key={mat.swatchClass}
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i * 0.15}
            >
              <motion.div
                className={`swatch ${mat.swatchClass}`}
                initial={{ scale: 1.05, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: i * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true }}
                role="img"
                aria-label={`${mat.name} swatch`}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <Image
                  src={mat.imgSrc}
                  alt={mat.imgAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 90vw, 360px"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
              <h3 className="material-name">{mat.name}</h3>
              <p>{mat.desc}</p>
              <div className="origin">{mat.origin}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="dyes"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="label">{t('dyesLabel')}</span>
          <div className="dyes-text">
            <h3 className="dyes-heading">{t('dyesHeadline')}</h3>
            <p>{t('dyesBody')}</p>
          </div>
          <div className="swatches">
            {dyes.map((dye, i) => (
              <motion.div
                key={dye.key}
                className={`dye-swatch ${dye.cls}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as any }}
                viewport={{ once: true }}
                role="img"
                aria-label={t(dye.key)}
              >
                <div className="swatch-label">{t(dye.key)}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
