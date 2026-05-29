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

export function World() {
  const t = useTranslations('World');

  const items = [
    {
      cls: 'world-1',
      caption: t('caption1'),
      src: 'https://images.unsplash.com/photo-1702675990996-bd9e01288488?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cls: 'world-2',
      caption: t('caption2'),
      src: 'https://images.unsplash.com/photo-1691071715735-cb7dcd31f9c6?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cls: 'world-3',
      caption: t('caption3'),
      src: 'https://images.unsplash.com/photo-1580229064033-d6cf020b2cf2?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      cls: 'world-4',
      caption: t('caption4'),
      src: 'https://i.pinimg.com/1200x/0f/44/f3/0f44f3fdd6d5b9e4c097d6cb6cb89c45.jpg',
    },
  ];

  // Duplicate the items so the CSS loop is seamless
  const duplicatedItems = [...items, ...items];

  return (
    <section className="world" aria-labelledby="world-heading">
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
          id="world-heading"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0.15}
        >
          {t('headline')}
        </motion.h2>
      </div>

      <div className="world-marquee-wrapper">
        <div className="world-marquee-track">
          {duplicatedItems.map((item, index) => (
            <figure
              key={index}
              className="world-item flex-shrink-0"
            >
              <div
                className={`ph ${item.cls} w-full aspect-[16/10] mb-3 md:mb-4 group relative overflow-hidden`}
                style={{ backgroundColor: 'var(--canvas-warmer)' }}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 80vw, 560px"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="caption text-[13px] text-ink-soft tracking-[0.02em]">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
