"use client";

import React from 'react';
import { motion } from 'motion/react';
import { HeroRugSVG } from './HeroRugSVG';
import { useTranslations } from 'next-intl';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  }),
};

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="hero">
      {/* Thread canvas behind everything */}
      <div className="thread-canvas-wrap" data-thread-host="hero"></div>

      <div className="hero-stage">
        <motion.div
          className="hero-rug"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] as any }}
        >
          <HeroRugSVG />
        </motion.div>

        <motion.div
          className="hero-topbar"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1.2}
        >
          <div className="left"><span className="label">{t('house')}</span></div>
          <div className="right">
            <span className="label">{t('location')}</span>
            <span className="divider"></span>
            <span className="label">{t('est')}</span>
            <span className="divider"></span>
            <span className="label">{t('shipping')}</span>
          </div>
        </motion.div>

        <div className="hero-headline">
          <h1 className="parallax-layer" data-depth="-0.015">
            <motion.span
              style={{ display: 'block' }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              {t('headline1')}
            </motion.span>
            <motion.span
              style={{ display: 'block', position: 'relative' }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
            >
              <span className="it">{t('headline2')}</span><span className="headline-rule"></span>
            </motion.span>
          </h1>
          <motion.div
            className="meta-right"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.9}
          >
            <span className="label">{t('knotTitle')}</span>
            <span className="num" id="hero-knot-count" data-target="2200000" data-format="m">0</span>
            <span className="label" style={{ opacity: 0.7 }}>{t('knots')}</span>
            <a href="#making" className="link always see-how magnetic" style={{ marginTop: '18px', fontSize: '13px', letterSpacing: '0.04em' }}>{t('seeHow')}</a>
          </motion.div>
        </div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] as any }}
        >
          <span className="label" style={{ opacity: 0.5, fontSize: '10px' }}>{t('scroll')}</span>
          <div className="line"></div>
        </motion.div>
      </div>
    </section>
  );
}
