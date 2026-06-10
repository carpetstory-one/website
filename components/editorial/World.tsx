'use client';

import { SanityImage } from '@/components/SanityImage';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { blurDataURL } from '@/lib/blur';

import type { Collection } from '@/lib/collections';

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

interface WorldProps {
  collections?: Collection[];
}

export function World({ collections = [] }: WorldProps) {
  const t = useTranslations('World');

  const allRugs = collections.flatMap((c) => c.rugs || []);

  const getRugImage = (slug: string, fallback: string) => {
    const rug = allRugs.find((r) => r.slug?.toLowerCase() === slug.toLowerCase());
    return rug?.image || fallback;
  };

  const items = [
    {
      cls: 'world-1',
      caption: t('caption1'),
      src: getRugImage(
        'khwab',
        'https://images.unsplash.com/photo-1702675990996-bd9e01288488?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
    },
    {
      cls: 'world-2',
      caption: t('caption2'),
      src: getRugImage(
        'aaraam',
        'https://images.unsplash.com/photo-1691071715735-cb7dcd31f9c6?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
    },
    {
      cls: 'world-3',
      caption: t('caption3'),
      src: getRugImage(
        'shubh',
        'https://images.unsplash.com/photo-1580229064033-d6cf020b2cf2?q=75&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ),
    },
    {
      cls: 'world-4',
      caption: t('caption4'),
      src: getRugImage(
        'naqsh',
        'https://i.pinimg.com/1200x/0f/44/f3/0f44f3fdd6d5b9e4c097d6cb6cb89c45.jpg'
      ),
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
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
        >
          {t('label')}
        </motion.span>
        <motion.h2
          id="world-heading"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0.15}
        >
          {t('headline')}
        </motion.h2>
      </div>

      <div className="world-marquee-wrapper">
        <div className="world-marquee-track">
          {duplicatedItems.map((item, index) => (
            <figure key={index} className="world-item flex-shrink-0">
              <div
                className={`ph ${item.cls} group relative mb-3 aspect-[16/10] w-full overflow-hidden md:mb-4`}
                style={{ backgroundColor: 'var(--canvas-warmer)' }}
              >
                <SanityImage
                  src={item.src}
                  alt={item.caption}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 80vw, 560px"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="caption text-ink-soft text-[13px] tracking-[0.02em]">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
