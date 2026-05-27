"use client";

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

const frames = [
  { num: '01', variant: 'hero',         keyBase: 'frame1' },
  { num: '02', variant: 'offset-right', keyBase: 'frame2' },
  { num: '03', variant: 'compact',      keyBase: 'frame3' },
  { num: '04', variant: 'offset-left',  keyBase: 'frame4' },
  { num: '05', variant: 'hero',         keyBase: 'frame5' },
  { num: '06', variant: 'offset-right', keyBase: 'frame6' },
  { num: '07', variant: 'duo',          keyBase: 'frame7' },
  { num: '08', variant: 'hero',         keyBase: 'frame8' },
] as const;

const frameVariant = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any },
  },
};

const captionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] as any },
  },
};

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
          viewport={{ once: true, margin: "-80px" }}
        >
          {t('label')}
        </motion.span>
        <motion.h2
          id="making-heading"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] as any }}
          viewport={{ once: true, margin: "-80px" }}
        >
          {t('headline')}
        </motion.h2>
      </div>

      {frames.map((frame, i) => {
        const tag = t(`${frame.keyBase}Tag` as any);
        const alt = t(`${frame.keyBase}Alt` as any);
        const caption = t(`${frame.keyBase}Caption` as any);
        const hasMeta = frame.keyBase === 'frame2' || frame.keyBase === 'frame4' || frame.keyBase === 'frame6';
        const meta = hasMeta ? t(`${frame.keyBase}Meta` as any) : undefined;
        const alt2 = frame.keyBase === 'frame7' ? t('frame7Alt2') : undefined;

        return (
          <motion.div
            key={frame.num}
            className={`making-frame making-${frame.variant}`}
            variants={frameVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
          >
            {frame.variant === 'hero' && (
              <>
                <div className={`making-image ph ph-${i + 1}`} role="img" aria-label={alt}>
                  <div className="label-tag">{tag}</div>
                  <div className="ph-text">{alt}</div>
                </div>
                <motion.div
                  className="making-caption"
                  variants={captionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="label">{frame.num}</span>
                  <p>{caption}</p>
                </motion.div>
              </>
            )}

            {frame.variant === 'offset-left' && (
              <>
                <div className={`making-image ph ph-${i + 1}`} role="img" aria-label={alt}>
                  <div className="label-tag">{tag}</div>
                  <div className="ph-text">{alt}</div>
                </div>
                <motion.div
                  className="making-caption-side"
                  variants={captionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="label">{tag}</span>
                  <p>{caption}</p>
                  {meta && <div className="meta">{meta}</div>}
                </motion.div>
              </>
            )}

            {frame.variant === 'offset-right' && (
              <>
                <motion.div
                  className="making-caption-side"
                  variants={captionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="label">{tag}</span>
                  <p>{caption}</p>
                  {meta && <div className="meta">{meta}</div>}
                </motion.div>
                <div className={`making-image ph ph-${i + 1}`} role="img" aria-label={alt}>
                  <div className="label-tag">{tag}</div>
                  <div className="ph-text">{alt}</div>
                </div>
              </>
            )}

            {frame.variant === 'compact' && (
              <>
                <div className={`making-image ph ph-${i + 1}`} role="img" aria-label={alt}>
                  <div className="label-tag">{tag}</div>
                  <div className="ph-text">{alt}</div>
                </div>
                <motion.div
                  className="making-caption-center"
                  variants={captionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="label">{frame.num}</span>
                  <p>{caption}</p>
                </motion.div>
              </>
            )}

            {frame.variant === 'duo' && (
              <>
                <div className={`making-image ph ph-${i + 1}`} role="img" aria-label={alt}>
                  <div className="label-tag">{tag}</div>
                  <div className="ph-text">{alt}</div>
                </div>
                <div className={`making-image ph ph-${i + 1}b`} role="img" aria-label={alt2 || alt}>
                  <div className="ph-text">{alt2}</div>
                </div>
                <motion.div
                  className="making-caption-center"
                  variants={captionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="label">{frame.num}</span>
                  <p>{caption}</p>
                </motion.div>
              </>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
