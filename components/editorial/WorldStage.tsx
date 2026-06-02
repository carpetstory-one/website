'use client';

/**
 * WorldStage — credibility / recognition moment on the home page.
 *
 * Showcases that Carpetstory's rugs were featured at Domotex 2016 (Hannover),
 * the world's leading trade fair for carpets and floor coverings, via a YouTube
 * embed.
 *
 * The video is a YouTube iframe. Paste the video ID into YOUTUBE_VIDEO_ID below
 * (the part after `watch?v=` or `youtu.be/`). While it is empty, a styled poster
 * placeholder is shown instead of a broken embed — so the section looks finished
 * right now and the real film drops in with a one-line change.
 */

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { blurDataURL } from '@/lib/blur';

// ⬇️ Paste the Domotex 2016 YouTube video ID here, e.g. 'dQw4w9WgXcQ'.
const YOUTUBE_VIDEO_ID = '';

// Poster shown behind the play button until the video ID is set.
const POSTER_IMAGE =
  'https://images.unsplash.com/photo-1646092646542-6404620730d2?q=80&w=1600&auto=format&fit=crop';

const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

function PlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15l13-7.5L7 4.5z" />
    </svg>
  );
}

export function WorldStage() {
  const t = useTranslations('WorldStage');
  const headline = t('headline', { italic: t('italic') });
  const parts = headline.split(t('italic'));

  return (
    <section className="stage" aria-labelledby="stage-heading">
      <div className="container stage-inner">
        <motion.div
          className="stage-head"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={0}
        >
          <span className="label">{t('label')}</span>
          <h2 id="stage-heading">
            {parts[0]}
            <span className="it">{t('italic')}</span>
            {parts[1]}
          </h2>
          <p className="stage-body">{t('body')}</p>
        </motion.div>

        <motion.figure
          className="stage-media"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0.18}
        >
          <div className="stage-frame">
            {YOUTUBE_VIDEO_ID ? (
              <iframe
                className="stage-iframe"
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
                title={t('videoTitle')}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                className="stage-placeholder"
                role="img"
                aria-label={t('videoTitle')}
              >
                <Image
                  src={POSTER_IMAGE}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 92vw, 960px"
                  placeholder="blur"
                  blurDataURL={blurDataURL('#160c0b')}
                  style={{ objectFit: 'cover' }}
                />
                <span className="stage-play">
                  <PlayIcon />
                </span>
                <span className="stage-soon">{t('comingSoon')}</span>
              </div>
            )}
          </div>
          <figcaption className="stage-caption">{t('videoCaption')}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
