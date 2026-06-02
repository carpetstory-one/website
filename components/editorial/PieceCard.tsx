'use client';

import React from 'react';
import Image from 'next/image';
import { type Piece } from '@/lib/pieces';
import { SlideIn } from './SlideIn';
import { blurDataURL } from '@/lib/blur';


export function PieceCard({
  piece,
  index,
}: {
  piece: Piece;
  index: number;
}) {
  return (
    <SlideIn direction="u" delay={(index % 3) * 100} className="w-full">
      <a
        href={`/collection/${piece.slug}`}
        className="group block cursor-pointer"
      >
        <div
          className="relative mb-6 aspect-[3/4] overflow-hidden"
          style={{ background: piece.placeholderGradient }}
        >
          <Image
            src={piece.image}
            alt={`${piece.name} — ${piece.description}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            placeholder="blur"
            blurDataURL={blurDataURL()}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="bg-ink/70 text-canvas absolute top-4 left-4 z-[2] px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="bg-ink/0 group-hover:bg-ink/15 pointer-events-none absolute inset-0 transition-colors duration-500" />
        </div>

        <h3 className="font-display text-ink mb-2 text-[28px] font-light tracking-[-0.02em] italic sm:text-[32px]">
          {piece.name}
        </h3>
        <p className="text-ink-soft max-w-[36ch] text-[14px] leading-[1.55]">
          {piece.description}
        </p>
      </a>
    </SlideIn>
  );
}
