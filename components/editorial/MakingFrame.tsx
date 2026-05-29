'use client';

import React from 'react';
import Image from 'next/image';
import { Reveal } from './Reveal';
import { blurDataURL } from '@/lib/blur';

export function MakingFrame({
  src,
  alt,
  caption,
  className = '',
  phClass = 'ph-1',
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  phClass?: string;
}) {
  return (
    <Reveal className={`making-frame relative ${className}`}>
      <div className={`ph ${phClass}`}>
        <div className="label-tag">{caption}</div>
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 95vw, 90vw"
          placeholder="blur"
          blurDataURL={blurDataURL()}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </Reveal>
  );
}
