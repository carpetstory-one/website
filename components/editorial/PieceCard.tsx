'use client';

import React from 'react';
import { type Piece } from '@/lib/pieces';
import { formatPrice } from '@/lib/utils';
import { Reveal } from './Reveal';
import { SlideIn } from './SlideIn';
import { BorderBeam } from './BorderBeam';

export function PieceCard({ 
  piece, 
  index 
}: { 
  piece: Piece;
  index: number;
}) {
  const CardContent = (
    <div className="relative group">
      <div 
        className="aspect-[3/4] mb-[24px] relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-ink/0 after:transition-colors after:duration-600 after:ease-custom after:pointer-events-none group-hover:after:bg-ink/10"
        style={{ background: piece.placeholderGradient }}
      >
        <div className="absolute top-[24px] left-[24px] bg-ink/60 text-canvas px-[12px] py-[8px] text-[10px] tracking-[0.16em] uppercase z-[3]">
          {String(index + 1).padStart(2, '0')}
        </div>
        {/*
        <img 
          src={piece.image} 
          alt={`Rug named ${piece.name}`} 
          loading="lazy" 
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-transform duration-[2s] hover:scale-105"
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
        />
        */}
      </div>
      
      <h3 className="font-display italic font-light text-[38px] tracking-[-0.02em] mb-[10px] text-ink">
        {piece.name}
      </h3>
      <p className="text-ink-soft text-[14px] mb-[16px] max-w-[320px]">
        {piece.description}
      </p>
      <div className="flex justify-between items-baseline mt-[8px]">
        <div className="text-[12px] text-ink-soft tracking-[0.1em] uppercase">
          From {formatPrice(piece.priceUSD)}
        </div>
      </div>
    </div>
  );

  return (
    <SlideIn direction="u" delay={(index % 3) * 100} className="w-full h-full">
      <a href={`/collection/${piece.slug}`} className="block h-full cursor-pointer">
        {piece.featured ? (
          <BorderBeam delay={piece.beamDelay}>
            {CardContent}
          </BorderBeam>
        ) : (
          CardContent
        )}
      </a>
    </SlideIn>
  );
}
