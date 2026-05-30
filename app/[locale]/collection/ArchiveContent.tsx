'use client';

import { useTranslations } from 'next-intl';
import { allPieces } from '@/lib/pieces';
import { PieceCard } from '@/components/editorial/PieceCard';
import { Reveal } from '@/components/editorial/Reveal';

export function ArchiveContent() {
  const t = useTranslations('Archive');

  return (
    <main className="flex-1 px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <header className="mx-auto mb-16 max-w-2xl text-center sm:mb-24">
            <h1 className="font-display text-ink text-[44px] leading-[1] font-light tracking-[-0.02em] sm:text-[64px] md:text-[80px]">
              {t('title')}
            </h1>
            <p className="text-ink-soft mt-6 text-[15px] leading-[1.6] sm:text-[16px]">
              {t('subtitle')}
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
          {allPieces.map((piece, i) => (
            <PieceCard
              key={piece.slug}
              piece={piece}
              index={i}
              fromLabel={t('from')}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
