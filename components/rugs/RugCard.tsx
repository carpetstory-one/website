'use client';

import { SanityImage } from '@/components/SanityImage';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import { ShortlistToggleButton } from '@/components/shortlist/ShortlistToggleButton';
import type { FlatRug } from '@/lib/rugs';

export function RugCard({
  rug,
  eager = false,
}: {
  rug: FlatRug;
  index: number;
  eager?: boolean;
}) {
  return (
    <article className="rugx-card">
      <ShortlistToggleButton
        collectionSlug={rug.collectionSlug}
        rugSlug={rug.rugSlug}
        rugName={`${rug.collectionName} ${rug.name}`}
      />
      <Link href={rug.href} className="group block">
        {/* Uniform white frame — the carpet sits fully inside with even matting
            (object-fit: contain + padding handled in editorial.css). */}
        <div
          className="rugx-img"
          style={{
            aspectRatio: '3 / 4',
            background: '#ffffff',
          }}
        >
          {rug.image ? (
            <SanityImage
              src={rug.image}
              alt={`${rug.name} — ${rug.collectionName} collection`}
              fill
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : undefined}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              placeholder="blur"
              blurDataURL={blurDataURL()}
            />
          ) : null}
        </div>
        <span className="rugx-collection">{rug.collectionName}</span>
        <h3 className="rugx-name">{rug.name}</h3>
      </Link>
    </article>
  );
}
