'use client';

import React from 'react';
import Image from 'next/image';
import { type Piece } from '@/lib/pieces';
import { formatPrice } from '@/lib/utils';
import { SlideIn } from './SlideIn';
import { blurDataURL } from '@/lib/blur';

const UNSPLASH_BY_SLUG: Record<string, string> = {
  khwab: 'photo-1600166898405-da9535204843',
  saanjh: 'photo-1567016376408-0226e4d0c1ea',
  mehfil: 'photo-1586023492125-27b2c045efd7',
  shubh: 'photo-1555041469-a586c61ea9bc',
  naqsh: 'photo-1506439773649-6e0eb8cfb237',
  aaraam: 'photo-1558618666-fcd25c85cd64',
  rangoli: 'photo-1503602642458-232111445657',
  dharti: 'photo-1581873372796-635b67ca2008',
  baadal: 'photo-1567016526105-22da7c13161a',
  neeli: 'photo-1551516114-c2b1e8b18b35',
  gulaal: 'photo-1604147495798-57beb5d6af73',
  reet: 'photo-1505691938895-1758d7feb511',
  suraj: 'photo-1604147706285-6b6f0bd91d04',
  taara: 'photo-1567538096631-e0e1a5b0c4f5',
  maati: 'photo-1581009146145-b5ef050c2e1e',
  chaand: 'photo-1493663284031-b7e3aefcae8e',
  phool: 'photo-1493957988430-a5f2e9f51d2f',
  jheel: 'photo-1554995207-c18c203602cb',
  patthar: 'photo-1502005229762-cf1b2da7c5d6',
  resham: 'photo-1505691938895-1758d7feb511',
  kinar: 'photo-1517414204284-fb7a16e36717',
  dastaan: 'photo-1604147706285-6b6f0bd91d04',
  safed: 'photo-1493663284031-b7e3aefcae8e',
  mitti: 'photo-1581873372796-635b67ca2008',
};

function unsplashUrl(slug: string, w = 800) {
  const id = UNSPLASH_BY_SLUG[slug] ?? 'photo-1600166898405-da9535204843';
  return `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;
}

export function PieceCard({
  piece,
  index,
  fromLabel = 'From',
}: {
  piece: Piece;
  index: number;
  fromLabel?: string;
}) {
  return (
    <SlideIn direction="u" delay={(index % 3) * 100} className="w-full">
      <a href={`/collection/${piece.slug}`} className="group block cursor-pointer">
        <div
          className="aspect-[3/4] mb-6 relative overflow-hidden"
          style={{ background: piece.placeholderGradient }}
        >
          <Image
            src={unsplashUrl(piece.slug)}
            alt={`${piece.name} — ${piece.description}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            placeholder="blur"
            blurDataURL={blurDataURL()}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute top-4 left-4 bg-ink/70 text-canvas px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase z-[2]">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500 pointer-events-none" />
        </div>

        <h3 className="font-display italic font-light text-[28px] sm:text-[32px] tracking-[-0.02em] mb-2 text-ink">
          {piece.name}
        </h3>
        <p className="text-ink-soft text-[14px] leading-[1.55] mb-3 max-w-[36ch]">
          {piece.description}
        </p>
        <div className="text-[12px] text-ink-soft tracking-[0.1em] uppercase">
          {fromLabel} {formatPrice(piece.priceUSD)}
        </div>
      </a>
    </SlideIn>
  );
}
